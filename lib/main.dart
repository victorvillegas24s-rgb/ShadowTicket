import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Definición de colores base inspirados en la imagen
    const Color primaryDark = Color(0xFF131A26); // Fondo azul oscuro casi negro
    const Color accentBlue = Color(0xFF00BFFF); // Azul cian brillante para acentos
    const Color secondaryDark = Color(0xFF202A3B); // Azul oscuro para capas

    return MaterialApp(
      title: 'Ticket Shadow Support',
      // Usamos el modo oscuro para que los colores base oscuros se apliquen correctamente
      theme: ThemeData(
        brightness: Brightness.dark,
        colorScheme: ColorScheme.dark(
          primary: accentBlue, // Azul brillante para el botón principal
          onPrimary: Colors.white,
          surface: primaryDark, // Fondo principal
          background: primaryDark,
          secondary: secondaryDark,
          onSurface: Colors.white,
        ),
        useMaterial3: true,
        // Estilo de los campos de texto: sin borde visible, con relleno blanco
        inputDecorationTheme: const InputDecorationTheme(
          filled: true,
          fillColor: Colors.white, // Fondo blanco para los campos
          hintStyle: TextStyle(color: Colors.black54),
          prefixIconColor: Colors.black54,
          labelStyle: TextStyle(color: Colors.black54),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(10)),
            borderSide: BorderSide.none, // Quitamos el borde visible
          ),
          contentPadding: EdgeInsets.symmetric(vertical: 18.0, horizontal: 16.0),
        ),
        // Estilo del botón principal
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: accentBlue,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            padding: const EdgeInsets.symmetric(vertical: 15.0),
            textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
      ),
      home: const LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscureText = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() {
    final email = _emailController.text;
    final password = _passwordController.text;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Iniciando sesión con: $email'),
        duration: const Duration(seconds: 2),
      ),
    );
    print('Email: $email, Password: $password');
  }

  @override
  Widget build(BuildContext context) {
    // El 'Stack' es necesario para colocar la geometría de fondo hexagonal
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(0.0), // Elimina el AppBar
        child: AppBar(),
      ),
      body: Stack(
        children: [
          // Fondo Temático: Degradado y Patrón (Simulación del patrón hexagonal)
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF131A26), Color(0xFF0A101C)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
            child: const Opacity(
              opacity: 0.1,
              // Usamos un icono grande para simular la textura hexagonal
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.hexagon, size: 250, color: Color(0xFF00BFFF)),
                    Icon(Icons.hexagon_outlined, size: 250, color: Color(0xFF202A3B)),
                  ],
                ),
              ),
            ),
          ),

          // Contenido de la Pantalla de Login (centrado en la parte inferior)
          Align(
            alignment: Alignment.bottomCenter,
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 40.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // INICIO: Logo/Marca - Usando la imagen 'assets/logo.png'
                  Column(
                    children: [
                      // <--- Aquí se inserta el widget Image.asset --->
                      Image.asset(
                        'assets/SinFondoLogotipo.png', 
                        width: 200, // Ajusta el tamaño según sea necesario
                        // Si el logo es blanco, puedes usar ColorFilter para asegurarte que se vea
                        // color: Colors.white, 
                        // colorBlendMode: BlendMode.modulate,
                      ),
                      const SizedBox(height: 80),
                    ],
                  ),
                  // FIN: Logo/Marca

                  // Título "Iniciar Sesión"
                  const Text(
                    'Iniciar Sesión',
                    style: TextStyle(
                      fontSize: 34,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                    textAlign: TextAlign.left,
                  ),
                  const SizedBox(height: 40),

                  // Campo de Correo Electrónico
                  TextFormField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    style: const TextStyle(color: Colors.black), // Texto de entrada negro
                    decoration: const InputDecoration(
                      hintText: 'Correo Electrónico',
                      prefixIcon: Icon(Icons.person, color: Colors.black54),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Campo de Contraseña
                  TextFormField(
                    controller: _passwordController,
                    obscureText: _obscureText,
                    style: const TextStyle(color: Colors.black), // Texto de entrada negro
                    decoration: InputDecoration(
                      hintText: 'Contraseña',
                      prefixIcon: const Icon(Icons.lock, color: Colors.black54),
                      // El ícono de ojo para mostrar/ocultar contraseña
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscureText ? Icons.visibility : Icons.visibility_off,
                          color: Colors.black54,
                        ),
                        onPressed: () {
                          setState(() {
                            _obscureText = !_obscureText;
                          });
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 30),

                  // Botón "Entrar" (Estilo ya definido en el tema)
                  ElevatedButton(
                    onPressed: _login,
                    child: const Text('Entrar'),
                  ),
                  const SizedBox(height: 20),
                  
                  // Enlaces de Opción (Olvidaste y Registrarse)
                  Align(
                    alignment: Alignment.center,
                    child: Column(
                      children: [
                        TextButton(
                          onPressed: () {},
                          child: const Text(
                            '¿Olvidaste tu contraseña?',
                            style: TextStyle(color: Colors.white70),
                          ),
                        ),
                       
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}