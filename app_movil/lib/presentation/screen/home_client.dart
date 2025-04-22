import 'package:app_movil/models/carrito.dart';
import 'package:app_movil/presentation/screen/carrito_screen.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../models/producto.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Producto> _productos = [];
  List<CarritoItem> _carrito = [];
  bool _isLoading = true;

  Future<void> _fetchProductos() async {
    final response = await http.get(
      Uri.parse(
        'https://primerparcialsi2-production.up.railway.app/api/products/getproducts/',
      ),
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _productos = data.map((item) => Producto.fromJson(item)).toList();
        _isLoading = false;
      });
    } else {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error al cargar productos')),
      );
    }
  }

  Future<void> _cerrarSesion(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.clear();

    Navigator.pushReplacementNamed(context, '/login');
  }

  void _agregarCarrito(Producto producto) {
    final index = _carrito.indexWhere(
      (item) => item.producto.id == producto.id,
    );

    setState(() {
      if (index >= 0) {
        _carrito[index].cantidad++; //ya existe el producto y aumentamos contador
      } else {
        _carrito.add(CarritoItem(producto: producto)); //nuevo producto agregado
       } 
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${producto.nombre} añadido al carrito')),
    );
  }

  @override
  void initState() {
    super.initState();
    _fetchProductos();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Smart Cart',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => _cerrarSesion(context),
          ),
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () {
              // vamos al carrito
              Navigator.push(context, MaterialPageRoute(builder: (_) => CarritoScreen(carrito: _carrito)));
            },
          ),
          IconButton(
            icon: const Icon(Icons.mic),
            onPressed: () {
              // Aquí se activaría el reconocimiento de voz
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Micrófono activado')),
              );
            },
          ),
        ],
      ),
      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : Padding(
                padding: const EdgeInsets.all(12),
                child: GridView.builder(
                  itemCount: _productos.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2, // 2 columnas
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio:
                        0.75, // proporción para que no se vean aplastados
                  ),
                  itemBuilder: (context, index) {
                    final producto = _productos[index];

                    return Card(
                      elevation: 3,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Expanded(
                            child: ClipRRect(
                              borderRadius: const BorderRadius.vertical(
                                top: Radius.circular(12),
                              ),
                              child: Image.network(
                                producto.imagen,
                                fit: BoxFit.cover,
                                errorBuilder:
                                    (_, __, ___) => const Icon(
                                      Icons.broken_image,
                                      size: 60,
                                    ),
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  producto.nombre,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Bs ${producto.precio.toStringAsFixed(2)}',
                                  style: const TextStyle(color: Colors.green),
                                ),
                                const SizedBox(height: 8),
                                SizedBox(
                                  width: double.infinity,
                                  child: ElevatedButton(
                                    onPressed: () => _agregarCarrito(producto),
                                    child: const Text('Añadir'),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
    );
  }
}
