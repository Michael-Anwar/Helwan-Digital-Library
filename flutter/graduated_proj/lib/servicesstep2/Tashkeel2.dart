import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:graduated_proj/back_flutt/func_need/linearprgress.dart';
import 'package:graduated_proj/files_viewer/errormess.dart';
import 'package:graduated_proj/main.dart';
import 'package:graduated_proj/menu/pageroute.dart';
import 'package:graduated_proj/pages/welcome.dart';
import 'package:http/http.dart' as http;
import 'package:open_filex/open_filex.dart';
import 'package:path/path.dart' as path;
import 'package:url_launcher/url_launcher_string.dart';


class Tashkeel2 extends StatefulWidget {
  final int? value;
  final Map<String, dynamic>? serr;

  const Tashkeel2({super.key, this.value, this.serr});

  @override
  _Tashkeel2State createState() => _Tashkeel2State();
}

class _Tashkeel2State extends State<Tashkeel2> {
  String? selectedValue;
  String? filePath;
  String? filePath2;
  String? wordFilePath;
  String? pdfFilePath;
  Map<String, dynamic>? serrr;
  late Map<String, dynamic> data;
  int? id;
  int? id2;
  int? status;
  bool isFilePickerActive = false;
  String? _token = "";
  double progressPercentage = 0.0;
  bool uploading = false;
  bool isButtonDisabled = false;
  bool isPhotoFromApi = false;
  bool isPhoto2FromApi = false;
  bool isPdfFromApi = false;
  bool iswordFromApi = false;
    String? url = "http://10.0.2.2:5001";


  @override
  void initState() {
    super.initState();
    serrr = widget.serr;
    id = widget.value;

    initializeState();
  }


  Future<void> initializeState() async {
    await getdata();
    if (status == 3) {
      await step2ser2get(_token!).then((_) {
        print(filePath); // Print after _level_controller2 is set
      });
    }
  }
 Future<void> step2ser2get(String token) async {
    try {
      Uri url = Uri.parse('http://10.0.2.2:5001/StepTwoRegEdit/$id/$id2');
      final response = await http.get(url, headers: {
        'Authorization': 'Bearer $token',
        'withCredentials': 'true'
      });
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(response.body);
        print(responseData); // Log the response data
        setState(() {
          filePath = responseData['photo_payment_receipt'];
          filePath2 = responseData['quote_check_form'];
          pdfFilePath = responseData['message_pdf_ar'];
          wordFilePath = responseData['message_word_ar'];

          isPhotoFromApi = true;
          isPhoto2FromApi = true;
          isPdfFromApi = true;
          iswordFromApi = true;
        });
      } else {
        // Handle other status codes
        print('Error: ${response.statusCode}');
      }
    } catch (error) {
      print('Error: $error'); // Log any caught errors
    }
  }
  getdata() async {
    String? token = sharedpref.getString("token");
    setState(() {
      _token = token;
      if (id == null) {
        id = serrr!['service_id'];
        id2 = serrr!['ser_formation'];
        status = serrr!['status'];
      }
    });
  }

  Future<void> st2ser2(String token) async {
    try {
      Dio dio = Dio();
      dio.options.headers['Authorization'] = 'Bearer $token';
      dio.options.headers['Content-Type'] = 'multipart/form-data';
      dio.options.headers['withCredentials'] = 'true';

      FormData formData = FormData();
      int appid = id2!;

      formData.fields.add(MapEntry('service_id', widget.value.toString()));
      formData.fields.add(MapEntry('application_id', appid.toString()));
     if (filePath != null) {
        if (isPhotoFromApi) {
          formData.fields.add(
            MapEntry('payment_photo', filePath!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'payment_photo',
              await MultipartFile.fromFile(filePath!),
            ),
          );
        }
      }
       if (filePath2 != null) {
        if (isPhoto2FromApi) {
          formData.fields.add(
            MapEntry('form', filePath2!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'form',
              await MultipartFile.fromFile(filePath2!),
            ),
          );
        }
      }
       if (wordFilePath != null) {
        if (iswordFromApi) {
          formData.fields.add(
            MapEntry('research_word', wordFilePath!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'research_word',
              await MultipartFile.fromFile(wordFilePath!),
            ),
          );
        }
      }

      if (pdfFilePath != null) {
        if (isPdfFromApi) {
          formData.fields.add(
            MapEntry('research', pdfFilePath!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'research',
              await MultipartFile.fromFile(pdfFilePath!),
            ),
          );
        }
      }

      setState(() {
        uploading = true;
        isButtonDisabled = true;
      });

      Response response = await dio.put(
        'http://10.0.2.2:5001/StepTwoSer2/$id/$id2',
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
        if (response.data is Map && response.data.containsKey('message')) {
          String errorMessage = response.data['message'][0];
          ErrorDialog.showErrorDialog(context, errorMessage);
        } else {
          String error = "Unknown error occurred";
          ErrorDialog.showErrorDialog(context, error);
        }
      }
    } catch (e) {
      setState(() {
        uploading = false;
        isButtonDisabled = false; // Disable button and interactions
      });
      print("Exception occurred: $e");
      if (e is DioException && e.response != null) {
        if (e.response?.data is Map &&
            e.response?.data.containsKey('message')) {
          String errorMessage = e.response?.data['message'][0];
          print('Response data: ${e.response?.data}');
          ErrorDialog.showErrorDialog(context, errorMessage);
        } else {
          String error = "Unknown error occurred";
          ErrorDialog.showErrorDialog(context, error);
        }
      }
    }
  }

  Future<void> handlesub() async {
    if (filePath == null || filePath!.isEmpty) {
      String error = "يجب رفع صورة ايصال الدفع";
      ErrorDialog.showErrorDialog(context, error);
    } else if (pdfFilePath == null || pdfFilePath!.isEmpty) {
      String error =
          "يجب رفع الرسالة المقدمة للفحص كاملة بملف واحد مجمع دون حذف أى اجزاء منها فى صيغة PDF";
      ErrorDialog.showErrorDialog(context, error);
    } else if (wordFilePath == null || wordFilePath!.isEmpty) {
      String error =
          "يجب رفع الرسالة المقدمة للفحص (كاملة بملف واحد مجمع دون حذف أى اجزاء منها فى صيغة Word";
      ErrorDialog.showErrorDialog(context, error);
    } else if (filePath2 == null || filePath2!.isEmpty) {
      String error =
          "يجب رفع النموذج الخاص بفحص اقتباس الرسائل العلمية لغرض التشكيل بصيغة PDF او Word او صورة";
      ErrorDialog.showErrorDialog(context, error);
    }
  }

  Future<void> pickPdfFile() async {
    if (isFilePickerActive) {
      return;
    }
    setState(() {
      isFilePickerActive = true;
    });
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf'],
      );
       if (result != null) {
        String? filePathpd = result.files.single.path;

        if (filePathpd != null &&
            path.extension(filePathpd).toLowerCase() == '.pdf') {
          setState(() {
            pdfFilePath = filePathpd;
            isPdfFromApi = false;
          });
        } else {
          String error = "يجب اختيار الملف فى صيغة pdf";
          ErrorDialog.showErrorDialog(context, error);
        }
      }
    } catch (e) {
      print("Error picking file: $e");
    } finally {
      setState(() {
        isFilePickerActive = false;
      });
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
          isPhotoFromApi = false;
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
Future<void> pickFile2() async {
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
          filePath2 = result.files.single.path;
          isPhoto2FromApi = false;
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

  Future<void> pickWordFile() async {
    if (isFilePickerActive) {
      return;
    }
    setState(() {
      isFilePickerActive = true;
    });
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['doc', 'docx'],
      );
     if (result != null) {
        String? filePathwo = result.files.single.path;

        if (filePathwo != null &&
           ( path.extension(filePathwo).toLowerCase() == '.doc' || path.extension(filePathwo).toLowerCase() == '.docx') ) {
          setState(() {
            wordFilePath = filePathwo;
            iswordFromApi = false;
          });
        } else {
          String error = "يجب اختيار الملف فى صيغة word";
          ErrorDialog.showErrorDialog(context, error);
        }
      }
    } catch (e) {
      print("Error picking file: $e");
    } finally {
      setState(() {
        isFilePickerActive = false;
      });
    }
  }
  void openFile(String? file) {
    if (filePath != null) {
      File file1 = File(filePath!);
      if (file1.existsSync()) {
        String fileExtension = file1.path.split('.').last.toLowerCase();
        if (fileExtension == 'jpg' ||
            fileExtension == 'jpeg' ||
            fileExtension == 'png' ||
            fileExtension == 'webp' ||
            fileExtension == 'svg') {
          OpenFilex.open(filePath!);
        } else if (fileExtension == 'pdf') {
          OpenFilex.open(filePath!);
        } else if (fileExtension == 'doc' || fileExtension == 'docx') {
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
  
  void openFile2(String? file) {
    if (file != null) {
      File file11 = File(filePath2!);
      if (file11.existsSync()) {
        String fileExtension = file11.path.split('.').last.toLowerCase();
        if (fileExtension == 'jpg' ||
            fileExtension == 'jpeg' ||
            fileExtension == 'png' ||
            fileExtension == 'webp' ||
            fileExtension == 'svg') {
          OpenFilex.open(filePath2!);
        } else if (fileExtension == 'pdf') {
          OpenFilex.open(filePath2!);
        } else if (fileExtension == 'doc' || fileExtension == 'docx') {
          OpenFilex.open(filePath2);
        } else {
          // Unsupported file type
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Unsupported file type'),
            ),
          );
        }
      } else {
        launchUrlString('$url/${serrr!['national_id']}/$filePath2');
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No file selected'),
        ),
      );
    }
  }

  void openPdfFile(String? filepd) {
    if (filepd != null) {
      File file2 = File(filepd!);
      if (file2.existsSync()) {
        String fileExtension = file2.path.split('.').last.toLowerCase();
        if (fileExtension == 'pdf') {
          OpenFilex.open(filepd!);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Unsupported file type'),
            ),
          );
        }
      } else {
        launchUrlString('$url/${serrr!['national_id']}/$filepd');
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No file selected'),
        ),
      );
    }
  }

 void openWordFile(String? filewo) {
    if (filewo != null) {
      File file3 = File(filewo!);
      if (file3.existsSync()) {
        String fileExtension = file3.path.split('.').last.toLowerCase();
        if (fileExtension == 'doc' || fileExtension == 'docx') {
          OpenFilex.open(filewo!);
        } else {
          // Unsupported file type
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Unsupported file type'),
            ),
          );
        }
      } else {
        launchUrlString('$url/${serrr!['national_id']}/$filewo');
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
    setState(() {
      filePath = null;
    });
  }

  void deleteFile2() {
    setState(() {
      filePath2 = null;
    });
  }

  void deleteWordFile() {
    setState(() {
      wordFilePath = null;
    });
  }

  void deletePdfFile() {
    setState(() {
      pdfFilePath = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        debugShowCheckedModeBanner: false,
        localizationsDelegates: const [
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
                                'فحص الاقتباس من الرسائل العلمية لغرض التشكيل',
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
                                "فحص الاقتباس من الرسائل العلمية لغرض التشكيل",
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

                            SizedBox(
                              height: 40,
                            ),
                            // Align and Text widget for Payment Receipt Image
                            Align(
                              alignment: Alignment.center,
                              child: Padding(
                                padding: const EdgeInsets.only(right: 10.0),
                                child: Text(
                                  "صورة ايصال الدفع",
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

// InkWell for selecting Payment Receipt Image
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

                            SizedBox(height: 20),

                            if (filePath != null)
                              Column(
                                children: [
                                  Text(
                                    '${path.basename(filePath ?? "")}',
                                    style: TextStyle(
                                      fontSize: 16,
                                      color: Color(0xFFAD8700),
                                    ),
                                  ),
                                  SizedBox(height: 20),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      ElevatedButton(
                                        onPressed: isButtonDisabled
                                            ? null
                                            : () => openFile(filePath),
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
                                      SizedBox(width: 100),
                                      // Button to Delete Payment Receipt Image
                                      ElevatedButton(
                                        onPressed: isButtonDisabled
                                            ? null
                                            : () => deleteFile(),
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

                            SizedBox(
                                height:
                                    20), // Add space between the two sections

                            Align(
                              alignment: Alignment.center,
                              child: Padding(
                                padding: const EdgeInsets.only(right: 15.0),
                                child: Text(
                                  "الرسالة المقدمة للفحص كاملة بملف واحد مجمع دون حذف أي أجزاء منها في صيغة PDF",
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                  textAlign: TextAlign.right,
                                ),
                              ),
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            InkWell(
                              onTap: isButtonDisabled
                                  ? null
                                  : () {
                                      pickPdfFile();
                                    },
                              child: Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.picture_as_pdf,
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
                            SizedBox(height: 20),
                            if (pdfFilePath != null)
                              Column(
                                children: [
                                  Text(
                                    '${path.basename(pdfFilePath ?? "")}',
                                    style: TextStyle(
                                        fontSize: 16, color: Color(0xFFAD8700)),
                                  ),
                                  SizedBox(height: 20),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      ElevatedButton(
                                        onPressed: isButtonDisabled
                                            ? null
                                            : () => openPdfFile(pdfFilePath),
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
                                      SizedBox(width: 80),
                                      ElevatedButton(
                                        onPressed: isButtonDisabled
                                            ? null // Disable button if isButtonDisabled is true
                                            : deletePdfFile,
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
                            Align(
                              alignment: Alignment.center,
                              child: Padding(
                                padding: const EdgeInsets.only(right: 25.0),
                                child: Text(
                                  "الرسالة المقدمة للفحص كاملة بملف واحد مجمع دون حذف أي أجزاء منها في صيغة word",
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                  textAlign: TextAlign.right,
                                ),
                              ),
                            ),
                            SizedBox(height: 20),
                            InkWell(
                              onTap: isButtonDisabled
                                  ? null
                                  : () {
                                      pickWordFile();
                                    },
                              child: Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.description,
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
                            SizedBox(height: 20),
                            if (wordFilePath != null)
                              Column(
                                children: [
                                  Text(
                                    '${path.basename(wordFilePath ?? "")}',
                                    style: TextStyle(
                                        fontSize: 16, color: Color(0xFFAD8700)),
                                  ),
                                  SizedBox(height: 20),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      // إضافة مسافة بين النص والأزرار
                                      ElevatedButton(
                                        onPressed: isButtonDisabled
                                            ? null // Disable button if isButtonDisabled is true
                                            : () => openWordFile(wordFilePath),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Color(0xFFAD8700),
                                          minimumSize: Size(100, 50),
                                          disabledBackgroundColor:
                                              Color(0xFFAD8700),
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
                                            ? null // Disable button if isButtonDisabled is true
                                            : deleteWordFile,
                                        style: ElevatedButton.styleFrom(
                                          disabledBackgroundColor:
                                              Color(0xFFAD8700),
                                          backgroundColor: Color(
                                              0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                          minimumSize: Size(100, 50),
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
                            Align(
                              alignment: Alignment.center,
                              child: Padding(
                                padding: const EdgeInsets.only(right: 10.0),
                                child: Text(
                                  "النموذج الخاص بفحص اقتباس الرسائل العلمية لغرض التشكيل",
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

                            InkWell(
                              onTap: isButtonDisabled ? null : pickFile2,
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

                            SizedBox(height: 20),

                            if (filePath2 != null)
                              Column(
                                children: [
                                  Text(
                                    '${path.basename(filePath2 ?? "")}',
                                    style: TextStyle(
                                      fontSize: 16,
                                      color: Color(0xFFAD8700),
                                    ),
                                  ),
                                  SizedBox(height: 20),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      ElevatedButton(
                                        onPressed: isButtonDisabled
                                            ? null
                                            : () => openFile2(filePath2),
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
                                      SizedBox(width: 100),
                                      // Button to Delete Translation Paper Image
                                      ElevatedButton(
                                        onPressed: isButtonDisabled
                                            ? null
                                            : () => deleteFile2(),
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
                              onPressed: () async {
                                await handlesub();
                                if (filePath2 != null &&
                                    filePath2!.isNotEmpty &&
                                    filePath != null &&
                                    filePath!.isNotEmpty &&
                                    pdfFilePath != null &&
                                    pdfFilePath!.isNotEmpty &&
                                    wordFilePath != null &&
                                    wordFilePath!.isNotEmpty)
                                  await st2ser2(_token!);
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
  }
}
