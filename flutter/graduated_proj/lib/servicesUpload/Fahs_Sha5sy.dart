import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:graduated_proj/back_flutt/crud.dart';
import 'package:graduated_proj/back_flutt/func_need/linearprgress.dart';
import 'package:graduated_proj/files_viewer/errormess.dart';
import 'package:graduated_proj/main.dart';
import 'package:graduated_proj/menu/pageroute.dart';
import 'package:graduated_proj/pages/welcome.dart';

class Fahs_Sha5syService extends StatefulWidget {
  final int? value;
  final Map<String, dynamic>? serr;

  const Fahs_Sha5syService({super.key, this.value, this.serr});

  @override
  _Fahs_Sha5syServiceState createState() => _Fahs_Sha5syServiceState();
}

class _Fahs_Sha5syServiceState extends State<Fahs_Sha5syService> {
  int numberOfResearches = 0;
  String defaultWord = 'ادخل عدد الابحاث';
  crud _crud = crud();
  String? _token = "";
  int? id;
  int? id2;
  int? status;
  int numberOfResearches2 = 0;
  Map<String, dynamic>? serrr;
  late Map<String, dynamic> data;

  bool uploading = false;
  bool isButtonDisabled = false;
  double progressPercentage = 0.0;

  Future<void> handlesub() async {
    if (numberOfResearches == 0) {
              String error ="برجاء ادخال عدد الابحاث";
      ErrorDialog.showErrorDialog(context, error);
      
    }
  }

  void initState() {
    super.initState();
    serrr = widget.serr;
    id = widget.value;

    initializeState();
  }

  Future<void> initializeState() async {
    await getdata();
   
  }

  getdata() async {
    String? token = sharedpref.getString("token");
    setState(() {
      _token = token;

      if (id == null) {
        id = serrr!['service_id'];
        id2 = serrr!['ser_personal'];
        status = serrr!['status'];
        numberOfResearches = serrr!['files_numbers'];
      }
    });
  }

  // Future<void> ser3get(String token) async {
  //   try {
  //     Uri url = Uri.parse('http://10.0.2.2:5001/paymentEdit/$id/$id2');
  //     final response = await http.get(url, headers: {
  //       'Authorization': 'Bearer $token',
  //       'withCredentials': 'true'
  //     });
  //     if (response.statusCode == 200 || response.statusCode == 201) {
  //       final responseData = json.decode(response.body);
  //       print(responseData); // Log the response data
  //       setState(() {
  //         numberOfResearches2 = responseData['files_numbers'];
  //         numberOfResearches = numberOfResearches2;
  //       });
  //     } else {
  //       // Handle other status codes
  //       print('Error: ${response.statusCode}');
  //     }
  //   } catch (error) {
  //     print('Error: $error'); // Log any caught errors
  //   }
  // }

  Future<void> ser3send(String token) async {
    try {
      Dio dio = Dio();
      dio.options.headers['Authorization'] = 'Bearer $token';
      dio.options.headers['Content-Type'] = 'multipart/form-data';
      dio.options.headers['withCredentials'] = 'true';

      FormData formData = FormData();

      formData.fields.add(MapEntry('service_id', widget.value.toString()));
      formData.fields
          .add(MapEntry('files_numbers', numberOfResearches.toString() ));

      setState(() {
        uploading = true;
        isButtonDisabled = true;
      });

      Response response = await dio.put(
        'http://10.0.2.2:5001/paymentEdit/$id/$id2',
        data: formData,
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
  

  Future<void> ser3(String token) async {
    try {
      Dio dio = Dio();
      dio.options.headers['Authorization'] = 'Bearer $token';
      dio.options.headers['Content-Type'] = 'multipart/form-data';
      dio.options.headers['withCredentials'] = 'true';
      FormData formData = FormData();
      formData.fields
          .add(MapEntry('files_numbers', numberOfResearches.toString()));
      formData.fields.add(MapEntry('service_id', widget.value.toString()));
      setState(() {
        uploading = true;
        isButtonDisabled = true;
      });

      Response response = await dio.post(
        'http://10.0.2.2:5001/payment',
        data: formData,
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
          isButtonDisabled = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('تم ارسال طلبك بنجاح' , textAlign: TextAlign.right, style: TextStyle(fontSize: 15),),
                              ),
                            );
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
        isButtonDisabled = false;
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
                                'فحص الانتاج العلمي لغرض الفحص الشخصى',
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
                    ? null
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
                                'فحص الانتاج العلمي لغرض الفحص الشخصى',
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
                            // SizedBox(height: 24),

                            SizedBox(height: 24),

                            Container(
                              width: 200,
                              height: 50, // Adjust the width as needed
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              // padding: EdgeInsets.all(7),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  IconButton(
                                    icon: Icon(Icons.arrow_drop_up),
                                    onPressed: isButtonDisabled
                                        ? null
                                        : () {
                                            setState(() {
                                              if (numberOfResearches < 10) {
                                                numberOfResearches++;
                                              }
                                            });
                                          },
                                  ),
                                  Expanded(
                                    child: Text(
                                      numberOfResearches == 0
                                          ? defaultWord
                                          : numberOfResearches.toString(),
                                      style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  IconButton(
                                    icon: Icon(Icons.arrow_drop_down),
                                    onPressed: isButtonDisabled
                                        ? null
                                        : () {
                                            setState(() {
                                              if (numberOfResearches > 0) {
                                                numberOfResearches--;
                                              }
                                            });
                                          },
                                  ),
                                ],
                              ),
                            ),
                            SizedBox(height: 20),

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
                            SizedBox(height: 15),

                            ElevatedButton(
                              onPressed: isButtonDisabled
                                  ? null
                                  : () async {
                                      await handlesub();
                                      if (numberOfResearches != 0){
                                        if (status == 4) {
                                          await ser3send(_token!);
                                        } else
                                        await ser3(_token!);}
                                      // Navigate to DetailsPage and pass the details as a parameter
                                    },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color(0xFFAD8700),
                                disabledBackgroundColor: Color(0xFFAD8700),
                                minimumSize: Size(200, 50),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                              child: Text(
                                status != 4 ? 'سجل الان' : 'تعديل البيانات',
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
  }
}

    // return MaterialApp(
    //   localizationsDelegates: [
    //     GlobalMaterialLocalizations.delegate,
    //     GlobalWidgetsLocalizations.delegate,
    //     GlobalCupertinoLocalizations.delegate,
    //   ],
    //   supportedLocales: [
    //     Locale('en', ''),
    //     Locale('ar', ''),
    //     Locale('ar', 'SA'),
    //   ],
    //   locale: const Locale.fromSubtags(languageCode: 'ar'),
    //   home: Scaffold(
    //   appBar: AppBar(
    //     backgroundColor: Color(0xFF003C70),
    //     leading: IconButton(
    //       icon: Icon(Icons.arrow_back),
    //       onPressed: () {
    //         Navigator.of(context).pop();
    //       },
    //     ),
    //   ),
    //   body: SingleChildScrollView(
    //     child: Center(
    //       child: Column(
    //         mainAxisAlignment: MainAxisAlignment.center,
    //         children: [
    //           Image.asset(
    //             'assets/images/librarylog.jpg',
    //             width: 900,
    //             height: 200,
    //             fit: BoxFit.contain,
    //           ),
    //           Container(
    //             decoration: BoxDecoration(
    //               color: Color(0xFF003C70),
    //               borderRadius: BorderRadius.only(
    //                 topLeft: Radius.circular(40),
    //                 topRight: Radius.circular(40),
    //               ),
    //             ),
    //             margin: EdgeInsets.only(right: 3, left: 3, top: 3),
    //             child: Column(
    //               children: [
    //                 SizedBox(height: 20),
    //                 Align(
    //                   alignment: Alignment.center,
    //                   child: Padding(
    //                     padding: const EdgeInsets.only(right: 10.0),
    //                     child: Text(
    //                       'فحص الانتاج العلمي لغرض الفحص الشخصى',
    //                       style: TextStyle(
    //                         fontSize: 18,
    //                         fontWeight: FontWeight.bold,
    //                         color: Colors.white,
    //                         shadows: [
    //                           Shadow(
    //                             color: Colors.black,
    //                             offset: Offset(2, 2),
    //                             blurRadius: 5,
    //                           ),
    //                         ],
    //                       ),
    //                       textAlign: TextAlign.right,
    //                     ),
    //                   ),
    //                 ),
    //                 Image.asset(
    //                   'assets/images/serIMG.png',
    //                   width: 900,
    //                   height: 200,
    //                   fit: BoxFit.contain,
    //                 ),
    //                 SizedBox(height: 24),
    //                 Padding(
    //                   padding: const EdgeInsets.only(top: 2, bottom: 2),
    //                   child: Column(
    //                     children: [
    //                       Align(
    //                         alignment: Alignment.center,
    //                         child: Padding(
    //                           padding: const EdgeInsets.only(right: 10.0),
    //                           child: Text(
    //                             "ادخل عدد الابحاث",
    //                             style: TextStyle(
    //                                 fontSize: 20,
    //                                 fontWeight: FontWeight.bold,
    //                                 color: Colors.white,
    //                               // shadows: [
    //                               //   Shadow(
    //                               //     color: Colors.black,
    //                               //     offset: Offset(2, 2),
    //                               //     blurRadius: 5,
    //                               //   ),
    //                               // ],
    //                             ),
    //                             textAlign: TextAlign.right,
    //                           ),
    //                         ),
    //                       ),
    //                       SizedBox(height: 20),
    //                       Container(
    //                         width: 300,
    //                         height: 100, // Adjust the width as needed
    //                         decoration: BoxDecoration(
    //                           color: Colors.white,
    //                           borderRadius: BorderRadius.circular(10),
    //                         ),
    //                         padding: EdgeInsets.all(10),
    //                         child: Column(
    //                           children: [
    //                             Text(
    //                               numberOfResearches == 0 ? defaultWord : numberOfResearches.toString(),
    //                               style: TextStyle(fontSize: 16),
    //                             ),
    //                             Row(
    //                               mainAxisAlignment: MainAxisAlignment.center,
    //                               children: [
    //                                 IconButton(
    //                                   icon: Icon(Icons.arrow_drop_up),
    //                                   onPressed: () {
    //                                     setState(() {
    //                                       if (numberOfResearches < 10) {
    //                                         numberOfResearches++;
    //                                       }
    //                                     });
    //                                   },
    //                                 ),
    //                                 IconButton(
    //                                   icon: Icon(Icons.arrow_drop_down),
    //                                   onPressed: () {
    //                                     setState(() {
    //                                       if (numberOfResearches > 1) {
    //                                         numberOfResearches--;
    //                                       }
    //                                     });
    //                                   },
    //                                 ),
    //                               ],
    //                             ),
    //                           ],
    //                         ),
    //                       ),
    //                       SizedBox(height: 20),
    //                       ElevatedButton(
    //                         onPressed: () {
    //                           // Perform the action with the entered number of researches
    //                           print("Number of Researches: $numberOfResearches");
    //                         },
    //                         style: ElevatedButton.styleFrom(
    //                           backgroundColor: Color(0xFFAD8700),
    //                           minimumSize: Size(200, 50),
    //                           shape: RoundedRectangleBorder(
    //                             borderRadius: BorderRadius.circular(20),
    //                           ),
    //                         ),
    //                         child: Text(
    //                           'سجل الان',
    //                           style: TextStyle(
    //                             fontSize: 18,
    //                             color: Colors.white,
    //                           ),
    //                         ),
    //                       ),
    //                       SizedBox(height: 30),
    //                     ],
    //                   ),
    //                 ),
    //               ],
    //             ),
    //           ),
    //         ],
    //       ),
    //     ),
    //   ),
    // )
    // );
 