import csv, random
random.seed(7)
CATS = ["Living Room Carpets","Bedroom Rugs","Runners","Doormats","Kids Play Mats"]
def prod(i):
    cat = CATS[i % 5]
    return dict(n=f"Digital Carpet {i:03d}", cat=cat, sku=f"DC-{i:03d}",
                price=random.choice([1499,1999,2499,3499,4999,6999]),
                qty=0 if i % 9 == 0 else random.randint(3,40),
                img=[f"https://picsum.photos/seed/dc{i}a/1200/1200.jpg", f"https://picsum.photos/seed/dc{i}b/1200/1200.jpg"],
                desc=f"<p>Premium {cat.lower()} with a modern digital print. Soft pile, easy to clean.</p><ul><li>Stain resistant</li><li>Sizes available</li></ul>")

# ---- Shopify CSV ----
H = ["Handle","Title","Body (HTML)","Vendor","Product Category","Type","Tags","Published","Option1 Name","Option1 Value",
     "Variant SKU","Variant Inventory Tracker","Variant Inventory Qty","Variant Inventory Policy",
     "Variant Fulfillment Service","Variant Price","Image Src","Image Position","Status"]
with open("shopify_products.csv","w",newline="",encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(H)
    for i in range(1,51):
        p = prod(i); h = f"digital-carpet-{i:03d}"
        sizes = ["5x7 ft","6x9 ft"] if i % 10 == 0 else ["Default Title"]
        for k,s in enumerate(sizes):
            row = [h, p["n"] if k==0 else "", p["desc"] if k==0 else "", "CatalogForge Demo" if k==0 else "",
                   "", p["cat"] if k==0 else "", "carpet,demo" if k==0 else "", "TRUE" if k==0 else "",
                   "Title" if s=="Default Title" else "Size", s,
                   f'{p["sku"]}-{k+1}', "shopify", p["qty"], "deny", "manual",
                   p["price"] + 1000*k, p["img"][0] if k==0 else "", 1 if k==0 else "", "active" if k==0 else ""]
            w.writerow(row)
        w.writerow([h]+[""]*15+[p["img"][1],2,""])

# ---- WooCommerce CSV ----
with open("woo_products.csv","w",newline="",encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["Type","SKU","Name","Published","Short description","Description","In stock?","Stock","Regular price","Categories","Images"])
    for i in range(1,51):
        p = prod(i); p["n"] = p["n"].replace("Digital","Woo Digital")
        w.writerow(["simple", p["sku"].replace("DC","WC"), p["n"], 1, "Modern digital carpet", p["desc"],
                    1 if p["qty"] else 0, p["qty"], p["price"], p["cat"], ",".join(p["img"])])
print("done")
