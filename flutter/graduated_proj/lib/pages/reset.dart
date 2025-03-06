// ignore_for_file: unused_import

import 'package:awesome_dialog/awesome_dialog.dart';
import 'package:flutter/material.dart';
import 'package:graduated_proj/back_flutt/crud.dart';
import 'package:graduated_proj/back_flutt/decorationtext.dart/component/textcustom.dart';
import 'package:graduated_proj/back_flutt/decorationtext.dart/component/valid.dart';

import 'package:graduated_proj/back_flutt/link.dart';
import 'package:graduated_proj/files_viewer/errormess.dart';
import 'package:graduated_proj/menu/navbar.dart';
import 'package:graduated_proj/menu/pageroute.dart';
import 'package:graduated_proj/pages/login.dart';
import 'package:graduated_proj/pages/welcome.dart';

class reset extends StatefulWidget {
  const reset({Key? key});

  @override
  _resetState createState() => _resetState();
}

class _resetState extends State<reset> {
  bool _isPasswordObscured = true;
  bool _isPasswordObscured2 = true;

  TextEditingController _nationalIdController =
      TextEditingController(); // Add this
  TextEditingController _emailController = TextEditingController();
  TextEditingController _newpasscontroller = TextEditingController();
  TextEditingController _confirmPasswordController = TextEditingController();
  crud _crud = crud();
  bool isloading = false;
  GlobalKey<FormState> formstate = GlobalKey();

  resett() async {
    if (formstate.currentState!.validate()) {
      isloading = true;
      setState(() {});

      var response = await _crud.putreq(linksresett, {
        "email": _emailController.text,
        "national_id": _nationalIdController.text,
        "newpassword": _newpasscontroller.text,
        "checkpassword": _confirmPasswordController.text,
      });
      isloading = false;
      setState(() {});
      if (response != null &&
          response.containsKey('message') &&
          response['message'] == "Password changed successfully") {
        Navigator.pushAndRemoveUntil(
            context,
            SlidePageRoute(
              page: Login(),
              animationDuration: Duration(seconds: 1),
              slideFromTop: true,
            ),
            (route) => false);
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
        body: isloading == true
            ? Center(
                child: CircularProgressIndicator(),
              )
            : Padding(
              padding: const EdgeInsets.all(20.0),
              child: Container(
                  decoration: BoxDecoration(
                    color: Color.fromARGB(255, 255, 255, 255),
                  ),
                  child: Column(
                    children: [
                      Expanded(
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
                                      "نسيت كلمة السر",
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
                                                autovalid: AutovalidateMode
                                                    .onUserInteraction,
                                                preicon: Icon(Icons.email),
                                              ),
                                            ),
                                            SizedBox(height: 10),
                                            Directionality(
                                              textDirection: TextDirection.rtl,
                                              child: custtextform(
                                                valid: (val) {
                                                  return validinput(val!, 10, 30);
                                                },
                                                hint: "رقم الهوية الوطنية",
                                                mycontroller:
                                                    _nationalIdController,
                                                preicon: Icon(Icons.credit_card),
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
                                                hint: "كلمة المرور الجديدة",
                                                mycontroller: _newpasscontroller,
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
                                            SizedBox(height: 10),
                                            Directionality(
                                              textDirection: TextDirection.rtl,
                                              child: custtextform(
                                                valid: (val) {
                                                  return validinput(
                                                      val!,
                                                      8,
                                                      30,
                                                      null,
                                                      _newpasscontroller.text);
                                                },
                                                hint: " تاكيد كلمة المرور",
                                                mycontroller:
                                                    _confirmPasswordController,
                                                obstext: _isPasswordObscured2,
                                                autovalid: AutovalidateMode
                                                    .onUserInteraction,
                                                preicon: Icon(Icons.lock),
                                                suficon: GestureDetector(
                                                  onTap: () {
                                                    setState(() {
                                                      _isPasswordObscured2 =
                                                          !_isPasswordObscured2;
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
                                                await resett();
                                              },
                                              child: Text(
                                                'تغيير كلمة المرور',
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
                                            SizedBox(height: 69),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
            ),
      ),
    );
  }
}
