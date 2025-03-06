import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:graduated_proj/back_flutt/func_need/linearprgress.dart';
import 'package:graduated_proj/files_viewer/errormess.dart';
import 'package:graduated_proj/main.dart';
import 'package:graduated_proj/pages/welcome.dart';
import 'package:http/http.dart' as http;
import 'package:open_filex/open_filex.dart';
import 'package:path/path.dart' as path;
import 'package:url_launcher/url_launcher_string.dart';

class Taslem extends StatefulWidget {
  final int? value;
  final Map<String, dynamic>? serr;

  const Taslem({super.key, this.value, this.serr});

  @override
  _TaslemState createState() => _TaslemState();
}

class _TaslemState extends State<Taslem> {
  String? selectedValue;
  String? filePath;
  String? wordFilePath;
  String? pdfFilePath;
  String? _level_controller;
  //  String ? _serid_controller ;
  String? _token = "";
  double progressPercentage = 0.0;
  bool uploading = false;
  bool isButtonDisabled = false;
  bool isFilePickerActive = false;
  bool isPhotoFromApi = false;
  bool isPdfFromApi = false;
  bool iswordFromApi = false;

  Map<String, dynamic>? serrr;
  late Map<String, dynamic> data;
  int? id;
  int? id2;
  int? status;
  int? _level_controller2;
  String? url = "http://10.0.2.2:5001";

  void initState() {
    super.initState();
    serrr = widget.serr;
    id = widget.value;
    initializeState();
  }

  Future<void> initializeState() async {
    await getdata();
    if (status == 3) {
      await ser7get(_token!).then((_) {
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
        id2 = serrr!['ser_grant'];
        status = serrr!['status'];
      }
    });
  }

  Future<void> ser7get(String token) async {
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
          filePath = responseData['decision'];
          pdfFilePath = responseData['message_pdf_ar'];
          wordFilePath = responseData['message_word_ar'];
          isPhotoFromApi = true;
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

  Future<void> ser7send(String token) async {
    try {
      Dio dio = Dio();
      dio.options.headers['Authorization'] = 'Bearer $token';
      dio.options.headers['Content-Type'] = 'multipart/form-data';
      dio.options.headers['withCredentials'] = 'true';

      FormData formData = FormData();

      formData.fields.add(MapEntry('level', _level_controller ?? ''));
      formData.fields.add(MapEntry('service_id', widget.value.toString()));

      if (filePath != null) {
        if (isPhotoFromApi) {
          formData.fields.add(
            MapEntry('decision', filePath!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'decision',
              await MultipartFile.fromFile(filePath!),
            ),
          );
        }
      }
      if (wordFilePath != null) {
        if (iswordFromApi) {
          formData.fields.add(
            MapEntry('word', wordFilePath!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'word',
              await MultipartFile.fromFile(wordFilePath!),
            ),
          );
        }
      }
      if (pdfFilePath != null) {
        if (isPdfFromApi) {
          formData.fields.add(
            MapEntry('pdf', pdfFilePath!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf',
              await MultipartFile.fromFile(pdfFilePath!),
            ),
          );
        }
      }
      // Log formData content for debugging
      print("Form Data Fields: ${formData.fields}");
      print("Form Data Files: ${formData.files}");

      setState(() {
        uploading = true;
        isButtonDisabled = true;
      });

      Response response = await dio.put(
        'http://10.0.2.2:5001/StepTwoSer7edit/$id/$id2',
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
          PageRouteBuilder(
            transitionDuration: Duration(seconds: 1),
            transitionsBuilder: (BuildContext context,
                Animation<double> animation,
                Animation<double> secondaryAnimation,
                Widget child) {
              return ScaleTransition(
                scale: animation,
                child: child,
              );
            },
            pageBuilder: (BuildContext context, Animation<double> animation,
                Animation<double> secondaryAnimation) {
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
          String error = response.data['message'][0];
          ErrorDialog.showErrorDialog(context, error);
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
          String error = e.response?.data['message'][0];
          ErrorDialog.showErrorDialog(context, error);
        } else {
          String error = "Unknown error occurred";
          ErrorDialog.showErrorDialog(context, error);
        }
      }
    }
  }

  Future<void> ser7(String token) async {
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
            'decision',
            await MultipartFile.fromFile(filePath!),
          ),
        );
      }
      if (pdfFilePath != null) {
        formData.files.add(
          MapEntry(
            'pdf',
            await MultipartFile.fromFile(pdfFilePath!),
          ),
        );
      }
      if (wordFilePath != null) {
        formData.files.add(
          MapEntry(
            'word',
            await MultipartFile.fromFile(wordFilePath!),
          ),
        );
      }

      setState(() {
        uploading = true;
        isButtonDisabled = true;
      });
      // Send the request with form data
      Response response = await dio.post(
        'http://10.0.2.2:5001/StepTwoSer7',
        data: formData,
        onSendProgress: (sent, total) {
          setState(() {
            progressPercentage = (sent / total) * 100;
            print('Upload progress: $progressPercentage%');
          });
        },
      );

      // Handle the response
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
          PageRouteBuilder(
            transitionDuration: Duration(seconds: 1),
            transitionsBuilder: (BuildContext context,
                Animation<double> animation,
                Animation<double> secondaryAnimation,
                Widget child) {
              return ScaleTransition(
                scale: animation,
                child: child,
              );
            },
            pageBuilder: (BuildContext context, Animation<double> animation,
                Animation<double> secondaryAnimation) {
              return Welcome(); // تغيير Welcome() بالشاشة المناسبة
            },
          ),
          (route) => false,
        );
      } else {
        // Handle server error
        print("Failed to upload. Status code: ${response.statusCode}");
        print("Response body: ${response.data}");
        // Parse the error message from the response
        String errorMessage = response.data['message'][0];
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

  Future<void> handlesub() async {
    if (_level_controller == null || _level_controller!.isEmpty) {
      String error = "برجاء ادخال المرحلة العلمية";
      ErrorDialog.showErrorDialog(context, error);
    } else if (filePath == null || filePath!.isEmpty) {
      String error =
          "يجب رفع قرار لجنة المناقشة والحكم في صيغه (pdf | doc | docx | jpg | jpeg | png)";
      ErrorDialog.showErrorDialog(context, error);
    } else if (pdfFilePath == null || pdfFilePath!.isEmpty) {
      String error = "يحب رفع النسخه الكترونيه من الرساله فى صيغه Pdf";
      ErrorDialog.showErrorDialog(context, error);
    } else if (wordFilePath == null || wordFilePath!.isEmpty) {
      String error = "يحب رفع النسخه الكترونيه من الرساله فى صيغه Word";
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
  // Future<void> pickPdfFile() async {
  //   FilePickerResult? result = await FilePicker.platform.pickFiles(
  //     type: FileType.custom,
  //     allowedExtensions: ['pdf'],
  //   );

  //   if (result != null) {
  //     setState(() {
  //       pdfFilePath = result.files.single.path;
  //     });
  //   }
  // }

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
            (path.extension(filePathwo).toLowerCase() == '.doc' ||
                path.extension(filePathwo).toLowerCase() == '.docx')) {
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

  void openFile(String? file) {
    if (filePath != null) {
      File file = File(filePath!);
      if (file.existsSync()) {
        String fileExtension = file.path.split('.').last.toLowerCase();

        if (fileExtension == 'jpg' ||
            fileExtension == 'jpeg' ||
            fileExtension == 'png' ||
            fileExtension == 'webp' ||
            fileExtension == 'svg') {
          // Display image file
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

  void deleteFile(String? file) {
    print("Deleting file: $file");
    setState(() {
      filePath = null;
    });
  }

  void openWordFile(String? filewo) {
    if (filewo != null) {
      File file2 = File(filewo!);
      if (file2.existsSync()) {
        String fileExtension = file2.path.split('.').last.toLowerCase();
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

  void deleteWordFile() {
    setState(() {
      wordFilePath = null;
    });
  }

  void openPdfFile(String? filepd) {
    if (filepd != null) {
      File file3 = File(filepd!);
      if (file3.existsSync()) {
        String fileExtension = file3.path.split('.').last.toLowerCase();
        if (fileExtension == 'pdf') {
          OpenFilex.open(filepd!);
        } else {
          // Unsupported file type
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

  void deletePdfFile() {
    setState(() {
      pdfFilePath = null;
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
                      "اجراءات تسليم نسخة الكترونية من الرسائل العلمية ",
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
                                "اجراءات تسليم نسخة الكترونية من الرسائل العلمية (الماجستير والدكتوراه) بعد المناقشة",
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
                              height: 40,
                            ),
                            Align(
                              alignment: Alignment.center,
                              child: Padding(
                                padding: const EdgeInsets.only(right: 10.0),
                                child: Text(
                                  "قرار لجنة المناقشة والحكم معتمد ومختوم بختم النسر مذكور به عنوان الرسالة وتاريخ مناقشة الرسالة",
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                    // shadows: [
                                    //   Shadow(
                                    //     color: Colors.black,
                                    //     offset: Offset(2, 2),
                                    //     blurRadius: 5,
                                    //   ),
                                    // ],
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

                            SizedBox(height: 20),

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
                                      SizedBox(width: 25),
                                      ElevatedButton(
                                        onPressed: isButtonDisabled
                                            ? null // Disable button if isButtonDisabled is true
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
                                      ElevatedButton(
                                        onPressed: isButtonDisabled
                                            ? null // Disable button if isButtonDisabled is true
                                            : () => deleteFile(filePath),
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
                                  "نسخة الكترونية من الرسالة (كاملة بملف واحد مجمع ) فى صيغة Word",
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                    // shadows: [
                                    //   Shadow(
                                    //     color: Colors.black,
                                    //     offset: Offset(2, 2),
                                    //     blurRadius: 5,
                                    //   ),
                                    // ],
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
                                    children: [
                                      SizedBox(
                                          width:
                                              25), // إضافة مسافة بين النص والأزرار
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
                                padding: const EdgeInsets.only(right: 15.0),
                                child: Text(
                                  "نسخة الكترونية من الرسالة (كاملة بملف واحد مجمع ) فى صيغة Pdf Text وليست Pdf image  ",
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                    // shadows: [
                                    //   Shadow(
                                    //     color: Colors.black,
                                    //     offset: Offset(2, 2),
                                    //     blurRadius: 5,
                                    //   ),
                                    // ],
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
                                    children: [
                                      SizedBox(
                                          width:
                                              25), // إضافة مسافة بين النص والأزرار
                                      ElevatedButton(
                                        onPressed: isButtonDisabled
                                            ? null
                                            : () => openPdfFile(pdfFilePath!),
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

                            SizedBox(height: 20),
                            ElevatedButton(
                              onPressed: isButtonDisabled
                                  ? null // Disable button if isButtonDisabled is true
                                  : () async {
                                      await handlesub();
                                      if (_level_controller != null &&
                                          filePath != null &&
                                          filePath!.isNotEmpty &&
                                          pdfFilePath != null &&
                                          pdfFilePath!.isNotEmpty &&
                                          wordFilePath != null &&
                                          wordFilePath!.isNotEmpty) {
                                        if (status == 3) {
                                          await ser7send(_token!);
                                        } else
                                          await ser7(_token!);
                                      }
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
