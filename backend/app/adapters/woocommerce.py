import time
import httpx
import nh3
from ..config import settings
from .base import NProduct, NImage, NVariant, NCategory, SourceError

class WooAdapter:
    def _get(self, path: str, params: dict | None = None):
        url = f"{settings.wc_base_url.rstrip('/')}/wp-json/wc/v3/{path}"
        headers = {}
        if url.startswith("http://"):
            headers["X-Forwarded-Proto"] = "https"

        for attempt in range(3):
            try:
                r = httpx.get(url, params=params, auth=(settings.wc_consumer_key, settings.wc_consumer_secret), headers=headers, timeout=30)
            except httpx.HTTPError:
                if attempt == 2:
                    raise SourceError("WooCommerce site is unreachable")
                time.sleep(1.5)
                continue
            if r.status_code in (401, 403):
                raise SourceError("WooCommerce credentials rejected (check keys and that the site uses HTTPS)")
            if r.status_code == 404:
                raise SourceError("WooCommerce REST API not found (check URL and Permalinks = Post name)")
            if r.status_code == 429 or r.status_code >= 500:
                time.sleep(2); continue
            r.raise_for_status()
            try:
                return r.json()
            except ValueError:
                raise SourceError("WooCommerce returned an invalid response")
        raise SourceError("WooCommerce request failed after retries")

    def test_connection(self) -> None:
        self._get("products", {"per_page": 1})

    def _category_map(self) -> dict:
        cmap, page = {}, 1
        while True:
            items = self._get("products/categories", {"per_page": 100, "page": page})
            for c in items:
                cmap[c["id"]] = (c["name"], c.get("parent") or 0)
            if len(items) < 100:
                return cmap
            page += 1

    def _chain(self, cat_id: int, cmap: dict) -> list[NCategory]:
        chain, cur = [], cat_id
        while cur and cur in cmap:
            name, parent = cmap[cur]
            chain.append(NCategory(str(cur), name, str(parent) if parent else None))
            cur = parent
        return list(reversed(chain))  # ancestors first

    def iter_products(self):
        cmap = self._category_map()
        page = 1
        while True:
            items = self._get("products", {"per_page": 100, "page": page, "status": "publish"})
            for p in items:
                yield self._map(p, cmap)
            if len(items) < 100:
                break
            page += 1

    def _map(self, p: dict, cmap: dict) -> NProduct:
        def num(x):
            try:
                return float(x) if x not in ("", None) else None
            except ValueError:
                return None

        price = num(p.get("price"))
        regular = num(p.get("regular_price"))
        avail = {"instock": "in_stock", "outofstock": "out_of_stock", "onbackorder": "preorder"}.get(p.get("stock_status"), "in_stock")
        
        cats: list[NCategory] = []
        for c in p.get("categories", []):
            for nc in self._chain(c["id"], cmap):
                if all(nc.external_id != e.external_id for e in cats):
                    cats.append(nc)
                    
        variants = []
        if p.get("type") == "variable":
            for v in self._get(f"products/{p['id']}/variations", {"per_page": 100}):
                variants.append(NVariant(str(v["id"]), v.get("sku"), " / ".join(a["option"] for a in v.get("attributes", [])) or None,
                                         num(v.get("price")), v.get("stock_quantity"),
                                         {"instock": "in_stock", "outofstock": "out_of_stock", "onbackorder": "preorder"}.get(v.get("stock_status"), "in_stock"),
                                         {a["name"]: a["option"] for a in v.get("attributes", [])}))
                                         
        prices = [v.price for v in variants if v.price is not None]
        if prices:
            price = min(prices)
            
        return NProduct(
            external_id=str(p["id"]), name=p["name"], sku=p.get("sku") or None,
            description_html=nh3.clean(p.get("description") or p.get("short_description") or ""),
            price=price, compare_at_price=regular if p.get("on_sale") and regular else None,
            availability=avail, stock_quantity=p.get("stock_quantity"), source_url=p.get("permalink"),
            images=[NImage(i["src"], i.get("alt")) for i in p.get("images", []) if i.get("src")],
            categories=cats, variants=variants,
            metadata={"tags": [t["name"] for t in p.get("tags", [])], "weight": p.get("weight"), "source_modified": p.get("date_modified")},
        )
