import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import 'register_screen.dart';
import 'home_client.dart';
import 'home_admin.dart';

class LoginScreen extends StatefulWidget  {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _correoController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    final url = Uri.parse('https://primerparcialsi2-production.up.railway.app/api/users/login/');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': _correoController.text.trim(),
        'password': _passwordController.text.trim(),
      })
    );

    setState(() {
      _isLoading = false;
    });

    if (response.statusCode == 200) {

      final data = jsonDecode(response.body);

      final token = data['token'];
      final nombre = data['user']['nombre'];
      final rol = data['user']['rol'];

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);
      await prefs.setString('nombre', nombre);
      await prefs.setString('rol', rol);

      if (rol == 'Cliente') {
        Navigator.pushReplacement(context, 
          MaterialPageRoute(builder: (context) => HomeScreen()),
        );
      } else if (rol == 'Admin') {
        Navigator.pushReplacement(context, 
          MaterialPageRoute(builder: (context) => AdminScreen()),
        );
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Bienvenido $nombre')),
      );
    }
  }

  void _goToRegister() {
    /*
    Navigator.pushReplacement(context, 
      MaterialPageRoute(builder: (context) => const RegisterScreen()),
    );
    */
    Navigator.pushReplacementNamed(context, '/register');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(key: _formKey, 
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Iniciar Sesion',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 40),
                TextFormField(
                  controller: _correoController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    labelText: 'Correo electrónico',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El correo es obligatorio';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Contraseña',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'La contraseña es obligatoria';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 30),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(onPressed: _login, 
                  child: const Text('Iniciar Sesión')),
                ),
                SizedBox(height: 20),
                GestureDetector(
                  onTap: _goToRegister,
                  child: Text.rich(
                    TextSpan(
                      text: '¿No tienes cuenta? ',
                      children: [
                        TextSpan(
                          text: 'Regístrate aquí',
                          style: TextStyle(
                            color: Colors.blue,
                            fontWeight: FontWeight.bold,
                          )
                        ),
                      ],
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
