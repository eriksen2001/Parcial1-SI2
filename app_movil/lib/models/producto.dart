class Producto {
  final int id;
  final String nombre;
  final double precio;
  final String imagen;
  final bool disponible;
  final int stock;

  Producto({
    required this.id,
    required this.nombre,
    required this.precio,
    required this.imagen,
    required this.disponible,
    required this.stock,
  });

  factory Producto.fromJson(Map<String, dynamic> json) {
    return Producto(
      id: json['id'],
      nombre: json['nombre'],
      precio: json['precio'].toDouble(),
      imagen: json['imagen'],
      disponible: json['disponible'],
      stock: json['stock'],
    );
  }
}
