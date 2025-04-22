from productos.models import Productos

productos = [
    {
        "id": 1,
        "nombre": "Laptop HP",
        "precio": 2500,
        "stock": 10,
        "disponible": True,
        "imagen": "https://kaas.hpcloud.hp.com/PROD/v2/renderbinary/7948113/6957711/con-win-nb-p-eunice-23c1-hp-laptop-17-cp3000-specification/con-nb-eunice-22c2-hp-17-laptop-17-cp2000-product-image"
    },
    {
        "id": 2,
        "nombre": "Laptop HP 245",
        "precio": 1750,
        "stock": 10,
        "disponible": True,
        "imagen": "https://www.hp.com/mx-es/shop/laptop-hp-245-g9-7f211lt.html"
    },
    {
        "id": 3,
        "nombre": "Laptop PROBOOK 450",
        "precio": 2100,
        "stock": 10,
        "disponible": True,
        "imagen": "https://intecsa.com.bo/product/laptop-probook-450-g8-core-i5-1135g7-hp-ram-8gb-nvme-256gb-15-6/"
    },
    {
        "id": 4,
        "nombre": "Portátil HP 17-cp2003ns",
        "precio": 1900,
        "stock": 10,
        "disponible": True,
        "imagen": "https://www.hp.com/es-es/shop/product.aspx?id=9u8j7ea&opt=abe&sel=ntb"
    },
    {
        "id": 5,
        "nombre": "HP Stream 14 HD BrightView Laptop",
        "precio": 2150,
        "stock": 5,
        "disponible": True,
        "imagen": "https://www.pacifiko.com/compras-en-linea/hp-2022-stream-14-hd-brightview-laptop-intel-celeron-n4020"
    },
    {
        "id": 6,
        "nombre": "Laptop LATITUDE 3420 DELL",
        "precio": 2550,
        "stock": 3,
        "disponible": True,
        "imagen": "https://intecsa.com.bo/wp-content/uploads/2024/07/LATITUDE-3420.jpg"
    },
]

for p in productos:
    Productos.objects.update_or_create(id=p["id"], defaults=p)

print("✅ Productos cargados con éxito")
