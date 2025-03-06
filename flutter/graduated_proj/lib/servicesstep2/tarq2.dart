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

class tarq2 extends StatefulWidget {
  final int? value;
  final Map<String, dynamic>? serr;

  const tarq2({super.key, this.value, this.serr});

  @override
  _tarq2State createState() => _tarq2State();
}

class _tarq2State extends State<tarq2> {
  String? selectedValue;
  String? filePath;
  String? researchpath;
  String? pdfFilePath;
  bool isFilePickerActive = false;
  Map<int, bool?> iswordFromApi = {};
  Map<int, bool?> ispdfFromApi = {};
  Map<int, bool?> isaccepFromApi = {};
  Map<int, String?> pdfFilePaths = {};
  Map<int, String?> wordFilePaths = {};
  Map<int, String?> acceptpaths = {};
  bool errorShown = false;
  String? _token = "";
  double progressPercentage = 0.0;
  bool uploading = false;
  bool isButtonDisabled = false;
  Map<String, dynamic>? serrr;
  late Map<String, dynamic> data;
  int? id;
  int? id2;
  int? status;
  bool pdferror = false;
  int? filenum;
  String? url = "http://10.0.2.2:5001";
  bool isPhotoFromApi = false;
  bool isPhoto2FromApi = false;

  void initState() {
    super.initState();
    serrr = widget.serr;
    id = widget.value;
    initializeState();
  }

  Future<void> initializeState() async {
    await getdata();
    if (status == 3) {
      await step2ser5get(_token!).then((_) {
        print(filePath); // Print after _level_controller2 is set
      });
    }
  }

  Future<void> step2ser5get(String token) async {
    try {
      Uri url = Uri.parse('http://10.0.2.2:5001/StepTwoRegEdit/$id/$id2');
      final response = await http.get(url, headers: {
        'Authorization': 'Bearer $token',
        'withCredentials': 'true'
      });
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(response.body);

        setState(() {
          filePath = responseData['photo_payment_receipt'];
          researchpath = responseData['research_list'];

          pdfFilePaths[1] = responseData['research1_image_pdf'];
          pdfFilePaths[2] = responseData['research2_image_pdf'];
          pdfFilePaths[3] = responseData['research3_image_pdf'];
          pdfFilePaths[4] = responseData['research4_image_pdf'];
          pdfFilePaths[5] = responseData['research5_image_pdf'];
          pdfFilePaths[6] = responseData['research6_image_pdf'];
          pdfFilePaths[7] = responseData['research7_image_pdf'];
          pdfFilePaths[8] = responseData['research8_image_pdf'];
          pdfFilePaths[9] = responseData['research9_image_pdf'];
          pdfFilePaths[10] = responseData['research10_image_pdf'];

          wordFilePaths[1] = responseData['research1_image_word'];
          wordFilePaths[2] = responseData['research2_image_word'];
          wordFilePaths[3] = responseData['research3_image_word'];
          wordFilePaths[4] = responseData['research4_image_word'];
          wordFilePaths[5] = responseData['research5_image_word'];
          wordFilePaths[6] = responseData['research6_image_word'];
          wordFilePaths[7] = responseData['research7_image_word'];
          wordFilePaths[8] = responseData['research8_image_word'];
          wordFilePaths[9] = responseData['research9_image_word'];
          wordFilePaths[10] = responseData['research10_image_word'];

          acceptpaths[1] = responseData['acceptance_letter1'];
          acceptpaths[2] = responseData['acceptance_letter2'];
          acceptpaths[3] = responseData['acceptance_letter3'];
          acceptpaths[4] = responseData['acceptance_letter4'];
          acceptpaths[5] = responseData['acceptance_letter5'];
          acceptpaths[6] = responseData['acceptance_letter6'];
          acceptpaths[7] = responseData['acceptance_letter7'];
          acceptpaths[8] = responseData['acceptance_letter8'];
          acceptpaths[9] = responseData['acceptance_letter9'];
          acceptpaths[10] = responseData['acceptance_letter10'];

          isPhotoFromApi = true;
          isPhoto2FromApi = true;
          for (var m = 0; m < filenum!; m++) {
            ispdfFromApi[m + 1] = true;
            iswordFromApi[m + 1] = true;
            isaccepFromApi[m + 1] = true;
          }
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
        id2 = serrr!['ser_upgrade'];
        filenum = serrr!['files_numbers'];
        status = serrr!['status'];
      }
    });
  }

  Future<void> st2ser5(String token) async {
    try {
      Dio dio = Dio();
      dio.options.headers['Authorization'] = 'Bearer $token';
      dio.options.headers['Content-Type'] = 'multipart/form-data';
      dio.options.headers['withCredentials'] = 'true';

      FormData formData = FormData();
      int appid = id2!;

      formData.fields.add(MapEntry('service_id', widget.value.toString()));
      formData.fields.add(MapEntry('application_id', appid.toString()));
      formData.fields.add(MapEntry('files_numbers', filenum.toString()));

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
      if (researchpath != null) {
        if (isPhoto2FromApi) {
          formData.fields.add(
            MapEntry('research_list', researchpath!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'research_list',
              await MultipartFile.fromFile(researchpath!),
            ),
          );
        }
      }

      if (wordFilePaths[1] != null) {
        if (iswordFromApi[1]!) {
          formData.fields.add(
            MapEntry('word1', wordFilePaths[1]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'word1',
              await MultipartFile.fromFile(wordFilePaths[1]!),
            ),
          );
        }
      }
      if (wordFilePaths[2] != null) {
        if (iswordFromApi[2]!) {
          formData.fields.add(
            MapEntry('word2', wordFilePaths[2]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'word2',
              await MultipartFile.fromFile(wordFilePaths[2]!),
            ),
          );
        }
      }
      if (wordFilePaths[3] != null) {
        if (iswordFromApi[3]!) {
          formData.fields.add(
            MapEntry('word3', wordFilePaths[3]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'word3',
              await MultipartFile.fromFile(wordFilePaths[3]!),
            ),
          );
        }
      }

      if (wordFilePaths[4] != null) {
        if (iswordFromApi[4]!) {
          formData.fields.add(
            MapEntry('word4', wordFilePaths[4]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'word4',
              await MultipartFile.fromFile(wordFilePaths[4]!),
            ),
          );
        }
      }
      if (wordFilePaths[5] != null) {
        if (iswordFromApi[5]!) {
          formData.fields.add(
            MapEntry('word5', wordFilePaths[5]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'word5',
              await MultipartFile.fromFile(wordFilePaths[5]!),
            ),
          );
        }
      }
      if (wordFilePaths[6] != null) {
        if (iswordFromApi[6]!) {
          formData.fields.add(
            MapEntry('word6', wordFilePaths[6]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'word6',
              await MultipartFile.fromFile(wordFilePaths[6]!),
            ),
          );
        }
      }

      if (wordFilePaths[7] != null) {
        if (iswordFromApi[7]!) {
          formData.fields.add(
            MapEntry('word7', wordFilePaths[7]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'word7',
              await MultipartFile.fromFile(wordFilePaths[7]!),
            ),
          );
        }
      }

      if (wordFilePaths[8] != null) {
        if (iswordFromApi[8]!) {
          formData.fields.add(
            MapEntry('word8', wordFilePaths[8]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'word8',
              await MultipartFile.fromFile(wordFilePaths[8]!),
            ),
          );
        }
      }
      if (wordFilePaths[9] != null) {
        if (iswordFromApi[9]!) {
          formData.fields.add(
            MapEntry('word9', wordFilePaths[9]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'word9',
              await MultipartFile.fromFile(wordFilePaths[9]!),
            ),
          );
        }
      }
      if (wordFilePaths[10] != null) {
        if (iswordFromApi[10]!) {
          formData.fields.add(
            MapEntry('word10', wordFilePaths[10]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'word10',
              await MultipartFile.fromFile(wordFilePaths[10]!),
            ),
          );
        }
      }
      if (pdfFilePaths[1] != null) {
        if (ispdfFromApi[1]!) {
          formData.fields.add(
            MapEntry('pdf1', pdfFilePaths[1]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf1',
              await MultipartFile.fromFile(pdfFilePaths[1]!),
            ),
          );
        }
      }
      if (pdfFilePaths[2] != null) {
        if (ispdfFromApi[2]!) {
          formData.fields.add(
            MapEntry('pdf2', pdfFilePaths[2]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf2',
              await MultipartFile.fromFile(pdfFilePaths[2]!),
            ),
          );
        }
      }

      if (pdfFilePaths[3] != null) {
        if (ispdfFromApi[3]!) {
          formData.fields.add(
            MapEntry('pdf3', pdfFilePaths[3]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf3',
              await MultipartFile.fromFile(pdfFilePaths[3]!),
            ),
          );
        }
      }
      if (pdfFilePaths[4] != null) {
        if (ispdfFromApi[4]!) {
          formData.fields.add(
            MapEntry('pdf4', pdfFilePaths[4]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf4',
              await MultipartFile.fromFile(pdfFilePaths[4]!),
            ),
          );
        }
      }
      if (pdfFilePaths[5] != null) {
        if (ispdfFromApi[5]!) {
          formData.fields.add(
            MapEntry('pdf5', pdfFilePaths[5]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf5',
              await MultipartFile.fromFile(pdfFilePaths[5]!),
            ),
          );
        }
      }
      if (pdfFilePaths[6] != null) {
        if (ispdfFromApi[6]!) {
          formData.fields.add(
            MapEntry('pdf6', pdfFilePaths[6]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf6',
              await MultipartFile.fromFile(pdfFilePaths[6]!),
            ),
          );
        }
      }
      if (pdfFilePaths[7] != null) {
        if (ispdfFromApi[7]!) {
          formData.fields.add(
            MapEntry('pdf7', pdfFilePaths[7]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf7',
              await MultipartFile.fromFile(pdfFilePaths[7]!),
            ),
          );
        }
      }

      if (pdfFilePaths[8] != null) {
        if (ispdfFromApi[8]!) {
          formData.fields.add(
            MapEntry('pdf8', pdfFilePaths[8]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf8',
              await MultipartFile.fromFile(pdfFilePaths[8]!),
            ),
          );
        }
      }
      if (pdfFilePaths[9] != null) {
        if (ispdfFromApi[9]!) {
          formData.fields.add(
            MapEntry('pdf9', pdfFilePaths[9]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf9',
              await MultipartFile.fromFile(pdfFilePaths[9]!),
            ),
          );
        }
      }

      if (pdfFilePaths[10] != null) {
        if (ispdfFromApi[10]!) {
          formData.fields.add(
            MapEntry('pdf10', pdfFilePaths[10]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf10',
              await MultipartFile.fromFile(pdfFilePaths[10]!),
            ),
          );
        }
      }

      if (acceptpaths[1] != null) {
        if (isaccepFromApi[1]!) {
          formData.fields.add(
            MapEntry('pdf11', acceptpaths[1]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf11',
              await MultipartFile.fromFile(acceptpaths[1]!),
            ),
          );
        }
      }
      if (acceptpaths[2] != null) {
        if (isaccepFromApi[2]!) {
          formData.fields.add(
            MapEntry('pdf12', acceptpaths[2]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf12',
              await MultipartFile.fromFile(acceptpaths[2]!),
            ),
          );
        }
      }

      if (acceptpaths[3] != null) {
        if (isaccepFromApi[3]!) {
          formData.fields.add(
            MapEntry('pdf13', acceptpaths[3]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf13',
              await MultipartFile.fromFile(acceptpaths[3]!),
            ),
          );
        }
      }

      if (acceptpaths[4] != null) {
        if (isaccepFromApi[4]!) {
          formData.fields.add(
            MapEntry('pdf14', acceptpaths[4]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf14',
              await MultipartFile.fromFile(acceptpaths[4]!),
            ),
          );
        }
      }
      if (acceptpaths[5] != null) {
        if (isaccepFromApi[5]!) {
          formData.fields.add(
            MapEntry('pdf15', acceptpaths[5]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf15',
              await MultipartFile.fromFile(acceptpaths[5]!),
            ),
          );
        }
      }

      if (acceptpaths[6] != null) {
        if (isaccepFromApi[6]!) {
          formData.fields.add(
            MapEntry('pdf16', acceptpaths[6]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf16',
              await MultipartFile.fromFile(acceptpaths[6]!),
            ),
          );
        }
      }

      if (acceptpaths[7] != null) {
        if (isaccepFromApi[7]!) {
          formData.fields.add(
            MapEntry('pdf17', acceptpaths[7]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf17',
              await MultipartFile.fromFile(acceptpaths[7]!),
            ),
          );
        }
      }

      if (acceptpaths[8] != null) {
        if (isaccepFromApi[8]!) {
          formData.fields.add(
            MapEntry('pdf11', acceptpaths[8]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf18',
              await MultipartFile.fromFile(acceptpaths[8]!),
            ),
          );
        }
      }

      if (acceptpaths[9] != null) {
        if (isaccepFromApi[9]!) {
          formData.fields.add(
            MapEntry('pdf19', acceptpaths[9]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf19',
              await MultipartFile.fromFile(acceptpaths[9]!),
            ),
          );
        }
      }

      if (acceptpaths[10] != null) {
        if (isaccepFromApi[10]!) {
          formData.fields.add(
            MapEntry('pdf20', acceptpaths[10]!),
          );
        } else {
          formData.files.add(
            MapEntry(
              'pdf20',
              await MultipartFile.fromFile(acceptpaths[10]!),
            ),
          );
        }
      }

      setState(() {
        uploading = true;
        isButtonDisabled = true;
      });

      Response response = await dio.put(
        'http://10.0.2.2:5001/StepTwoSer5/$id/$id2',
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
    }

    // for (var m = 0; m < 10; m++) {
    //       if (pdfFilePaths[m+1] != null || pdfFilePaths[m+1] !.isNotEmpty) {

    //   if (pdfFilePaths[m + 1]!.split('.') != "pdf") {
    //     if (!errorShown) {
    //       String error = "يجب دخال البحث ${m + 1} pdf";
    //       ErrorDialog.showErrorDialog(context, error);
    //       errorShown = true;
    //     } else {
    //       break;
    //     }
    //   }

    // }}
  }

  Future<void> pickPdfFile(int valu) async {
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
            pdfFilePaths[valu] = filePathpd;
            ispdfFromApi[valu] = false;
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

  Future<void> pickWordFile(int valu) async {
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
            wordFilePaths[valu] = filePathwo;
            iswordFromApi[valu] = false;
          });
        } else {
          String error = "يجب اختيار الملف فى صيغة word";
          ErrorDialog.showErrorDialog(context, error);
        }
      }} catch (e) {
      print("Error picking file: $e");
    } finally {
      setState(() {
        isFilePickerActive = false;
      });
    }
  }

  Future<void> pickacceptFile(int valu) async {
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
        String? filePathpd2 = result.files.single.path;

        if (filePathpd2 != null &&
            path.extension(filePathpd2).toLowerCase() == '.pdf') {
          setState(() {
            acceptpaths[valu] = filePathpd2;
            isaccepFromApi[valu] = false;
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
          researchpath = result.files.single.path;
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
    if (researchpath != null) {
      File file = File(researchpath!);
      if (file.existsSync()) {
        String fileExtension = file.path.split('.').last.toLowerCase();
        if (fileExtension == 'jpg' ||
            fileExtension == 'jpeg' ||
            fileExtension == 'png' ||
            fileExtension == 'webp' ||
            fileExtension == 'svg') {
          OpenFilex.open(researchpath!);
        } else if (fileExtension == 'pdf') {
          OpenFilex.open(researchpath!);
        } else if (fileExtension == 'doc' || fileExtension == 'docx') {
          OpenFilex.open(researchpath!);
        } else {
          // Unsupported file type
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Unsupported file type'),
            ),
          );
        }
      } else {
        launchUrlString('$url/${serrr!['national_id']}/$researchpath');
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No file selected'),
        ),
      );
    }
  }

  void openaccepFile(int valu) {
    if (acceptpaths[valu] != null) {
      File file = File(acceptpaths[valu]!);
      if (file.existsSync()) {
        String fileExtension = file.path.split('.').last.toLowerCase();
        if (fileExtension == 'pdf') {
          OpenFilex.open(acceptpaths[valu]!);
        } else {
          // Unsupported file type
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Unsupported file type'),
            ),
          );
        }
      } else {
        launchUrlString('$url/${serrr!['national_id']}/${acceptpaths[valu]}');
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
    setState(() {
      filePath = null;
    });
  }

  void deleteFile2(String? file) {
    setState(() {
      researchpath = null;
    });
  }

  void openWordFile(int valu) {
    if (wordFilePaths[valu] != null) {
      File file3 = File(wordFilePaths[valu]!);
      if (file3.existsSync()) {
        String fileExtension = file3.path.split('.').last.toLowerCase();
        if (fileExtension == 'doc' || fileExtension == 'docx') {
          OpenFilex.open(wordFilePaths[valu]!);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Unsupported file type'),
            ),
          );
        }
      } else {
        launchUrlString('$url/${serrr!['national_id']}/${wordFilePaths[valu]}');
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No file selected'),
        ),
      );
    }
  }

  void deleteWordFile(int valu) {
    print("Deleting Word file: $valu");
    setState(() {
      wordFilePaths[valu] = null;
    });
  }

  void openPdfFile(int valu) {
    if (pdfFilePaths[valu] != null) {
      File file = File(pdfFilePaths[valu]!);
      if (file.existsSync()) {
        String fileExtension = file.path.split('.').last.toLowerCase();
        if (fileExtension == 'pdf') {
          OpenFilex.open(pdfFilePaths[valu]!);
        } else {
          // Unsupported file type
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Unsupported file type'),
            ),
          );
        }
      } else {
        launchUrlString('$url/${serrr!['national_id']}/${pdfFilePaths[valu]}');
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No file selected'),
        ),
      );
    }
  }

  void deletePdfFile(int valu) {
    print("Deleting PDF file: $valu");
    setState(() {
      pdfFilePaths[valu] = null;
    });
  }

  void deleteaccepdile(int valu) {
    print("Deleting PDF file: $pdfFilePath");
    setState(() {
      acceptpaths[valu] = null;
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
                                "فحص الابحاث العلمية لغرض الترقية",
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
                                "فحص الابحاث العلمية لغرض الترقية",
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
                                padding: const EdgeInsets.only(right: 10.0),
                                child: Text(
                                  "قائمة الابحاث المعتمدة والمؤرخة بتاريخ حديث ( اختياري )",
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
                              onTap: isButtonDisabled
                                  ? null
                                  : () {
                                      pickFile2();
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

                            if (researchpath != null)
                              Column(
                                children: [
                                  Text(
                                    '${path.basename(researchpath ?? "")}',
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
                                            : () => openFile2(researchpath),
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
                                            : () => deleteFile2(researchpath),
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
                              height: 20,
                            ),

                            Column(
                                children: List.generate(filenum!, (i) {
                              return Column(children: [
                                Align(
                                  alignment: Alignment.center,
                                  child: Padding(
                                    padding: const EdgeInsets.only(right: 15.0),
                                    child: Text(
                                      "البحث ${i + 1} PDF (اختيارى) ",
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
                                          pickPdfFile(i + 1);
                                        },
                                  child: Center(
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
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
                                if (pdfFilePaths[i + 1] != null)
                                  Column(
                                    children: [
                                      Text(
                                        '${path.basename(pdfFilePaths[i + 1] ?? "")}',
                                        style: TextStyle(
                                            fontSize: 16,
                                            color: Color(0xFFAD8700)),
                                      ),
                                      SizedBox(height: 20),
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          ElevatedButton(
                                            onPressed: isButtonDisabled
                                                ? null
                                                : () => openPdfFile(i + 1),
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor:
                                                  Color(0xFFAD8700),
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
                                              width:
                                                  80), // إضافة مسافة بين الأزرار
                                          ElevatedButton(
                                            onPressed: isButtonDisabled
                                                ? null // Disable button if isButtonDisabled is true
                                                : () => deletePdfFile(i + 1),
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor:
                                                  Color(0xFFAD8700),
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
                                    padding: const EdgeInsets.only(right: 15.0),
                                    child: Text(
                                      "البحث ${i + 1} word (اختيارى) ",
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
                                          pickWordFile(i + 1);
                                        },
                                  child: Center(
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
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
                                if (wordFilePaths[i + 1] != null)
                                  Column(
                                    children: [
                                      Text(
                                        '${path.basename(wordFilePaths[i + 1] ?? "")}',
                                        style: TextStyle(
                                            fontSize: 16,
                                            color: Color(0xFFAD8700)),
                                      ),
                                      SizedBox(height: 20),
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          ElevatedButton(
                                            onPressed: isButtonDisabled
                                                ? null
                                                : () => openWordFile(i + 1),
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor:
                                                  Color(0xFFAD8700),
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
                                              width:
                                                  80), // إضافة مسافة بين الأزرار
                                          ElevatedButton(
                                            onPressed: isButtonDisabled
                                                ? null // Disable button if isButtonDisabled is true
                                                : () => deleteWordFile(i + 1),
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor:
                                                  Color(0xFFAD8700),
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
                                    padding: const EdgeInsets.only(right: 15.0),
                                    child: Text(
                                      "خطاب قبول البحث ${i + 1} في حاله ان البحث لم ينشر بعد ( اختياري )",
                                      // "البحث ${i + 1} PDF (اختيارى) ",
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
                                          pickacceptFile(i + 1);
                                        },
                                  child: Center(
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
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
                                if (acceptpaths[i + 1] != null)
                                  Column(
                                    children: [
                                      Text(
                                        '${path.basename(acceptpaths[i + 1] ?? "")}',
                                        style: TextStyle(
                                            fontSize: 16,
                                            color: Color(0xFFAD8700)),
                                      ),
                                      SizedBox(height: 20),
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          ElevatedButton(
                                            onPressed: isButtonDisabled
                                                ? null
                                                : () => openaccepFile(i + 1),
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor:
                                                  Color(0xFFAD8700),
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
                                              width:
                                                  80), // إضافة مسافة بين الأزرار
                                          ElevatedButton(
                                            onPressed: isButtonDisabled
                                                ? null // Disable button if isButtonDisabled is true
                                                : () => deleteaccepdile(i + 1),
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor:
                                                  Color(0xFFAD8700),
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
                              ]);
                            })),

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
                                if (filePath != null && filePath!.isNotEmpty) {
                                  await st2ser5(_token!);
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
                                ' ارسال',
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
