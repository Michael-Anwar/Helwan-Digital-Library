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

class SignUp extends StatefulWidget {
  const SignUp({Key? key});

  @override
  _SignUpState createState() => _SignUpState();
}

class _SignUpState extends State<SignUp> {
  TextEditingController _nameController = TextEditingController();
  List<Map<String, dynamic>> faculty = [];
  String selectedFacultyId = '';
  Map<String, dynamic>? selectedFaculty;
  bool _isPasswordObscured = true;
  TextEditingController _nationalIdController =
      TextEditingController(); // Add this
  TextEditingController _phoneController = TextEditingController();
  TextEditingController _emailController = TextEditingController();
  TextEditingController _passwordController = TextEditingController();
  TextEditingController _confirmPasswordController = TextEditingController();
  TextEditingController _selectedNationality = TextEditingController();
  TextEditingController _collegeController = TextEditingController();
  TextEditingController _universityController = TextEditingController();
  TextEditingController _departmentController = TextEditingController();
  TextEditingController _other_uni = TextEditingController();
  TextEditingController _fac_idcontroller = TextEditingController();
  crud _crud = crud();
  bool isloading = false;
  bool _isPasswordObscured2 = true;
  // String? _selectedNationality;

  signup() async {
    if (formstate.currentState!.validate()) {
      isloading = true;
      setState(() {});
      var response = await _crud.postreq(linksignup, {
        "name": _nameController.text,
        "email": _emailController.text,
        "password": _passwordController.text,
        "checkpassword": _confirmPasswordController.text,
        "phone": _phoneController.text,
        "national_id": _nationalIdController.text,
        "nationality": _selectedNationality.text,
        "university": _universityController.text,
        "faculity": _collegeController.text,
        "department": _departmentController.text,
        "other_uni": _other_uni.text,
        "faculity_id": _fac_idcontroller.text,
      });
      isloading = false;
      setState(() {});
      if (response != null &&
          response.containsKey('message') &&
          response['message'] == "User registered successfully") {
        Navigator.pushAndRemoveUntil(
            context,
            SlidePageRoute(
              page: Login(),
              animationDuration: Duration(seconds: 2),
              slideFromTop: true,
            ),
            (route) => false);
      } else {
        String error = response['message'][0];
        ErrorDialog.showErrorDialog(context, error);
      }
    }
  }

  GlobalKey<FormState> formstate = GlobalKey();

  void initState() {
    super.initState();
    fetchData().then((data) {
      setState(() {
        faculty = data;
      });
    });
  }

  Future<List<Map<String, dynamic>>> fetchData() async {
    try {
      final response = await _crud.getreq(linksfaculit);

      if (response is List<dynamic>) {
        return List<Map<String, dynamic>>.from(response);
      } else {
        throw Exception('Invalid data format');
      }
    } catch (error) {
      print('Error fetching data: $error');
      throw Exception('Failed to load data');
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar:
         Navbar(),
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
                                    SizedBox(height: 30),
                                    Text(
                                      " انشاء حساب",
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
                                                      val!, 1, 30 ,RegExp(r'^[a-zA-Z\s]+$'));
                                                },
                                                hint: "الاسم",
                                                mycontroller: _nameController,
                                                preicon: Icon(Icons.person),
                                                autovalid: AutovalidateMode
                                                    .onUserInteraction,
                                              ),
                                            ),
                                            SizedBox(height: 10),
                                            Directionality(
                                              textDirection: TextDirection.rtl,
                                              child: custtextform(
                                                valid: (val) {
                                                  return validinput(
                                                      val!,
                                                      5,
                                                      50,
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
                                                  return validinput(
                                                      val!, 1, 40);
                                                },
                                                hint: "رقم الهوية الوطنية",
                                                mycontroller:
                                                    _nationalIdController,
                                                preicon:
                                                    Icon(Icons.credit_card),
                                                autovalid: AutovalidateMode
                                                    .onUserInteraction,
                                              ),
                                            ),
                                            SizedBox(height: 10),
                                            Directionality(
                                              textDirection: TextDirection.rtl,
                                              child: custtextform(
                                                valid: (val) {
                                                  return validinput(
                                                      val!, 1, 30);
                                                },
                                                hint: "رقم الهاتف",
                                                mycontroller: _phoneController,
                                                texinp: TextInputType.number,
                                                preicon: Icon(Icons.phone),
                                                autovalid: AutovalidateMode
                                                    .onUserInteraction,
                                              ),
                                            ),
                                            SizedBox(height: 10),
                                           Directionality(
  textDirection: TextDirection.rtl,
  child: Padding(
    padding: EdgeInsets.symmetric(vertical: 10, horizontal: 7),
    child: DropdownButtonFormField<String>(
      decoration: InputDecoration(
        hintText: 'الجنسية',
        prefixIcon: Icon(Icons.flag),
        contentPadding: EdgeInsets.symmetric(vertical: 15, horizontal: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      value: _selectedNationality.text.isNotEmpty ? _selectedNationality.text : null,
      onChanged: (newValue) {
        setState(() {
          _selectedNationality.text = newValue!;
        });
      },
      items: <String>['مصري', 'غير مصري'].map<DropdownMenuItem<String>>((String value) {
        return DropdownMenuItem<String>(
          value: value,
          child: Align(
            alignment: Alignment.centerRight,
            child: Text(
              value,
              textAlign: TextAlign.right,
            ),
          ),
        );
      }).toList(),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'يرجى اختيار الجنسية';
        }
        return null;
      },
    ),
  ),
),
                                            SizedBox(height: 10),
                                            Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.end,
                                              children: [
                                                Padding(
                                                  padding: const EdgeInsets
                                                      .symmetric(
                                                      horizontal:
                                                          7.0), // ضبط المسافة هنا
                                                  child: Align(
                                                    alignment:
                                                        Alignment.centerRight,
                                                    child: InputDecorator(
                                                      decoration:
                                                          InputDecoration(
                                                        contentPadding:
                                                            EdgeInsets
                                                                .symmetric(
                                                                    horizontal:
                                                                        10.0,
                                                                    vertical:
                                                                        5.0),
                                                        border:
                                                            OutlineInputBorder(
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(
                                                                      10.0),
                                                        ),
                                                        isDense:
                                                            true, // لتقليل المسافة العمودية
                                                      ),
                                                      child:
                                                          DropdownButtonHideUnderline(
                                                        child: DropdownButton<
                                                            String>(
                                                          isExpanded: true,
                                                          alignment: Alignment
                                                              .centerRight,
                                                          value:
                                                              _universityController
                                                                  .text,
                                                          onChanged: (value) {
                                                            setState(() {
                                                              _universityController
                                                                      .text =
                                                                  value!;
                                                            });
                                                          },
                                                          items: [
                                                            DropdownMenuItem<
                                                                String>(
                                                              alignment: Alignment
                                                                  .centerRight,
                                                              value: "",
                                                              child: Text(
                                                                "اختار جامعة",
                                                                style: TextStyle(
                                                                    fontSize:
                                                                        18),
                                                              ),
                                                            ),
                                                            DropdownMenuItem<
                                                                String>(
                                                              alignment: Alignment
                                                                  .centerRight,
                                                              value: "1",
                                                              child: Text(
                                                                  "جامعة حلوان"),
                                                            ),
                                                            DropdownMenuItem<
                                                                String>(
                                                              alignment: Alignment
                                                                  .centerRight,
                                                              value: "0",
                                                              child: Text(
                                                                  "جامعة اخرى"),
                                                            ),
                                                          ],
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                                SizedBox(height: 10),
                                                // مسافة بين الحقول
                                                if (_universityController
                                                        .text ==
                                                    "0")
                                                  Padding(
                                                    padding: const EdgeInsets
                                                        .symmetric(
                                                        horizontal:
                                                            0.0), // ضبط المسافة هنا
                                                    child: Directionality(
                                                      textDirection:
                                                          TextDirection.rtl,
                                                      child: custtextform(
                                                        valid: (val) {
                                                          return validinput(
                                                              val!, 1, 40);
                                                        },
                                                        hint: "اسم الجامعة",
                                                        mycontroller:
                                                            _other_uni,
                                                        autovalid: AutovalidateMode
                                                            .onUserInteraction,
                                                        onChange: (val) {
                                                          _fac_idcontroller
                                                              .text = '';
                                                        },
                                                        preicon: Icon(Icons
                                                            .maps_home_work),
                                                      ),
                                                    ),
                                                  ),
                                                                                                  SizedBox(height: 10),

                                                if (_universityController
                                                        .text ==
                                                    "0")
                                                  SizedBox(
                                                      height:
                                                          10), // مسافة بين الحقول
                                                if (_universityController
                                                        .text ==
                                                    "0")
                                                  Padding(
                                                    padding: const EdgeInsets
                                                        .symmetric(
                                                        horizontal:
                                                            0.0), // ضبط المسافة هنا
                                                    child: Directionality(
                                                      textDirection:
                                                          TextDirection.rtl,
                                                      child: custtextform(
                                                        valid: (val) {
                                                          return validinput(
                                                              val!, 1, 30);
                                                        },
                                                        hint: "الكلية",
                                                        onChange: (valu) {
                                                          _fac_idcontroller
                                                              .text = "";
                                                        },
                                                        mycontroller:
                                                            _collegeController,
                                                        preicon:
                                                            Icon(Icons.school),
                                                      ),
                                                      
                                                    ),
                                                    
                                                  ),
                                                if (_universityController
                                                        .text ==
                                                    "0")
                                                  SizedBox(height: 10),
                                                if (_universityController
                                                        .text ==
                                                    '1')
                                                  Padding(
                                                    padding: const EdgeInsets
                                                        .symmetric(
                                                        horizontal:
                                                            7.0), // ضبط المسافة هنا
                                                    child: Column(
                                                      crossAxisAlignment:
                                                          CrossAxisAlignment
                                                              .end,
                                                      children: [
                                                        Align(
                                                          alignment: Alignment
                                                              .centerRight,
                                                          child: InputDecorator(
                                                            decoration:
                                                                InputDecoration(
                                                              contentPadding:
                                                                  EdgeInsets.symmetric(
                                                                      horizontal:
                                                                          12.0,
                                                                      vertical:
                                                                          5.0),
                                                              border:
                                                                  OutlineInputBorder(
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            10.0),
                                                              ),
                                                              isDense:
                                                                  true, // لتقليل المسافة العمودية
                                                            ),
                                                            child:
                                                                DropdownButtonHideUnderline(
                                                              child:
                                                                  DropdownButton(
                                                                isExpanded:
                                                                    true,
                                                                alignment: Alignment
                                                                    .centerRight,
                                                                value:
                                                                    _fac_idcontroller
                                                                        .text,
                                                                items: [
                                                                  DropdownMenuItem(
                                                                    alignment:
                                                                        Alignment
                                                                            .centerRight,
                                                                    value: '',
                                                                    child: Text(
                                                                        'اختار كلية'),
                                                                  ),
                                                                  for (var fac
                                                                      in faculty)
                                                                    DropdownMenuItem(
                                                                      alignment:
                                                                          Alignment
                                                                              .centerRight,
                                                                      value: fac[
                                                                              'faculty_id']
                                                                          .toString(),
                                                                      child: Text(
                                                                          fac['faculty_name_ar']),
                                                                    ),
                                                                ],
                                                                onChanged:
                                                                    (value) {
                                                                  setState(() {
                                                                    print(
                                                                        value);
                                                                    _fac_idcontroller
                                                                            .text =
                                                                        value!
                                                                            .toString();
                                                                    _other_uni
                                                                        .text = "";
                                                                    _collegeController
                                                                        .text = "";
                                                                  });
                                                                },
                                                              ),
                                                            ),
                                                          ),
                                                        ),
                                                                                                    SizedBox(height: 10),

                                                      ],
                                                      
                                                    ),
                                                    
                                                  ),
                                              ],
                                            ),
                                            Directionality(
                                              textDirection: TextDirection.rtl,
                                              child: custtextform(
                                                valid: (val) {
                                                  return validinput(
                                                      val!, 1, 30);
                                                },
                                                hint: "القسم",
                                                mycontroller:
                                                    _departmentController,
                                                     autovalid: AutovalidateMode
                                                    .onUserInteraction,
                                                preicon: Icon(Icons.apartment),
                                              ),
                                            ),
                                            SizedBox(height: 10),
                                            Directionality(
                                              textDirection: TextDirection.rtl,
                                              child: custtextform(
                                                valid: (val) {
                                                  return validinput(
                                                      val!, 8, 40);
                                                },
                                                hint: "كلمة المرور",
                                                mycontroller:
                                                    _passwordController,
                                                autovalid: AutovalidateMode
                                                    .onUserInteraction,
                                                obstext: _isPasswordObscured,
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
                                                      40,
                                                      null,
                                                      _passwordController.text);
                                                },
                                                hint: " تاكيد كلمة المرور",
                                                mycontroller:
                                                    _confirmPasswordController,
                                                autovalid: AutovalidateMode
                                                    .onUserInteraction,
                                                obstext: _isPasswordObscured2,
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
                                                await signup();
                                              },
                                              child: Text(
                                                ' انشاء حساب',
                                                style: TextStyle(
                                                  fontSize: 24,
                                                  color: Colors.white,
                                                ),
                                              ),
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor:
                                                    Color(0xFFAD8700),
                                                padding: EdgeInsets.symmetric(
                                                    horizontal: 100,
                                                    vertical: 5),
                                                shape: RoundedRectangleBorder(
                                                  borderRadius:
                                                      BorderRadius.circular(30),
                                                ),
                                              ),
                                            ),
                                            SizedBox(height: 10),
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
                                                      return Login(); // تغيير Login() بالشاشة المناسبة
                                                    },
                                                  ),
                                                );
                                              },
                                              child: Text(
                                                "لديك حساب؟ سجل دخول..",
                                                style: TextStyle(
                                                  fontSize: 18,
                                                  color: Color(0xFFAD8700),
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
