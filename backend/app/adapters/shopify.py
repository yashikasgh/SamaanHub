import time
import httpx
import nh3
from ..config import settings
from .base import NProduct, NImage, NVariant, NCategory, SourceError

QUERY = """
query($cursor: String) {
  products(first: 50, after: $cursor, query: "status:active") {
    pageInfo { hasNextPage endCursor }
    nodes {
      id handle title descriptionHtml vendor productType tags status updatedAt onlineStoreUrl
      media(first: 10) { nodes { ... on MediaImage { image { url altText } } } }
      collections(first: 10) { nodes { id title } }
      variants(first: 100) { nodes { id sku title price compareAtPrice inventoryQuantity availableForSale selectedOptions { name value } } }
    }
  }
}"""

class ShopifyAdapter:
    def __init__(self):
        self._token: str | None = None
        self._exp = 0.0

    def _get_token(self) -> str:
        if settings.shopify_access_token:
            return settings.shopify_access_token
        if self._token and time.time() < self._exp:
            return self._token
        try:
            r = httpx.post(f"https://{settings.shopify_store_domain}/admin/oauth/access_token",
                           data={"grant_type": "client_credentials", "client_id": settings.shopify_client_id,
                                 "client_secret": settings.shopify_client_secret}, timeout=20)
        except httpx.HTTPError:
            raise SourceError("Shopify store is unreachable")
        if r.status_code != 200:
            raise SourceError("Shopify rejected the credentials (check store domain, client id/secret, app installed)")
        j = r.json()
        self._token = j["access_token"]
        self._exp = time.time() + int(j.get("expires_in", 86399)) - 3600
        return self._token

    def _gql(self, query: str, variables: dict | None = None) -> dict:
        url = f"https://{settings.shopify_store_domain}/admin/api/{settings.shopify_api_version}/graphql.json"
        for attempt in range(3):
            try:
                r = httpx.post(url, json={"query": query, "variables": variables or {}},
                               headers={"X-Shopify-Access-Token": self._get_token()}, timeout=30)
            except httpx.HTTPError:
                if attempt == 2:
                    raise SourceError("Shopify store is unreachable")
                time.sleep(1.5)
                continue
            if r.status_code == 429:
                time.sleep(2 * (attempt + 1)); continue
            if r.status_code in (401, 403):
                raise SourceError("Shopify credentials rejected")
            if r.status_code >= 500:
                time.sleep(2); continue
            try:
                r.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise SourceError(f"Shopify API HTTP error: {e.response.status_code} - {e.response.text[:100]}")
            j = r.json()
            if "errors" in j:
                if "THROTTLED" in str(j["errors"]):
                    time.sleep(2); continue
                raise SourceError(f"Shopify API error: {str(j['errors'])[:300]}")
            return j["data"]
        raise SourceError("Shopify request failed after retries")

    def test_connection(self) -> None:
        self._gql("{ shop { name } }")

    def iter_products(self):
        cursor = None
        while True:
            data = self._gql(QUERY, {"cursor": cursor})["products"]
            for n in data["nodes"]:
                yield self._map(n)
            if not data["pageInfo"]["hasNextPage"]:
                break
            cursor = data["pageInfo"]["endCursor"]

    def _map(self, n: dict) -> NProduct:
        vs = n["variants"]["nodes"]
        prices = [float(v["price"]) for v in vs if v.get("price")]
        stock = sum(max(v.get("inventoryQuantity") or 0, 0) for v in vs)
        avail = "in_stock" if any(v.get("availableForSale") for v in vs) else "out_of_stock"
        compare = vs[0].get("compareAtPrice") if vs else None
        real_variants = [v for v in vs if v["title"] != "Default Title"]
        images = [NImage(m["image"]["url"], m["image"].get("altText"))
                  for m in n["media"]["nodes"] if m.get("image")]
        cats = [NCategory(c["id"], c["title"]) for c in n["collections"]["nodes"]]
        if not cats and n.get("productType"):
            cats = [NCategory("type:" + n["productType"], n["productType"])]
        return NProduct(
            external_id=n["id"], name=n["title"], sku=(vs[0].get("sku") if vs else None),
            description_html=nh3.clean(n.get("descriptionHtml") or ""),
            price=min(prices) if prices else None, compare_at_price=float(compare) if compare else None,
            availability=avail, stock_quantity=stock,
            source_url=n.get("onlineStoreUrl") or f"https://{settings.shopify_store_domain}/products/{n['handle']}",
            images=images, categories=cats,
            variants=[NVariant(v["id"], v.get("sku"), v["title"], float(v["price"]) if v.get("price") else None,
                               v.get("inventoryQuantity"), "in_stock" if v.get("availableForSale") else "out_of_stock",
                               {o["name"]: o["value"] for o in v.get("selectedOptions", [])}) for v in real_variants],
            metadata={"vendor": n.get("vendor"), "tags": n.get("tags"), "handle": n["handle"], "source_updated_at": n.get("updatedAt")},
        )
