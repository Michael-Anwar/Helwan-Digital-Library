// ignore_for_file: unused_field, unused_import

import 'package:awesome_dialog/awesome_dialog.dart';
import 'package:flutter/material.dart';
import 'package:graduated_proj/back_flutt/crud.dart';
import 'package:graduated_proj/back_flutt/decorationtext.dart/component/textcustom.dart';
import 'package:graduated_proj/back_flutt/decorationtext.dart/component/valid.dart';
import 'package:graduated_proj/back_flutt/link.dart';
import 'package:graduated_proj/files_viewer/errormess.dart';
import 'package:graduated_proj/main.dart';
import 'package:graduated_proj/menu/navbar.dart';
import 'package:graduated_proj/pages/reset.dart';
import 'package:graduated_proj/pages/signup.dart';
import 'package:graduated_proj/pages/welcome.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../menu/pageroute.dart';

class AnimationsRoute extends MaterialPageRoute {
  AnimationsRoute({required Widget page})
      : super(builder: (BuildContext context) => page);
}

class Login extends StatefulWidget {
  const Login({Key? key});

  @override
  _LoginState createState() => _LoginState();
}

bool setlogged = false;

class _LoginState extends State<Login> {
  TextEditingController _nameController = TextEditingController();

  bool _isPasswordObscured = true;
  TextEditingController _emailController = TextEditingController();
  TextEditingController _passwordController = TextEditingController();
  GlobalKey<FormState> formstate = GlobalKey();
  crud _crud = crud();
  bool isloading = false;

  login() async {
    if (formstate.currentState!.validate()) {
      isloading = true;
      setState(() {});

      var response = await _crud.postreq(linkslogin, {
        "email": _emailController.text,
        "password": _passwordController.text,
      });
      isloading = false;
      setState(() {});
      if (response != null &&
          response.containsKey('login') &&
          response['login'] == true) {
        sharedpref.setString("token", response["token"]);
        sharedpref.setString("id", response['user']['id'].toString());
        tokenn = response["token"];
        //  print(tokenn);

        sharedpref.setString("name", response['user']['name']);
        sharedpref.setString("email", response['user']['email']);
        sharedpref.setString(
            "national_id", response['user']['national_id'].toString());
        sharedpref.setString("phone", response['user']['phone'].toString());
        sharedpref.setString("nationality", response['user']['nationality']);
        sharedpref.setString(
            "faculity_id", response['user']['faculity_id'].toString());

        sharedpref.setString(
            "university", response['user']['university'].toString());
        sharedpref.setString(
            "faculity", response['user']['faculity'].toString());
        sharedpref.setString("department", response['user']['department']);
        sharedpref.setString("img", response['user']['img']);

        setlogged = true;
        SharedPreferences prefs = await SharedPreferences.getInstance();
        prefs.setBool('setlogged', setlogged);

        Navigator.pushAndRemoveUntil(
  context,
  PageRouteBuilder(
    transitionDuration: Duration(seconds: 1),
    transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
      return ScaleTransition(
        scale: animation,
        child: child,
      );
    },
    pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
      return Welcome(); // تغيير Welcome() بالشاشة المناسبة
    },
  ),
  (route) => false,
);

      } else {
        String error = response['message'][0];
        ErrorDialog.showErrorDialog(context, error);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: Navbar(),
        drawer: NavbarDrawer(),
        body: Container(
          decoration: BoxDecoration(
            color: Color.fromARGB(255, 255, 255, 255),
          ),
          child: Column(
            children: [
              Expanded(
                child: isloading == true
                    ? Center(
                        child: CircularProgressIndicator(),
                      )
                    : Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: ListView(
                          children: [
                            Form(
                                key: formstate,
                                child: Center(
                                    child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Image.asset(
                                      'assets/images/librarylog.jpg',
                                      width: 700,
                                      height: 150,
                                    ),
                                    SizedBox(height: 10),
                                    Text(
                                      "تسجيل دخول",
                                      style: TextStyle(
                                        fontSize: 30,
                                        fontWeight: FontWeight.w600,
                                        color: Color(0xFFAD8700),
                                        fontFamily: 'Roboto',
                                      ),
                                    ),
                                    SizedBox(height: 5),
                                    SingleChildScrollView(
                                      child: Container(
                                        width: double.infinity,
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          borderRadius: BorderRadius.only(
                                            topLeft: Radius.circular(40),
                                            topRight: Radius.circular(40),
                                          ),
                                        ),
                                        child: Column(
                                          children: [
                                            SizedBox(height: 10),
                                            Directionality(
                                              textDirection: TextDirection.rtl,
                                              child: custtextform(
                                                valid: (val) {
                                                  return validinput(
                                                      val!,
                                                      5,
                                                      30,
                                                      RegExp(
                                                          r'^[\w-]+(\.[\w-]+)*@([\w-]+\.)+edu.+eg$'));
                                                },
                                                hint: "البريد الالكترونى",
                                                mycontroller: _emailController,
                                                preicon: Icon(Icons.email),
                                                autovalid: AutovalidateMode
                                                    .onUserInteraction,
                                              ),
                                            ),
                                            SizedBox(height: 10),
                                            Directionality(
                                              textDirection: TextDirection.rtl,
                                              child: custtextform(
                                                valid: (val) {
                                                  return validinput(val!, 8, 30);
                                                },
                                                hint: "كلمة المرور",
                                                mycontroller: _passwordController,
                                                obstext: _isPasswordObscured,
                                                autovalid: AutovalidateMode
                                                    .onUserInteraction,
                                                preicon: Icon(Icons.lock),
                                                suficon: GestureDetector(
                                                  onTap: () {
                                                    setState(() {
                                                      _isPasswordObscured =
                                                          !_isPasswordObscured;
                                                    });
                                                  },
                                                  child: Icon(
                                                    _isPasswordObscured
                                                        ? Icons.visibility_off
                                                        : Icons.visibility,
                                                  ),
                                                ),
                                              ),
                                            ),
                                            SizedBox(height: 30),
                                            ElevatedButton(
                                              onPressed: () async {
                                                // Continue with validation and account creation
                                                await login();
                                              },
                                              child: Text(
                                                'تسجيل دخول',
                                                style: TextStyle(
                                                  fontSize: 24,
                                                  color: Colors.white,
                                                ),
                                              ),
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor:
                                                    Color(0xFFAD8700),
                                                padding: EdgeInsets.symmetric(
                                                    horizontal: 100, vertical: 5),
                                                shape: RoundedRectangleBorder(
                                                  borderRadius:
                                                      BorderRadius.circular(30),
                                                ),
                                              ),
                                            ),
                                            SizedBox(height: 16),
                                            TextButton(
                                              onPressed: () {
                                                Navigator.pushReplacement(
                                                  context,
                                                  PageRouteBuilder(
                                                    transitionDuration:
                                                        Duration(seconds: 1),
                                                    transitionsBuilder:
                                                        (BuildContext context,
                                                            Animation<double>
                                                                animation,
                                                            Animation<double>
                                                                secondaryAnimation,
                                                            Widget child) {
                                                      return ScaleTransition(
                                                        scale: animation,
                                                        child: child,
                                                      );
                                                    },
                                                    pageBuilder: (BuildContext
                                                            context,
                                                        Animation<double>
                                                            animation,
                                                        Animation<double>
                                                            secondaryAnimation) {
                                                      return SignUp(); // تغيير الشاشة هنا إلى الشاشة المناسبة
                                                    },
                                                  ),
                                                );
                                              },
                                              child: Text(
                                                'لا تمتلك حساب؟ سجل الآن',
                                                style: TextStyle(
                                                  fontSize: 18,
                                                  color: Color(0xFFAD8700),
                                                ),
                                              ),
                                            ),
                    
                                            TextButton(
                                              onPressed: () {
                                                Navigator.push(
                                                  context,
                                                  PageRouteBuilder(
                                                    transitionDuration:
                                                        Duration(seconds: 1),
                                                    transitionsBuilder:
                                                        (BuildContext context,
                                                            Animation<double>
                                                                animation,
                                                            Animation<double>
                                                                secondaryAnimation,
                                                            Widget child) {
                                                      return ScaleTransition(
                                                        scale: animation,
                                                        child: child,
                                                      );
                                                    },
                                                    pageBuilder: (BuildContext
                                                            context,
                                                        Animation<double>
                                                            animation,
                                                        Animation<double>
                                                            secondaryAnimation) {
                                                      return reset(); // تغيير الشاشة هنا إلى الشاشة المناسبة
                                                    },
                                                  ),
                                                );
                                              },
                                              child: Text(
                                                'نسيت كلمة المرور',
                                                style: TextStyle(
                                                  fontSize: 18,
                                                  color: Color(0xFFAD8700),
                                                ),
                                              ),
                                            ),
                    
                                            SizedBox(height: 69),
                                            // mina
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ))),
                          ],
                        ),
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
