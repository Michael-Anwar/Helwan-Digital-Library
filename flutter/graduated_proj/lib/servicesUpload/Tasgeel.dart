import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:graduated_proj/back_flutt/crud.dart';
import 'package:graduated_proj/back_flutt/func_need/linearprgress.dart';
import 'package:graduated_proj/files_viewer/errormess.dart';
import 'package:graduated_proj/main.dart';
import 'package:graduated_proj/menu/pageroute.dart';
import 'package:graduated_proj/pages/welcome.dart';
import 'package:http/http.dart' as http;
import 'package:open_filex/open_filex.dart';
import 'package:path/path.dart' as path;
import 'package:url_launcher/url_launcher_string.dart';

// import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';

// import 'package:flutter_open_file/flutter_open_file.dart';

class TasgeelService extends StatefulWidget {
  final int? value;
  final Map<String, dynamic>? serr;

  const TasgeelService({super.key, this.value, this.serr});

  @override
  _TasgeelServiceState createState() => _TasgeelServiceState();
}

class _TasgeelServiceState extends State<TasgeelService> {
  String? selectedValue;
  String? _level_controller;
  //  String ? _serid_controller ;
  String? _photo_coll_controller;
  double progressPercentage = 0.0;
  bool uploading = false;
  int? id;
  int? id2;
  int? status;
  int? _level_controller2;
  String? url = "http://10.0.2.2:5001";

  bool isButtonDisabled = false;
  Map<String, dynamic>? serrr;
  late Map<String, dynamic> data;

  String? filePath;
  crud _crud = crud();
  String? _token = "";
  bool isFilePickerActive = false;
  bool isPhotoFromApi = false;

  void initState() {
    super.initState();
    serrr = widget.serr;
    id = widget.value;
    initializeState();
  }

  Future<void> initializeState() async {
    await getdata();
    if (status == 4) {
      await ser1get(_token!).then((_) {
        print(_level_controller2);
        print(filePath); // Print after _level_controller2 is set
      });
    }
  }

  getdata() async {
    String? token = sharedpref.getString("token");
    setState(() {
      _token = token;

      if (id == null) {
        id = serrr!['service_id'];
        id2 = serrr!['ser_reg'];
        status = serrr!['status'];
      }
    });
  }

  Future<void> ser1get(String token) async {
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
          filePath = responseData['photo_college_letter'];
          isPhotoFromApi = true;
        });
      } else {
        // Handle other status codes
        print('Error: ${response.statusCode}');
      }
    } catch (error) {
      print('Error: $error'); // Log any caught errors
    }
  }

  Future<void> ser1send(String token) async {
    try {
      Dio dio = Dio();
      dio.options.headers['Authorization'] = 'Bearer $token';
      dio.options.headers['Content-Type'] = 'multipart/form-data';
      dio.options.headers['withCredentials'] = 'true';

      FormData formData = FormData();

      formData.fields.add(MapEntry('level', _level_controller ?? ''));
      formData.fields.add(MapEntry('service_id', widget.value.toString()));

      if (filePath != null) {
        print("File Path: $filePath");

        if (isPhotoFromApi) {
          formData.fields.add(
            MapEntry('photo_college_letter', filePath!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'photo_college_letter',
              await MultipartFile.fromFile(filePath!),
            ),
          );
        }

        print(filePath);
      }
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
            content: Text(
              'تم ارسال طلبك بنجاح',
              textAlign: TextAlign.right,
              style: TextStyle(fontSize: 15),
            ),
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
        String error = response.data['message'][0];
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
        String error = e.response?.data['message'][0];
        ErrorDialog.showErrorDialog(context, error);
      }
    }
  }

  Future<void> ser1(String token) async {
    try {
      Dio dio = Dio();
      dio.options.headers['Authorization'] = 'Bearer $token';
      dio.options.headers['Content-Type'] = 'multipart/form-data';
      dio.options.headers['withCredentials'] = 'true';

      FormData formData = FormData();

      formData.fields.add(MapEntry('level', _level_controller ?? ''));
      formData.fields.add(MapEntry('service_id', widget.value.toString()));

      if (filePath != null) {
        formData.files.add(
          MapEntry(
            'photo_college_letter',
            await MultipartFile.fromFile(filePath!),
          ),
        );
      }
      setState(() {
        uploading = true;
        isButtonDisabled = true;
      });

      Response response = await dio.post(
        'http://10.0.2.2:5001/payment',
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
            content: Text(
              'تم ارسال طلبك بنجاح',
              textAlign: TextAlign.right,
              style: TextStyle(fontSize: 15),
            ),
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
        String error = response.data['message'][0];
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
        // String errorMessage = e.response?.data['message'][0];
        print('Response data: ${e.response?.data}');
        String error = e.response!.data['message'][0];
        ErrorDialog.showErrorDialog(context, error);
      }
    }
  }

  Future<void> handlesubmit() async {
    if (_level_controller == null || _level_controller!.isEmpty) {
      String error = "برجاء ادخال المرحلة العلمية";
      ErrorDialog.showErrorDialog(context, error);
    } else if (filePath == null || filePath!.isEmpty) {
      String error = "برجاء ادخال الخطاب";
      ErrorDialog.showErrorDialog(context, error);
    }
  }

  Future<void> pickFile() async {
    if (isFilePickerActive) {
      return;
    }

    setState(() {
      isFilePickerActive = true;
    });

    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles();

      if (result != null) {
        setState(() {
          filePath = result.files.single.path;
          _photo_coll_controller = filePath;
          isPhotoFromApi = false;

          print(filePath);
        });
      }
    } catch (e) {
      print("Error picking file: $e");
    } finally {
      setState(() {
        isFilePickerActive = false;
      });
    }
  }

  void openFile() {
    if (filePath != null) {
      File file = File(filePath!);

      if (file.existsSync()) {
        String fileExtension = file.path.split('.').last.toLowerCase();

        if (fileExtension == 'jpg' ||
            fileExtension == 'jpeg' ||
            fileExtension == 'png' ||
            fileExtension == 'webp' ||
            fileExtension == 'svg') {
          OpenFilex.open(filePath!);
        } else if (fileExtension == 'pdf') {
          OpenFilex.open(filePath!);
        } else if (fileExtension == 'doc' || fileExtension == 'docx') {
          print('File Path: $filePath');
          OpenFilex.open(filePath!);
        } else {
          // Unsupported file type
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Unsupported file type'),
            ),
          );
        }
      } else {
        launchUrlString('$url/${serrr!['national_id']}/$filePath');
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No file selected'),
        ),
      );
    }
  }

  void deleteFile() {
    print("Deleting file: $filePath");
    setState(() {
      filePath = null;
    });
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
                      " استخراج افادة بأن عنوان مخطط الرسالة ليس مسجل ",
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
                                "خدمة استخراج افادة بأن عنوان مخطط الرسالة ليس مسجل من قبل في أي من الجامعات المصرية",
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
                                                  print(_level_controller);
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
                                ],
                              ),
                            ),
                            SizedBox(
                              height: 40,
                            ),
                            Align(
                              alignment: Alignment.center,
                              child: Padding(
                                padding: const EdgeInsets.only(right: 10.0),
                                child: Text(
                                  "الخطاب الموجه الى مدير المكتبة الرقمية",
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                  textAlign: TextAlign.right,
                                ),
                              ),
                            ),

                            SizedBox(height: 10),
                            //  SizedBox(height: 30),

                            InkWell(
                              onTap: isButtonDisabled
                                  ? null
                                  : () {
                                      pickFile();
                                    },
                              child: Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    // Upload Icon
                                    Icon(
                                      Icons.add_photo_alternate_outlined,
                                      size: 70,
                                      color: Colors.white,
                                    ),
                                    SizedBox(height: 5),
                                    Text(
                                      "ارسل الان",
                                      style: TextStyle(
                                        fontSize: 17,
                                        // fontWeight: FontWeight.bold,
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
                                  ],
                                ),
                              ),
                            ),

                            SizedBox(height: 15),

                            if (filePath != null)
                              Column(
                                children: [
                                  Text(
                                    '${path.basename(filePath ?? "")}',
                                    style: TextStyle(
                                        fontSize: 16, color: Color(0xFFAD8700)),
                                  ),
                                  SizedBox(height: 20),
                                  Row(
                                    children: [
                                      SizedBox(
                                          width:
                                              25), // إضافة مسافة بين النص والأزرار
                                      ElevatedButton(
                                        onPressed:
                                            isButtonDisabled ? null : openFile,
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Color(0xFFAD8700),
                                          disabledBackgroundColor:
                                              Color(0xFFAD8700),
                                          minimumSize: Size(100, 50),
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(20),
                                          ),
                                        ),
                                        child: Text(
                                          'Open',
                                          style: TextStyle(
                                            fontSize: 18,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                      SizedBox(
                                          width: 80), // إضافة مسافة بين الأزرار
                                      ElevatedButton(
                                        onPressed: isButtonDisabled
                                            ? null
                                            : deleteFile,
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Color(
                                              0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                          minimumSize: Size(100, 50),
                                          disabledBackgroundColor:
                                              Color(0xFFAD8700),
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(20),
                                          ),
                                        ),
                                        child: Text(
                                          'Delete',
                                          style: TextStyle(
                                            fontSize: 18,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            SizedBox(height: 20),

                            if (uploading == true)
                              Container(
                                  child: Column(
                                children: [
                                  lin_prog(
                                      progressPercentage: progressPercentage),
                                  Text(
                                    'جارى رفع الملفات',
                                    style: TextStyle(
                                      fontSize: 18,
                                      color: Color(0xFFAD8700),
                                    ),
                                  ),
                                ],
                              )),
                            SizedBox(
                              height: 15,
                            ),
                            ElevatedButton(
                              onPressed: isButtonDisabled
                                  ? null
                                  : () async {
                                      await handlesubmit();
                                      if (_level_controller != null &&
                                          _level_controller!.isNotEmpty &&
                                          filePath != null &&
                                          filePath!.isNotEmpty) {
                                        if (status == 4) {
                                          await ser1send(_token!);
                                        } else
                                          await ser1(_token!);
                                      }
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
