import sys
sys.path.insert(0, ".") # run this from the backend folder so .env and app/ are found
from app.adapters import get_adapter

src = sys.argv[1]
a = get_adapter(src)
a.test_connection()
items = list(a.iter_products())
print(src, "products:", len(items))
print(items[0] if items else "No products found")
