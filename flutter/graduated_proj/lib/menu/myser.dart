// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables, dead_code, unused_import

import 'dart:convert';
import 'dart:io';

import 'package:awesome_dialog/awesome_dialog.dart';
import 'package:flutter/material.dart';
import 'package:graduated_proj/back_flutt/crud.dart';
import 'package:graduated_proj/back_flutt/link.dart';
import 'package:graduated_proj/main.dart';
// import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:graduated_proj/menu/about_liberary.dart';
import 'package:graduated_proj/menu/navbar.dart';
import 'package:graduated_proj/menu/pageroute.dart';
import 'package:graduated_proj/pages/instructions.dart';
import 'package:graduated_proj/pages/login.dart';
import 'package:graduated_proj/pages/ser%202.dart';
import 'package:graduated_proj/pages/serstep2.dart';
import 'package:graduated_proj/pages/signup.dart';
import 'package:graduated_proj/pages/welcome.dart';
import 'package:http/http.dart' as http;

class myser extends StatefulWidget {
  @override
  State<myser> createState() => _myserState();
}

class _myserState extends State<myser> {
  //  crud _crud = crud();
  String? _token = "";

  List<Map<String, dynamic>> servicewait = [];
  @override
  void initState() {
    super.initState();
    getdata();

    initializeData();
  }

  getdata() async {
    String? token = sharedpref.getString("token");
    setState(() {
      _token = token;
    });
  }

  initializeData() async {
    await fetchData(_token!).then((data) {
      setState(() {
        servicewait = data;
        print(servicewait);
      });
    });
  }

  Future<List<Map<String, dynamic>>> fetchData(String token) async {
    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:5001/getallwaiting'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
          'withCredentials': 'true'
        },
      );

      // Check the response status code
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data is List) {
          return List<Map<String, dynamic>>.from(data);
        } else {
          print('Unexpected response format: $data');
          return [];
        }
      } else {
        print('HTTP Error: ${response.statusCode}');
        return [];
      }
    } catch (error) {
      // Log error and return an empty list
      print('Error fetching data: $error');
      return [];
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
 appBar: AppBar(
              titleSpacing: 0,
            title: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Expanded(
                    child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text(
                                " حالة الخدمات ",
                      textAlign: TextAlign.end,
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                )),
              ],
            ),
          // title: Text('wait'),
        backgroundColor: Color.fromARGB(255, 16, 54, 92),
      ),
      body: SingleChildScrollView(
        child: Container(
          child: Column(
            children: [
              SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  'قائمة انتظار الخدمات التي قمت بالتسجيل فيها',
                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                    color: Color.fromARGB(255, 16, 54, 92),
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              SizedBox(height: 10), // إضافة مسافة بين النصوص
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  'الخدمات التي حصلت علي رد نهائي بها (القبول او الرفض) سوف تجدها في الملف الشخصي',
                  style: TextStyle(
                    fontSize: 20,
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              SizedBox(height: 20),
              // Text("$servicewait")
              ListView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount: servicewait.length,
                itemBuilder: (BuildContext context, int index) {
                  return Container(
                    child: _buildServiceContainer(servicewait[index]),
                    margin: EdgeInsets.all(7),
                    padding: EdgeInsets.all(7), // Add margin for space
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildServiceContainer(Map<String, dynamic> service) {
    return service['status'] != 5 && service['status'] != 6
        ? Container(
            padding: EdgeInsets.all(20),
            width: 900,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.5),
                  spreadRadius: 5,
                  blurRadius: 7,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  service['service_name_ar'],
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 20),
                Container(
                  margin: EdgeInsets.symmetric(horizontal: 20),
                  height: .5,
                  width: 500, // يمكنك ضبط العرض حسب الحاجة
                  color: Colors.black,
                ),
                SizedBox(height: 40),
                Image.asset(
                  service['status'] == 1
                      ? "assets/images/Email campaign-amico 2.png"
                      : 'assets/images/Email campaign-amico 1.png',
                  fit: BoxFit.contain,
                ),
                SizedBox(height: 10),

                (service['status'] == 1 ||
                        service['status'] == 0 &&
                            service['service_id'] != 7 &&
                            service['service_id'] != 8)
                    ? Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Expanded(
                            child: Text(
                              service['payment_note_ar'] ?? "",
                              style: TextStyle(
                                fontSize: 15,
                                color: Color.fromARGB(255, 0, 0, 0),
                                // fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.right,
                            ),
                          ),
                        ],
                      )
                    : SizedBox.shrink(),
                SizedBox(height: 20),

                if (service['status'] == 1)
                  Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text(
                          "كود الدفع",
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ]),
                // SizedBox(height: 5),
                service['status'] == 0
                    ? Container(
                        width: 320, // تحديد عرض المستطيل
                        decoration: BoxDecoration(
                          color: Color(0xFFAD8700), // تحديد لون المستطيل
                          borderRadius: BorderRadius.circular(
                              10), // إضافة حواف مدورة للمستطيل
                        ),
                        padding: EdgeInsets.all(20),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Text(
                              'انتظار كود الدفع الخاص بالخدمة',
                              style: TextStyle(
                                fontSize: 20,
                                color: Colors.black,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(width: 10),
                            Icon(
                              Icons.hourglass_empty, // أيقونة الساعة الرملية
                              color: Color.fromARGB(255, 16, 54, 92),
                            ),
                          ],
                        ),
                      )
                    : service['status'] == 1
                        ? (Container(
                            width: 320,
                            decoration: BoxDecoration(
                              color: Color.fromARGB(255, 134, 134, 134),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            padding: EdgeInsets.all(20),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  service['payment_code'],
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.black,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(width: 10),
                              ],
                            ),
                          ))
                        : service['status'] == 2
                            ? Container(
                                width: 320, // تحديد عرض المستطيل
                                decoration: BoxDecoration(
                                  color:
                                      Color(0xFFAD8700), // تحديد لون المستطيل
                                  borderRadius: BorderRadius.circular(
                                      10), // إضافة حواف مدورة للمستطيل
                                ),
                                padding: EdgeInsets.all(20),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    Text(
                                      'في انتظار الرد من المكتبة',
                                      style: TextStyle(
                                        fontSize: 23,
                                        color: Colors.black,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    SizedBox(width: 10),
                                    Icon(
                                      Icons
                                          .hourglass_empty, // أيقونة الساعة الرملية
                                      color: Color.fromARGB(255, 16, 54, 92),
                                    ),
                                  ],
                                ),
                              )
                            : service['status'] == 3
                                ? Container(
                                    width: 320, // تحديد عرض المستطيل
                                    decoration: BoxDecoration(
                                      color: Color(
                                          0xFFAD8700), // تحديد لون المستطيل
                                      borderRadius: BorderRadius.circular(
                                          10), // إضافة حواف مدورة للمستطيل
                                    ),
                                    padding: EdgeInsets.all(20),
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            Text(
                                              service['response_text'].toString(),
                                              style: TextStyle(
                                                fontSize: 20,
                                                color: Colors.black,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            SizedBox(width: 10),
                                            Icon(
                                              Icons
                                                  .hourglass_empty, // أيقونة الساعة الرملية
                                              color: Color.fromARGB(
                                                  255, 16, 54, 92),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  )
                                : service['status'] == 4
                                    ? Container(
                                        width: 320, // تحديد عرض المستطيل
                                        decoration: BoxDecoration(
                                          color: Color(
                                              0xFFAD8700), // تحديد لون المستطيل
                                          borderRadius: BorderRadius.circular(
                                              10), // إضافة حواف مدورة للمستطيل
                                        ),
                                        padding: EdgeInsets.all(20),
                                        child: Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            Row(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: [
                                                Text(
                                                  service['response_text'],
                                                  style: TextStyle(
                                                    fontSize: 20,
                                                    color: Colors.black,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                SizedBox(width: 10),
                                                Icon(
                                                  Icons
                                                      .hourglass_empty, // أيقونة الساعة الرملية
                                                  color: Color.fromARGB(
                                                      255, 16, 54, 92),
                                                ),
                                              ],
                                            ),
                                          ],
                                        ),
                                      )
                                    : SizedBox.shrink(),

                SizedBox(height: 10),
                service['status'] == 1
                    ? ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => serstep2(
                                  value: service['service_id'], servv: service),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color.fromRGBO(25, 53, 90, 1),
                          minimumSize: Size(320, 50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        child: Text(
                          '   استكمل الطلب',
                          style: TextStyle(
                            fontSize: 20,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      )
                    : service['status'] == 3
                        ? ElevatedButton(
                            onPressed: () {
                              if (service['service_id'] == 7 ||
                                  service['service_id'] == 8) {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => ser2(
                                        value: service['service_id'],
                                        servv: service),
                                  ),
                                );
                              } else {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => serstep2(
                                        value: service['service_id'],
                                        servv: service),
                                  ),
                                );
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color.fromRGBO(25, 53, 90, 1),
                              minimumSize: Size(320, 50),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: Text(
                              ' يجب تعديل مرفقاتك اضغط هنا لتعديل المرفقات',
                              style: TextStyle(
                                fontSize: 15,
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          )
                        : service['status'] == 4
                            ? ElevatedButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => ser2(
                                          value: service['service_id'],
                                          servv: service),
                                    ),
                                  );
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor:
                                      Color.fromRGBO(25, 53, 90, 1),
                                  minimumSize: Size(320, 50),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                ),
                                child: Text(
                                  ' يجب تعديل مرفقاتك اضغط هنا لتعديل المرفقات',
                                  style: TextStyle(
                                    fontSize: 15,
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              )
                            : SizedBox.shrink()
              ],
            ),
          )
        : SizedBox.shrink();
  }
}
