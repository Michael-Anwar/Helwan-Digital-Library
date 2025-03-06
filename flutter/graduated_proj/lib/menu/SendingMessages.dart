import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:graduated_proj/back_flutt/crud.dart';
import 'package:graduated_proj/files_viewer/errormess.dart';
import 'package:graduated_proj/main.dart';
import 'package:graduated_proj/pages/welcome.dart';
import 'package:http/http.dart' as http;

class SendingMessages extends StatefulWidget {
  final int? value;

  const SendingMessages({Key? key, this.value}) : super(key: key);

  @override
  _SendingMessagesState createState() => _SendingMessagesState();
}

class _SendingMessagesState extends State<SendingMessages> {
  String? selectedButton;
  int? serid;
  String? reason;
  crud _crud = crud();
  String? _token = "";

  String? url = "http://10.0.2.2:5001";

  bool showComplaintTextField = false;
  bool showInquiryTextField = false;
  TextEditingController _complaintController = TextEditingController();
  TextEditingController _inquiryController = TextEditingController();

  @override
  void initState() {
    super.initState();
    getdata();
  }

  getdata() async {
    String? token = sharedpref.getString("token");
    setState(() {
      _token = token;
    });
  }

  Future<void> handlemess() async {
    if (_complaintController.text.length < 5 || _complaintController.text.isEmpty) {
      String error = "يجب ادخال الرسالة";
      ErrorDialog.showErrorDialog(context, error);
    }
  }

  Future<void> handlemess2() async {
    if (_inquiryController.text.length < 5 || _inquiryController.text.isEmpty) {
      String error = "يجب ادخال الرسالة";
      ErrorDialog.showErrorDialog(context, error);
    }
  }

  Future<void> sendData() async {
    final String apiUrl = '$url/user/contactUs'; // replace API_URL with your actual API URL
    Map<String, dynamic> data = {
      'service_id': serid,
      'selectedReson': reason,
      'message': _inquiryController.text.isNotEmpty ? _inquiryController.text : _complaintController.text,
    };

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'withCredentials': 'true',
          'Authorization': 'Bearer $_token',
        },
        body: jsonEncode(data), // Ensure the body is JSON encoded
      );

      if (response.statusCode == 200) {
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
        String errorMessage = jsonDecode(response.body)['message'][0];
                  ErrorDialog.showErrorDialog(context, errorMessage);

      }
    } catch (err) {
      print(err);
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
      theme: ThemeData(
        dialogTheme: DialogTheme(
          backgroundColor: Color(0xFF19355A),
        ),
      ),
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
                                "ارسال رسالة",
                      textAlign: TextAlign.start,
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                )),
              ],
            ),
                 
          actions: [
            IconButton(
              icon: Icon(Icons.arrow_forward),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
          backgroundColor: Color.fromARGB(255, 16, 54, 92),
        ),
        backgroundColor: Colors.white,
        body: Center(
          child: SingleChildScrollView(
            child: Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (selectedButton == null) ...[
                    Container(
                      width: 550,
                      padding: EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Color(0xFF19355A),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 20),
                            child: Text(
                              'اختر الخدمه التي تريد التواصل بشأنها',
                              style: TextStyle(
                                fontSize: 30,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                          Image.asset(
                            'assets/images/Email campaign-amico 1.png',
                            width: 900,
                            height: 200,
                            fit: BoxFit.contain,
                          ),
                          SizedBox(height: 10),
                          SizedBox(height: 16),
                          _buildButton(
                              'استخراج افادة بأن عنوان مخطط الرسالة ليس مسجل',
                              1,
                              textColor: Colors.white),
                          SizedBox(height: 20),
                          _buildButton(
                              "فحص اقتباس الرسائل العلمية بغرض التشكيل", 2,
                              textColor: Colors.white),
                          SizedBox(height: 20),
                          _buildButton(
                              'فحص الانتاج العلمي بغرض الفحص الشخصى', 3,
                              textColor: Colors.white),
                          SizedBox(height: 20),
                          _buildButton(
                              'فحص الابحاث العلمية لغرض النشر فى المجلات العلمية',
                              4,
                              textColor: Colors.white),
                          SizedBox(height: 20),
                          _buildButton('فحص الابحاث العلمية لغرض الترقيه', 5,
                              textColor: Colors.white),
                          SizedBox(height: 20),
                          _buildButton('فحص احسن رساله علميه', 6,
                              textColor: Colors.white),
                          SizedBox(height: 20),
                          _buildButton('اجراءات تسليم نسخة الكترونية', 7,
                              textColor: Colors.white),
                          SizedBox(height: 20),
                          _buildButton('خدمة بنك المعرفة', 8,
                              textColor: Colors.white),
                          SizedBox(height: 20),
                          _buildButton('استفسار او شكوى بخصوص كود الدفع', 9,
                              textColor: Colors.white),
                          SizedBox(height: 20),
                          _buildFixedSizeButton('رجوع', () {
                            Navigator.of(context).pop();
                          },
                              backgroundColor: Colors.white,
                              textColor: Color(0xFF19355A)),
                        ],
                      ),
                    ),
                  ] else ...[
                    Column(
                      children: [
                        Text(
                          'اختر سبب التواصل',
                          style: TextStyle(
                              color: Color(0xFF19355A),
                              fontSize: 30,
                              fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 30),
                        _buildOptions(),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildButton(String text, int id, {Color textColor = Colors.black}) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () {
          setState(() {
            selectedButton = text;
            serid = id;
            showComplaintTextField = text == 'استفسار او شكوى ';
            showInquiryTextField = text == 'استفسار او شكوى ';
          });
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: Color(0xFFAD8700),
          minimumSize: Size(200, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
        child: Text(
          text,
          style: TextStyle(fontSize: 14, color: textColor),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  Widget _buildOptions() {
    return Container(
      width: 550,
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Color(0xFF19355A),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'الخدمة المختارة: $selectedButton',
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          if (showComplaintTextField) ...[
            SizedBox(height: 20),
            Text(
              'السبب المختار: شكوى',
              style: TextStyle(color: Colors.white, fontSize: 18),
            ),
          ],
          if (showInquiryTextField) ...[
            SizedBox(height: 20),
            Text(
              'السبب المختار: استفسار',
              style: TextStyle(color: Colors.white, fontSize: 18),
            ),
          ],
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    showComplaintTextField = true;
                    showInquiryTextField = false;
                    reason = "1";
                    _inquiryController.clear();
                  });
                },
                child: Text(
                  'شكوى',
                  style: TextStyle(
                    color: Colors.white,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFFAD8700),
                  minimumSize: Size(120, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    showInquiryTextField = true;
                    showComplaintTextField = false;
                    reason = "2";
                    _complaintController.clear();
                  });
                },
                child: Text(
                  'استفسار',
                  style: TextStyle(
                    color: Colors.white,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFFAD8700),
                  minimumSize: Size(120, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
            ],
          ),
          if (showComplaintTextField) ...[
            SizedBox(height: 20),
            TextField(
              controller: _complaintController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'اكتب ردك هنا ...',
                fillColor: Colors.white,
                filled: true,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                await handlemess();
                if (_complaintController.text.isNotEmpty && _complaintController.text.length > 5) {
                  await sendData();
                }
              },
              child: Text(
                'إرسال',
                style: TextStyle(
                  color: Colors.white,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFFAD8700),
                minimumSize: Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
          if (showInquiryTextField) ...[
            SizedBox(height: 20),
            TextField(
              controller: _inquiryController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'اكتب ردك هنا ...',
                fillColor: Colors.white,
                filled: true,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                await handlemess2();
                if (_inquiryController.text.isNotEmpty && _inquiryController.text.length > 5) {
                  await sendData();
                }
              },
              child: Text(
                'إرسال',
                style: TextStyle(
                  color: Colors.white,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFFAD8700),
                minimumSize: Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
          SizedBox(height: 20),
          _buildFixedSizeButton('رجوع', () {
            setState(() {
              selectedButton = null;
              showComplaintTextField = false;
              showInquiryTextField = false;
            });
          }, backgroundColor: Colors.white, textColor: Color(0xFF19355A)),
        ],
      ),
    );
  }

  Widget _buildFixedSizeButton(String text, VoidCallback onPressed,
      {Color backgroundColor = const Color(0xFFAD8700), Color? textColor}) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          minimumSize: Size(200, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
        child: Text(
          text,
          style: TextStyle(fontSize: 18, color: textColor),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _complaintController.dispose();
    _inquiryController.dispose();
    super.dispose();
  }
}
