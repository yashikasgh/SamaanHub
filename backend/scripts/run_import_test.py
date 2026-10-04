import sys
sys.path.insert(0, ".")
from app.services.sync_engine import start_run, execute_run
from sqlalchemy import text
from app.db import engine

print("Starting Shopify import...")
rid, sid = start_run("shopify", "import", "cli")
execute_run(rid, sid, "shopify")
print("Import complete.")

with engine.connect() as c:
    prods = c.execute(text("select count(*) from products where source_id = :sid"), {"sid": sid}).scalar()
    cats = c.execute(text("select count(*) from categories where source_id = :sid"), {"sid": sid}).scalar()
    imgs = c.execute(text("select count(*) from product_images i join products p on p.id = i.product_id where p.source_id = :sid"), {"sid": sid}).scalar()
    vars = c.execute(text("select count(*) from product_variants v join products p on p.id = v.product_id where p.source_id = :sid"), {"sid": sid}).scalar()
    
    run = c.execute(text("select * from sync_runs where id = cast(:rid as uuid)"), {"rid": rid}).mappings().first()
    errs = c.execute(text("select count(*) from sync_errors where sync_run_id = cast(:rid as uuid)"), {"rid": rid}).scalar()

print(f"Products: {prods}")
print(f"Categories: {cats}")
print(f"Images: {imgs}")
print(f"Variants: {vars}")
print(f"Sync Run Status: {run['status']}")
print(f"Created: {run['created_count']}, Updated: {run['updated_count']}, Unchanged: {run['unchanged_count']}, Failed: {run['failed_count']}")
print(f"Errors: {errs}")
