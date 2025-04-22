import 'package:app_movil/presentation/screen/home_client.dart';
import 'package:app_movil/presentation/screen/login_screen.dart';
import 'package:app_movil/presentation/screen/register_screen.dart';
import './presentation/screen/splash_screen.dart';

import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  //Stripe.publishableKey = 'pk_test_51RFL1uC5x86sUovdCMNfvpvao25A3jiDXOOJvcF4VnjFEn6pTSrJHNAHxbuqpDvma2hzTah8WO01wM17P4qA7MOq006yNSaOpA';

  //await Stripe.instance.applySettings();

  runApp(const SmartCartApp());
}

class SmartCartApp extends StatelessWidget {
  const SmartCartApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Cart POS',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.indigo,
      ),
      home: SplashScreen(),
      routes: {
        '/login': (context) => LoginScreen(),
        '/register': (context) => RegisterScreen(),
        'home': (context) => HomeScreen(),
      },
    );
  }
}
