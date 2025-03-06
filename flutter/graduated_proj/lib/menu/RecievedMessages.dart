import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:graduated_proj/files_viewer/errormess.dart';
import 'package:graduated_proj/main.dart';
import 'package:graduated_proj/pages/welcome.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class RecievedMessages extends StatefulWidget {
  final int? value;

  const RecievedMessages({Key? key, this.value}) : super(key: key);

  @override
  _RecievedMessagesState createState() => _RecievedMessagesState();
}

class _RecievedMessagesState extends State<RecievedMessages> {
  String? selectedButton;
  final Map<int, TextEditingController> _controllers = {};
  List<Map<String, dynamic>> messages = [];
  int? mess_id;

  String? _token = "";
  String? url = "http://10.0.2.2:5001";

  String dropdownValue = 'الرسائل المرسلة منك';

  @override
  void initState() {
    super.initState();
    getdata();
    initializemessage();
  }

  TextEditingController _getController(int messageId) {
    if (_controllers[messageId] == null) {
      _controllers[messageId] = TextEditingController();
    }
    return _controllers[messageId]!;
  }

  @override
  void dispose() {
    // Dispose all the controllers
    _controllers.forEach((key, controller) => controller.dispose());
    super.dispose();
  }

  Future<void> initializemessage() async {
    await fetchmessage(_token!).then((data) {
      setState(() {
        messages = data;
        print(messages);
      });
    });
  }

  getdata() async {
    String? token = sharedpref.getString("token");
    setState(() {
      _token = token;
    });
  }

  Future<void> handlemess(var valu) async {
    if (valu.length < 5 || valu.isEmpty) {
      String error = "يجب ادخال الرسالة";
      ErrorDialog.showErrorDialog(context, error);
    }
  }

  Future<void> sendData(var valu2) async {
    final String apiUrl =
        '$url/user/sendResponse'; // replace API_URL with your actual API URL
    Map<String, dynamic> data = {
      'message_id': mess_id,
      'response': valu2,
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

  String formatDate(String date) {
    DateTime parsedDate = DateTime.parse(date);

    // Format the date part
    String formattedDate =
        DateFormat('dd/MM/yyyy, HH:mm:ss', 'en-GB').format(parsedDate);

    // Extract components from formattedDate
    RegExp dateRegex =
        RegExp(r'(\d{2})/(\d{2})/(\d{4}), (\d{2}):(\d{2}):(\d{2})');
    RegExpMatch? match = dateRegex.firstMatch(formattedDate);

    if (match == null) {
      return formattedDate; // Return as is if there's no match
    }

    // Extract components
    String day = match.group(1)!;
    String month = match.group(2)!;
    String year = match.group(3)!;
    String hour = match.group(4)!;
    String minute = match.group(5)!;
    String second = match.group(6)!;

    // Convert time to 12-hour format with AM/PM
    int hourInt = int.parse(hour);
    String amPm = hourInt >= 12 ? 'مساءً' : 'صباحا';
    String formattedTime =
        '${(hourInt % 12 == 0 ? 12 : hourInt % 12).toString().padLeft(2, '0')}:$minute:$second $amPm';

    // Combine components to create the final formatted date
    String formattedDateTime = '$day/$month/$year \n $formattedTime';

    return formattedDateTime;
  }

  Future<List<Map<String, dynamic>>> fetchmessage(String token) async {
    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:5001/user/getusermessages'),
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
                                " الرسائل المرسلة اليك ",
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
                Navigator.of(context).pop(); // Go back to the previous screen
              },
            ),
          ],
          backgroundColor: Color.fromARGB(255, 16, 54, 92),
        ),
        backgroundColor: Colors.white,
        body: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: EdgeInsets.symmetric(
                  horizontal: 20), // Add padding from right and left
              child: Column(
                children: <Widget>[
                  SizedBox(
                    height: 10,
                  ),
                  Text(
                    "الرسائل المرسلة والردود",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF19355A),
                    ),
                  ),
                  SizedBox(height: 20),
                  Container(
                    // width: 550,
                    padding: EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color:
                          Color(0xFF19355A), // Set the container color to blue
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Container(
                          width: 200, // Same width as the button
                          child: DropdownButtonFormField<String>(
                            value: dropdownValue,
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: Colors
                                  .white, // Background color of the dropdown
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide(color: Colors.white),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide(color: Colors.white),
                              ),
                            ),
                            iconEnabledColor: Color(0xFF19355A),
                            onChanged: (String? newValue) {
                              setState(() {
                                dropdownValue = newValue!;
                              });
                            },
                            items: <String>[
                              'الرسائل المرسلة منك',
                              'الرسائل المرسلة إليك'
                            ].map<DropdownMenuItem<String>>((String value) {
                              return DropdownMenuItem<String>(
                                value: value,
                                child: Text(value,
                                    style: TextStyle(
                                        color: Color(0xFF19355A),
                                        fontWeight: FontWeight.bold)),
                              );
                            }).toList(),
                          ),
                        ),
                        SizedBox(height: 20),
                        if (dropdownValue == 'الرسائل المرسلة منك') ...[
                          (messages.isNotEmpty)
                              ? ListView.builder(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  itemCount: messages.length,
                                  itemBuilder:
                                      (BuildContext context, int index) {
                                    final messagge = messages[index];
                                    return (messagge?["reson"] != 0)
                                        ? Container(
                                            child: Column(
                                              children: [
                                                Row(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment.center,
                                                  children: [
                                                    // SizedBox(width: 10),
                                                    Expanded(
                                                      child: Text(
                                                        messagge?["id"] == 9
                                                            ? " استفسار او شكوى بخصوص كود الدفع "
                                                            : "${messagge?["service_name_ar"]}",
                                                        style: TextStyle(
                                                          fontSize:
                                                              17, // تعديل حجم النص بناءً على عرض الكونتينر
                                                          color: Colors.white,
                                                          fontWeight:
                                                              FontWeight.w900,
                                                        ),
                                                        textAlign:
                                                            TextAlign.center,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                Align(
                                                  alignment: Alignment.center,
                                                  child: Text(
                                                    messagge?["reson"] == 1
                                                        ? "شكوى"
                                                        : messagge?["reson"] ==
                                                                2
                                                            ? "استفسار"
                                                            : "",
                                                    style: TextStyle(
                                                      fontSize: 20,
                                                      color: Color(0xFFAD8700),
                                                      fontWeight:
                                                          FontWeight.bold,
                                                    ),
                                                    textAlign: TextAlign.center,
                                                  ),
                                                ),
                                                SizedBox(height: 10),
                                                Container(
                                                  height: 1,
                                                  width: double.infinity,
                                                  color: Colors.white,
                                                ),
                                                SizedBox(height: 16.0),
                                                Align(
                                                  alignment:
                                                      Alignment.centerRight,
                                                  child: Text(
                                                    '-${messagge?["message"]}',
                                                    style: TextStyle(
                                                        color: Colors.white,
                                                        fontSize: 17),
                                                    textAlign: TextAlign.right,
                                                  ),
                                                ),
                                                SizedBox(height: 8.0),
                                                Align(
                                                  alignment:
                                                      Alignment.centerLeft,
                                                  child: Text(
                                                    formatDate(messagge?[
                                                        "reson_date"]),
                                                    style: TextStyle(
                                                        color:
                                                            Color(0xFFAD8700),
                                                        fontWeight:
                                                            FontWeight.bold,
                                                        fontSize: 17),
                                                    // textAlign: TextAlign.left,
                                                  ),
                                                ),
                                                SizedBox(height: 10),
                                                Row(
                                                  children: [
                                                    Expanded(
                                                        child: Text(
                                                      messagge?["response"] !=
                                                              null
                                                          ? "=> ${messagge["response"]}"
                                                          : " لم يتم الرد على الرساله بعد ",
                                                      style: TextStyle(
                                                          color:
                                                              Color(0xFFAD8700),
                                                          fontWeight:
                                                              FontWeight.bold,
                                                          fontSize: 17),
                                                      textAlign:
                                                          TextAlign.right,
                                                    )),
                                                  ],
                                                ),
                                                SizedBox(height: 8.0),
                                                (messagge?["response_date"] !=
                                                            null &&
                                                        messagge?["response"] !=
                                                            null)
                                                    ? Align(
                                                        alignment: Alignment
                                                            .centerLeft,
                                                        child: Text(
                                                          formatDate(messagge?[
                                                              "response_date"]),
                                                          style: TextStyle(
                                                              fontWeight:
                                                                  FontWeight
                                                                      .bold,
                                                              color: Color(
                                                                  0xFFAD8700),
                                                              fontSize: 17),
                                                          // textAlign: TextAlign.left,
                                                        ),
                                                      )
                                                    : SizedBox(
                                                        height: 10,
                                                      ),
                                                SizedBox(
                                                  height: 20,
                                                ),
                                              ],
                                            ),
                                          )
                                        : SizedBox(
                                            height: 1,
                                          );
                                  })
                              : const Center(
                                  child: Text(
                                    "لا يوجد رسائل مرسله",
                                    style: TextStyle(
                                        fontSize: 20,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ),
                          SizedBox(height: 10),
                          ElevatedButton(
                            onPressed: () {
                              Navigator.of(context)
                                  .pop(); // Go back to the previous screen
                            },
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                  vertical:
                                      15), // Increased padding for the button
                              child: Text('رجوع',
                                  style: TextStyle(
                                      fontSize: 18,
                                      color:
                                          Colors.black)), // Increased font size
                            ),
                            style: ElevatedButton.styleFrom(
                              minimumSize:
                                  Size(400, 40), // Set minimum width and height
                              backgroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                          ),
                        ],
                        if (dropdownValue == 'الرسائل المرسلة إليك') ...[
                          (messages.isNotEmpty)
                              ? ListView.builder(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  itemCount: messages.length,
                                  itemBuilder:
                                      (BuildContext context, int index) {
                                    final messagge = messages[index];

                                    return (messagge?["reson"] == 0)
                                        ? Container(
                                            child: Column(
                                              children: [
                                                Row(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment.center,
                                                  children: [
                                                    // SizedBox(width: 10),
                                                    Expanded(
                                                      child: Text(
                                                        messagge?["id"] == 9
                                                            ? " استفسار او شكوى بخصوص كود الدفع "
                                                            : "${messagge?["service_name_ar"]}",
                                                        style: TextStyle(
                                                          fontSize:
                                                              17, // تعديل حجم النص بناءً على عرض الكونتينر
                                                          color: Colors.white,
                                                          fontWeight:
                                                              FontWeight.w900,
                                                        ),
                                                        textAlign:
                                                            TextAlign.center,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                SizedBox(height: 16.0),
                                                Container(
                                                  height: 1,
                                                  width: double.infinity,
                                                  color: Colors.white,
                                                ),
                                                SizedBox(height: 16.0),
                                                Align(
                                                  alignment:
                                                      Alignment.centerRight,
                                                  child: Text(
                                                    '-${messagge?["message"]}',
                                                    style: TextStyle(
                                                        color: Colors.white,
                                                        fontSize: 17),
                                                    textAlign: TextAlign.right,
                                                  ),
                                                ),
                                                SizedBox(height: 5.0),
                                                Row(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment
                                                          .spaceBetween,
                                                  children: [
                                                    Expanded(
                                                      child: Text(
                                                        'المسؤل عن ${messagge?["service_name_ar"]}',
                                                        style: TextStyle(
                                                            color: Color(
                                                                0xFFAD8700),
                                                            fontSize: 17),
                                                      ),
                                                    ),
                                                    Text(
                                                      formatDate(messagge?[
                                                          "reson_date"]),
                                                      style: TextStyle(
                                                          color:
                                                              Color(0xFFAD8700),
                                                          fontWeight:
                                                              FontWeight.bold,
                                                          fontSize: 17),
                                                      // textAlign: TextAlign.left,
                                                    ),
                                                  ],
                                                ),
                                                SizedBox(height: 10),
                                                messagge?["response"] == null
                                                    ? Column(
                                                        children: [
                                                          TextField(
                                                            controller:
                                                                _getController(
                                                                    messagge?[
                                                                        "message_id"]),
                                                            maxLines: 3,
                                                            decoration:
                                                                InputDecoration(
                                                              hintText:
                                                                  'اكتب ردك هنا ...',
                                                              fillColor:
                                                                  Colors.white,
                                                              filled: true,
                                                              border:
                                                                  OutlineInputBorder(
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            10),
                                                              ),
                                                            ),
                                                          ),
                                                          SizedBox(height: 20),
                                                          ElevatedButton(
                                                            onPressed:
                                                                () async {
                                                              mess_id = messagge?[
                                                                  "message_id"];
                                                              print(mess_id);
                                                              await handlemess(
                                                                  _controllers[
                                                                          messagge?[
                                                                              "message_id"]]
                                                                      ?.text);
                                                              if (_controllers[
                                                                          messagge?[
                                                                              "message_id"]]
                                                                      ?.text
                                                                      .isNotEmpty ==
                                                                  true) {
                                                                await sendData(
                                                                    _controllers[
                                                                            messagge?["message_id"]]
                                                                        ?.text);
                                                              }
                                                            },
                                                            child: Text(
                                                              'إرسال',
                                                              style: TextStyle(
                                                                color: Colors
                                                                    .white,
                                                              ),
                                                            ),
                                                            style:
                                                                ElevatedButton
                                                                    .styleFrom(
                                                              backgroundColor:
                                                                  Color(
                                                                      0xFFAD8700),
                                                              minimumSize: Size(
                                                                  double
                                                                      .infinity,
                                                                  50),
                                                              shape:
                                                                  RoundedRectangleBorder(
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            10),
                                                              ),
                                                            ),
                                                          ),
                                                        ],
                                                      )
                                                    : Row(
                                                        children: [
                                                          Expanded(
                                                              child: Text(
                                                            "=> ${messagge["response"]}",
                                                            style: TextStyle(
                                                                color: Color(
                                                                    0xFFAD8700),
                                                                fontWeight:
                                                                    FontWeight
                                                                        .bold,
                                                                fontSize: 17),
                                                            textAlign:
                                                                TextAlign.right,
                                                          )),
                                                          Align(
                                                            alignment: Alignment
                                                                .centerLeft,
                                                            child: Text(
                                                              formatDate(messagge?[
                                                                  "response_date"]),
                                                              style: TextStyle(
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .bold,
                                                                  color: Color(
                                                                      0xFFAD8700),
                                                                  fontSize: 17),
                                                              // textAlign: TextAlign.left,
                                                            ),
                                                          ),
                                                        ],
                                                      ),
                                                SizedBox(height: 20),
                                              ],
                                            ),
                                          )
                                        : SizedBox(
                                            height: 1,
                                          );
                                  })
                              : const Center(
                                  child: Text(
                                    "لا يوجد رسائل مرسله",
                                    style: TextStyle(
                                        fontSize: 20,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ),
                          SizedBox(height: 10),
                          ElevatedButton(
                            onPressed: () {
                              Navigator.of(context)
                                  .pop(); // Go back to the previous screen
                            },
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                  vertical:
                                      15), // Increased padding for the button
                              child: Text('رجوع',
                                  style: TextStyle(
                                      fontSize: 18,
                                      color:
                                          Colors.black)), // Increased font size
                            ),
                            style: ElevatedButton.styleFrom(
                              minimumSize:
                                  Size(400, 40), // Set minimum width and height
                              backgroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  SizedBox(
                    height: 40,
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
