import sys
sys.path.insert(0, "./backend")
from sqlalchemy import text
from app.db import engine

sql = """
insert into categories(name, slug, position) values ('Test Category','test-category',1) on conflict do nothing;
with s as (select id from sources where type='manual'),
p as (insert into products(source_id, external_id, slug, name, sku, price, availability, thumb_url)
select s.id, 'seed-'||g, 'seed-product-'||g, 'Seed Product '||g, 'SEED-'||g, 999*g, 'in_stock',
'https://picsum.photos/seed/seed'||g||'/600/600.jpg' from s, generate_series(1,3) g on conflict do nothing returning id)
insert into product_categories select p.id, (select id from categories where slug='test-category') from p on conflict do nothing;
"""

conn = engine.connect()
conn.execute(text(sql))
conn.commit()
conn.close()
print("Seeded successfully!")
