import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:graduated_proj/back_flutt/func_need/linearprgress.dart';
import 'package:graduated_proj/files_viewer/errormess.dart';
import 'package:graduated_proj/main.dart';
import 'package:graduated_proj/menu/pageroute.dart';
import 'package:graduated_proj/pages/welcome.dart';
import 'package:http/http.dart' as http;


class bank_Almaerifa extends StatefulWidget {
  final int ? value;
    final Map<String, dynamic>? serr;


  const bank_Almaerifa({super.key,  this.value, this.serr});

  @override
  _bank_AlmaerifaState createState() => _bank_AlmaerifaState();
}

class _bank_AlmaerifaState extends State<bank_Almaerifa> {
  String? selectedValue;
  String? _level_controller;

  TextEditingController _department = TextEditingController();
  String? _token = "";
  bool uploading = false;
  bool isButtonDisabled = false;
  
  int? id;
  int? id2;
  int? status;
  Map<String, dynamic>? serrr;
  late Map<String, dynamic> data;
  String? url = "http://10.0.2.2:5001";
    int? _level_controller2;
      TextEditingController _department2 = TextEditingController();




  // Map<String, dynamic> progress = {
  //   'started': false,
  //   'value': 0,
  // };
  double progressPercentage = 0.0;

  void initState() {
    super.initState();

       serrr = widget.serr;
    id = widget.value;
    initializeState();
  }

Future<void> initializeState() async {
    await getdata();
    if (status == 3) {
      await ser8get(_token!).then((_) {
        print(_department.text);
        print(_level_controller); 
      

      });
    }
  }
  
  getdata() async {
    String? token = sharedpref.getString("token");
    setState(() {
      _token = token;

      if (id == null) {
        id = serrr!['service_id'];
        id2 = serrr!['ser_knowledge'];
        status = serrr!['status'];
      }
    });
  }
 Future<void> ser8get(String token) async {
    try {
      Uri url = Uri.parse('http://10.0.2.2:5001/paymentEdit/$id/$id2');
      final response = await http.get(url, headers: {
        'Authorization': 'Bearer $token',
        'withCredentials': 'true'
      });
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(response.body);
        print(responseData); // Log the response data
      setState(() {
  _level_controller2 = responseData['level'];
  _level_controller = _level_controller2.toString();
  _department2.text = responseData['academic'];
  _department = _department2;
});
      } else {
        // Handle other status codes
        print('Error: ${response.statusCode}');
      }
    } catch (error) {
      print('Error: $error'); // Log any caught errors
    }
  }
  Future<void> ser8send(String token) async {
    try {
      Dio dio = Dio();
      dio.options.headers['Authorization'] = 'Bearer $token';
    dio.options.headers['Content-Type'] = 'application/json'; // Change content type
      dio.options.headers['withCredentials'] = 'true';

      // FormData formData = FormData();

      // formData.fields.add(MapEntry('level', _level_controller ?? ''));
      // formData.fields.add(MapEntry('service_id', widget.value.toString()));
      //       formData.fields.add(MapEntry('academic_div',_department.text ));
        Map<String, dynamic> data = {
        'service_id': widget.value.toString(),
        'level': _level_controller,
        'academic_div': _department.text,
      };
      
      setState(() {
        uploading = true;
        isButtonDisabled = true;
      });

      Response response = await dio.put(
        'http://10.0.2.2:5001/StepTwoSer8edit/$id/$id2',
        data: data,
        onSendProgress: (sent, total) {
          setState(() {
            progressPercentage = (sent / total) * 100;
            print('Upload progress: $progressPercentage%');
          });
        },
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        setState(() {
          uploading = false;
          isButtonDisabled = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('تم ارسال طلبك بنجاح' , textAlign: TextAlign.right, style: TextStyle(fontSize: 15),),
                              ),
                            );
        Navigator.pushAndRemoveUntil(
            context,
            SlidePageRoute(
              page: Welcome(),
              animationDuration: Duration(seconds: 1),
              slideFromTop: true,
            ),
            (route) => false);
      } else {
        print("Failed to upload. Status code: ${response.statusCode}");
        print("Response body: ${response.data}");
        // Parse the error message from the response
        String errorMessage = response.data['message'][0];
                            String error =response.data['message'][0];
      ErrorDialog.showErrorDialog(context, error);
        
      }
    } catch (e) {
      setState(() {
        uploading = false;
        isButtonDisabled = false; // Disable button and interactions
      });
      print("Exception occurred: $e");
      if (e is DioException && e.response != null) {
        // Handle DioException
        String errorMessage = e.response?.data['message'][0];
        print('Response data: ${e.response?.data}');
                                    String error =e.response?.data['message'][0];
      ErrorDialog.showErrorDialog(context, error);
        
      }
    }
  }

  Future<void> ser8(String token) async {
    try {
      Dio dio = Dio();
      dio.options.headers['Authorization'] = 'Bearer $token';
      dio.options.headers['Content-Type'] = 'application/json';
      dio.options.headers['withCredentials'] = 'true';

  

      Map<String, dynamic> data = {
        'service_id': widget.value.toString(),
        'level': _level_controller,
        'academic_div': _department.text,
      };
// print('Request payload: ${formData.fields.toString()}');
      setState(() {
        uploading = true;
        isButtonDisabled = true; // Disable button and interactions
      });
      Response response = await dio.post(
        'http://10.0.2.2:5001/StepTwoSer8',
        data: data,
        onSendProgress: (sent, total) {
          setState(() {
            progressPercentage = sent / total * 100;
            print('Upload progress: $progressPercentage%');
          });
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        setState(() {
          uploading = false;
          isButtonDisabled = false; // Disable button and interactions
        });
        ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('تم ارسال طلبك بنجاح' , textAlign: TextAlign.right, style: TextStyle(fontSize: 15),),
                              ),
                            );
        // Handle success
        Future.delayed(Duration(milliseconds: 500), () {
          Navigator.pushAndRemoveUntil(
            context,
            SlidePageRoute(
              page: Welcome(),
              animationDuration: Duration(seconds: 1),
              slideFromTop: true,
            ),
            (route) => false,
          );
        });
      } else {
        setState(() {
          uploading = false;
          isButtonDisabled = false; // Disable button and interactions
        });
        print("Error: Received status code ${response.statusCode}");
        print("Response data: ${response.data}");
        // Handle server response message

        String errorMessage = response.data['message'][0];
      String error =response.data['message'][0];
      ErrorDialog.showErrorDialog(context, error);
      
      }
    } catch (e) {
      setState(() {
        uploading = false;
        isButtonDisabled = false; // Disable button and interactions
      });
      // Handle exception
      // print('Exception occurred: $e');
      if (e is DioException) {
        // print('DioException occurred: ${e.message}');
        if (e.response != null) {
          String errorMessagem = e.response!.data['message'][0];

          print('Response data: ${e.response?.data}');
                String error =e.response!.data['message'][0];
      ErrorDialog.showErrorDialog(context, error);
        
        }
      }
    }
  }

  Future<void> handlesubmit() async {
    if (_level_controller == null || _level_controller!.isEmpty) {
                      String error ="برجاء ادخال المرحلة العلمية";
      ErrorDialog.showErrorDialog(context, error);
    
    } else if (_department.text == "" || _department.text.isEmpty) {
        String error ="برجاء ادخال الشعبة الدراسية";
      ErrorDialog.showErrorDialog(context, error);
    
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        debugShowCheckedModeBanner: false,
        localizationsDelegates: [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        supportedLocales: [
          Locale('en', ''),
          Locale('ar', ''),
          Locale('ar', 'SA'),
        ],
        locale: const Locale.fromSubtags(languageCode: 'ar'),
        home: Scaffold(
          appBar: AppBar(
             titleSpacing: 0,
            title: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Expanded(
                    child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text(
                                "خدمة بنك المعرفة المصرى ",
                      textAlign: TextAlign.start,
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                )),
              ],
            ),
            actions: [
              IconButton(
                icon: Icon(Icons.arrow_forward),
                onPressed: isButtonDisabled
                    ? null // Disable button if isButtonDisabled is true
                    : () {
                        Navigator.of(context).pop();
                      },
              ),
            ],
            // title: Text('الملف الشخصي'),
            backgroundColor: Color.fromARGB(255, 16, 54, 92),
          ),
          backgroundColor: Colors.white,
          body: Stack(
            children: [
              Container(
                padding: EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                ),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset(
                        'assets/images/librarylog.jpg',
                        width: 900,
                        height: 200,
                        fit: BoxFit.contain,
                      ),
                      SizedBox(
                        height: 15,
                      ),
                      Container(
                        width: 550,
                        padding: EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Color(0xFF19355A),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Column(
                          // crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Align(
                              alignment: Alignment.center,
                              child: Text(
                                "خدمة بنك المعرفة المصرى ",
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  shadows: [
                                    Shadow(
                                      color: Colors.black,
                                      offset: Offset(2, 2),
                                      blurRadius: 5,
                                    ),
                                  ],
                                ),
                                textAlign: TextAlign.right,
                              ),
                            ),
                            SizedBox(height: 10),
                            Container(
                              height: 2,
                              width: double.infinity,
                              color: Colors.white,
                            ),
                            SizedBox(height: 16),
                            Image.asset(
                              'assets/images/serIMG copy.png',
                              width: 900,
                              height: 200,
                              fit: BoxFit.contain,
                            ),
                            SizedBox(height: 24),
                            Padding(
                              padding: EdgeInsets.symmetric(horizontal: 25),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Container(
                                      margin: EdgeInsets.only(top: 10),
                                      decoration: BoxDecoration(
                                        color:
                                            Color.fromARGB(255, 255, 255, 255),
                                        borderRadius:
                                            BorderRadius.circular(8.0),
                                      ),
                                      child: DropdownButtonFormField<String>(
                                        decoration: InputDecoration(
                                          filled: true,
                                          fillColor: Colors.transparent,
                                        ),
                                        isExpanded: true,
                                        icon: Icon(Icons.arrow_drop_down,
                                            color: Colors.black),
                                        iconSize: 20,
                                        elevation: 8,
                                        style: TextStyle(
                                            color: Colors.black, fontSize: 17),
                                        dropdownColor:
                                            Color.fromARGB(255, 255, 255, 255),
                                        value: _level_controller,
                                        onChanged: isButtonDisabled
                                            ? null
                                            : (String? newValue) {
                                                setState(() {
                                                  _level_controller = newValue!;
                                                  // print(_level_controller);
                                                });
                                              },
                                        items: [
                                          DropdownMenuItem<String>(
                                            value: "",
                                            child: Align(
                                              alignment: Alignment.centerRight,
                                              child: Text('المرحلة العلمية'),
                                            ),
                                          ),
                                          DropdownMenuItem<String>(
                                            value: '0',
                                            child: Align(
                                              alignment: Alignment.centerRight,
                                              child: Text('ماجستير'),
                                            ),
                                          ),
                                          DropdownMenuItem<String>(
                                            value: '1',
                                            child: Align(
                                              alignment: Alignment.centerRight,
                                              child: Text('دكتوراه'),
                                            ),
                                          ),
                                        ],
                                        hint: Text('المرحلة العلمية',
                                            style: TextStyle(
                                              fontSize: 17,
                                              color: Colors.black,
                                              fontWeight: FontWeight.bold,
                                            )),
                                      ),
                                    ),
                                  ),
                                  // Expanded(
                                  //     child: CustomDropdown(
                                  //         selectedValue: selectedValue,
                                  //         onChanged: (String? newValue) {
                                  //           setState(() {
                                  //             selectedValue = newValue ??
                                  //                 ""; // Handle null value if needed
                                  //             print(selectedValue);
                                  //           });
                                  //         })
                                  //         ),
                                ],
                              ),
                            ),
                            SizedBox(
                              height: 30,
                            ),
                            Container(
                              // height: 50,
                              // width: 290,
                              child: TextFormField(
                                enabled: !isButtonDisabled,
                                controller: _department,
                                autovalidateMode:
                                    AutovalidateMode.onUserInteraction,
                                validator: (value) {
                                  if (value!.isEmpty)
                                    return "من فضلك املئ الحقل";
                                },
                                decoration: InputDecoration(
                                    hintText: "الشعبة الدراسية",
                                    filled:
                                        true, // Enable filling the background
                                    fillColor: Colors.white,
                                    contentPadding: EdgeInsets.all(10),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(15),
                                      borderSide: BorderSide(
                                        color: Colors.black,

                                        //  width: 1,
                                      ),
                                    )),
                              ),
                            ),
                            SizedBox(
                              height: 20,
                            ),
                          if (uploading == true)
                              Container(child: Column(children: [
                                lin_prog(progressPercentage: progressPercentage),
                              Text(
                                          'جارى رفع الملفات',
                                          style: TextStyle(
                                            fontSize: 18,
                                            color: Color(
                                              0xFFAD8700),
                                          ),
                                        ),
                              ],) ),
                            SizedBox(
                              height: 15,
                            ),
                            ElevatedButton(
                              onPressed: isButtonDisabled
                                  ? null // Disable button if isButtonDisabled is true
                                  : () async {
                                      await handlesubmit();
                                      if (_level_controller != null &&
                                          _level_controller!.isNotEmpty &&
                                          _department.text != "") {  if (status == 3) {
                                          await ser8send(_token!);
                                        } else
                                          await ser8(_token!);
                                       }
                                    },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color(0xFFAD8700),
                                minimumSize: Size(200, 50),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                              child: Text(
                                status != 3 ? 'سجل الان' : 'تعديل البيانات',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
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
            ],
          ),
        ));
//      MaterialApp(
//       localizationsDelegates: [
//         GlobalMaterialLocalizations.delegate,
//         GlobalWidgetsLocalizations.delegate,
//         GlobalCupertinoLocalizations.delegate,
//       ],
//       supportedLocales: [
//         Locale('en', ''),
//         Locale('ar', ''),
//         Locale('ar', 'SA'),
//       ],
//       locale: const Locale.fromSubtags(languageCode: 'ar'),
//       home:  Scaffold(
//       appBar: AppBar(
//         backgroundColor: Color(0xFF003C70),
//         leading: IconButton(
//           icon: Icon(Icons.arrow_back),
//           onPressed: () {
//             Navigator.of(context).pop();
//           },
//         ),
//       ),
//       body: SingleChildScrollView(
//         child: Center(
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               Image.asset(
//                 'assets/images/librarylog.jpg',
//                 width: 900,
//                 height: 200,
//                 fit: BoxFit.contain,
//               ),
//               Container(
//                 decoration: BoxDecoration(
//                   color: Color(0xFF003C70),
//                   borderRadius: BorderRadius.only(
//                     topLeft: Radius.circular(40),
//                     topRight: Radius.circular(40),
//                   ),
//                 ),
//                 margin: EdgeInsets.only(right: 3, left: 3, top: 3),
//                 child: Column(
//                   children: [
//                     SizedBox(height: 20),
//                     Align(
//                       alignment: Alignment.center,
//                       child: Padding(
//                         padding: const EdgeInsets.only(right: 10.0),
//                         child: Text(
//                           'خدمة استخراج افادة بأن عنوان مخطط الرسالة ليس مسجل من قبل في أي من الجامعات المصرية',
//                           style: TextStyle(
//                             fontSize: 18,
//                             fontWeight: FontWeight.bold,
//                             color: Colors.white,
//                             shadows: [
//                               Shadow(
//                                 color: Colors.black,
//                                 offset: Offset(2, 2),
//                                 blurRadius: 5,
//                               ),
//                             ],
//                           ),
//                           textAlign: TextAlign.right,
//                         ),
//                       ),
//                     ),
//                     Image.asset(
//                       'assets/images/serIMG.png',
//                       width: 900,
//                       height: 200,
//                       fit: BoxFit.contain,
//                     ),
//                     SizedBox(height: 24),
//                     Padding(
//                       padding: const EdgeInsets.only(top: 2, bottom: 2),
//                       child: Column(
//                         children: [
//                           Padding(
//                             padding: const EdgeInsets.only(top: 2, bottom: 2),
//                             child: Column(
//                               children: [
//                                 Align(
//                                   alignment: Alignment.center,
//                                   child: Padding(
//                                     padding: const EdgeInsets.only(right: 10.0),
//                                     child: Text(
//                                       "                                                                                                    اختر المرحلة العلمية",
//                                       style: TextStyle(
//                                         fontSize: 20,
//                                         fontWeight: FontWeight.bold,
//                                         color: Colors.white,
//                                         shadows: [
//                                           Shadow(
//                                             color: Colors.black,
//                                             offset: Offset(2, 2),
//                                             blurRadius: 5,
//                                           ),
//                                         ],
//                                       ),
//                                       textAlign: TextAlign.right,
//                                     ),
//                                   ),
//                                 ),
//                                 SizedBox(height: 10),
//                                 Padding(
//                                   padding: EdgeInsets.symmetric(horizontal: 16),
//                                   child: Row(
//                                     children: [
//                                       Expanded(
//                                         child: Container(
//                                           margin: EdgeInsets.only(top: 17),
//                                           padding: EdgeInsets.symmetric(
//                                               horizontal: 10),
//                                           decoration: BoxDecoration(
//                                             color: const Color.fromARGB(
//                                                 255, 143, 141, 141),
//                                             borderRadius:
//                                                 BorderRadius.circular(8.0),
//                                           ),
//                                           child:
//                                               DropdownButtonFormField<String>(
//                                             decoration: InputDecoration(
//                                               filled: true,
//                                               fillColor: Colors.transparent,
//                                             ),
//                                             isExpanded: true,
//                                             icon: Icon(Icons.arrow_drop_down,
//                                                 color: Colors.white),
//                                             iconSize: 20,
//                                             elevation: 8,
//                                             style: TextStyle(
//                                                 color: Colors.white,
//                                                 fontSize: 20),
//                                             dropdownColor: const Color.fromARGB(
//                                                 255, 143, 141, 141),
//                                             value: selectedValue,
//                                             onChanged: (String? newValue) {
//                                               setState(() {
//                                                 selectedValue = newValue!;
//                                               });
//                                             },
//                                             items: [
//                                               'ماجستير',
//                                               'دكتوراه',
//                                             ].map<DropdownMenuItem<String>>(
//                                                 (String value) {
//                                               return DropdownMenuItem<String>(
//                                                 value: value,
//                                                 child: Align(
//                                                   alignment:
//                                                       Alignment.centerRight,
//                                                   child: Text(value),
//                                                 ),
//                                               );
//                                             }).toList(),
//                                             hint: Text(
//                                               'المرحلة العلمية',
//                                               style: TextStyle(
//                                                   fontSize: 20,
//                                                   color: Colors.white),
//                                             ),
//                                           ),
//                                         ),
//                                       ),
//                                     ],
//                                   ),
//                                 ),
//                                 Align(
//                                   alignment: Alignment.center,
//                                   child: Padding(
//                                     padding: const EdgeInsets.only(right: 10.0),
//                                     child: Text(
//                                       "                                                                                                        الشعبة الدراسيه",
//                                       style: TextStyle(
//                                         fontSize: 20,
//                                         fontWeight: FontWeight.bold,
//                                         color: Colors.white,
//                                         shadows: [
//                                           Shadow(
//                                             color: Colors.black,
//                                             offset: Offset(2, 2),
//                                             blurRadius: 5,
//                                           ),
//                                         ],
//                                       ),
//                                       textAlign: TextAlign.right,
//                                     ),
//                                   ),
//                                 ),
//                                 Padding(
//   padding: const EdgeInsets.symmetric(horizontal: 20.0),
//   child: Center(
//     child: Column(
//       mainAxisAlignment: MainAxisAlignment.center,
//       children: [
//         SizedBox(height: 30),
//         // Create and style a text field
//         Container(
//           decoration: BoxDecoration(
//             borderRadius: BorderRadius.circular(10.0),
//             color: Colors.grey[200],
//           ),
//           child: Padding(
//             padding: const EdgeInsets.symmetric(horizontal: 16.0), // Add space on both sides
//             child: TextField(
//   style: TextStyle(color: Colors.black),
//   decoration: InputDecoration(
//     hintText: 'الشعبة الدراسية',
//     hintStyle: TextStyle(color: Colors.grey),
//     border: InputBorder.none,
//   ),
//   textDirection: TextDirection.rtl,
// )

//           ),
//         ),
//         SizedBox(height: 30),
//       ],
//     ),
//   ),
// ),

//                                 SizedBox(height: 30),

//                                 ElevatedButton(
//                                   onPressed: () {
//                                     // Navigate to DetailsPage and pass the details as a parameter
//                                   },
//                                   style: ElevatedButton.styleFrom(
//                                     primary: Color(0xFFAD8700),
//                                     minimumSize: Size(200, 50),
//                                     shape: RoundedRectangleBorder(
//                                       borderRadius: BorderRadius.circular(20),
//                                     ),
//                                   ),
//                                   child: Text(
//                                     'سجل الان',
//                                     style: TextStyle(
//                                       fontSize: 18,
//                                       color: Colors.white,
//                                     ),
//                                   ),
//                                 ),
//                                 SizedBox(height: 30),
//                               ],
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     ));
  }
}
