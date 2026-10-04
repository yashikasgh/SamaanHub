from dataclasses import dataclass, field
from typing import Iterator, Protocol

class SourceError(Exception):
    """Safe-to-display error from an external source (never contains secrets)."""

@dataclass
class NImage:
    url: str
    alt: str | None = None

@dataclass
class NVariant:
    external_id: str
    sku: str | None = None
    title: str | None = None
    price: float | None = None
    stock: int | None = None
    availability: str = "in_stock"
    options: dict = field(default_factory=dict)

@dataclass
class NCategory:
    external_id: str
    name: str
    parent_external_id: str | None = None

@dataclass
class NProduct:
    external_id: str
    name: str
    sku: str | None = None
    description_html: str = ""
    price: float | None = None
    compare_at_price: float | None = None
    currency: str = "INR"
    availability: str = "in_stock"
    stock_quantity: int | None = None
    source_url: str | None = None
    images: list[NImage] = field(default_factory=list)
    variants: list[NVariant] = field(default_factory=list)
    categories: list[NCategory] = field(default_factory=list)  # ancestors first, then the category itself
    metadata: dict = field(default_factory=dict)

class SourceAdapter(Protocol):
    def test_connection(self) -> None: ...
    def iter_products(self) -> Iterator[NProduct]: ...
