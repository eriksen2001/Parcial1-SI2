import 'package:flutter_stripe/flutter_stripe.dart' as stripe;
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:app_movil/models/carrito.dart';
import 'package:flutter/material.dart';

class CarritoScreen extends StatefulWidget {
  final List<CarritoItem> carrito;

  const CarritoScreen({super.key, required this.carrito});

  @override
  State<CarritoScreen> createState() => _CarritoScreenState();
}

class _CarritoScreenState extends State<CarritoScreen> {

  void _incrementarCantidad(int index) {
    setState(() {
      widget.carrito[index].cantidad++;
    });
  }

  void _disminuirCantidad(int index) {
    setState(() {
      if (widget.carrito[index].cantidad > 1) {
        widget.carrito[index].cantidad--;
      }
    });
  }

  void _eliminarProducto(int index) {
    setState(() {
      widget.carrito.removeAt(index);
    });
  }

  double get _calcularTotal {
    return widget.carrito.fold(
      0, 
      (sum, item) => sum + (item.producto.precio * item.cantidad)
    );
  }

  Future<void> _realizarPagoStripe(BuildContext context, double total) async {
    try {
      const clientSecret = 'pi_3RFMRiC5x86sUovd0ZV1kuh8_secret_6BQHutUKGGdht5ohyW9idCpcZ';

      await stripe.Stripe.instance.initPaymentSheet(
      paymentSheetParameters: stripe.SetupPaymentSheetParameters(
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'Smart Cart',
        ),
      );

      await stripe.Stripe.instance.presentPaymentSheet();

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('✅ ¡Pago exitoso en modo test!')),
      );

      //setState(() => widget.carrito.clear());

    } catch (e) {
      if (e is stripe.StripeException) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('❌ Pago cancelado: ${e.error.localizedMessage}')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('❌ Error inesperado: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
        return Scaffold(
      appBar: AppBar(title: const Text('Tu carrito')),
      body: widget.carrito.isEmpty
          ? const Center(child: Text('El carrito está vacío'))
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: widget.carrito.length,
                    itemBuilder: (context, index) {
                      final item = widget.carrito[index];
                      return Card(
                        margin: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        child: ListTile(
                          leading: Image.network(
                            item.producto.imagen,
                            width: 50,
                            height: 50,
                            fit: BoxFit.cover,
                          ),
                          title: Text(item.producto.nombre),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                  'Precio: Bs ${item.producto.precio.toStringAsFixed(2)}'),
                              Row(
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.remove),
                                    onPressed: () =>
                                        _disminuirCantidad(index),
                                  ),
                                  Text('${item.cantidad}'),
                                  IconButton(
                                    icon: const Icon(Icons.add),
                                    onPressed: () =>
                                        _incrementarCantidad(index),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          trailing: IconButton(
                            icon: const Icon(Icons.delete, color: Colors.red),
                            onPressed: () => _eliminarProducto(index),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const Divider(thickness: 1),
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Total:',
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                      Text(
                        'Bs ${_calcularTotal.toStringAsFixed(2)}',
                        style: const TextStyle(
                            fontSize: 18, color: Colors.green),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.payment), 
                    label: const Text('Proceder al pago'),
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size.fromHeight(50),
                      backgroundColor: Colors.green,
                    ),
                    onPressed: () => _realizarPagoStripe(context, _calcularTotal),
                  ),
                ),
              ],
            ),
    );
  }
}