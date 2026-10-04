from .base import SourceError

def get_adapter(source_type: str):
    if source_type == "shopify":
        from .shopify import ShopifyAdapter
        return ShopifyAdapter()
    if source_type == "woocommerce":
        from .woocommerce import WooAdapter
        return WooAdapter()
    raise SourceError(f"Unknown source: {source_type}")
