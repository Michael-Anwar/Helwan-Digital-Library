import 'package:flutter/material.dart';
import 'package:graduated_proj/menu/init.dart';
import 'package:graduated_proj/pages/instructions.dart';
import 'package:graduated_proj/pages/login.dart';
import 'package:graduated_proj/pages/reset.dart';
import 'package:graduated_proj/pages/ser.dart';
import 'package:graduated_proj/pages/services.dart';
import 'package:graduated_proj/pages/signup.dart';
import 'package:graduated_proj/pages/welcome.dart';
import 'package:shared_preferences/shared_preferences.dart';

late SharedPreferences sharedpref;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  sharedpref = await SharedPreferences.getInstance();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      initialRoute:
          // sharedpref.getString("token") == null || setlogged==false ? "/login" :
          "/initr",
      routes: {
        "/": (context) => Welcome(),
        "/signup": (context) => const SignUp(),
        "/login": (context) => const Login(),
        "/reset": (context) => reset(),
        "/reset1": (context) => instructions(
              value: 0,
            ),
        "/ser": (context) => ser(
              value: 0,
            ),
        "/initr": (context) => initr(),
        "/services": (context) => services(),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}
