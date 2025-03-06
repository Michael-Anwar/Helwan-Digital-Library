import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:graduated_proj/back_flutt/crud.dart';
import 'package:graduated_proj/back_flutt/link.dart';
import 'package:graduated_proj/files_viewer/errormess.dart';
import 'package:graduated_proj/main.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart' show MediaType;
import 'package:image_picker/image_picker.dart';
import 'package:url_launcher/url_launcher_string.dart';

class UserProfile extends StatefulWidget {
  @override
  _UserProfileState createState() => _UserProfileState();
}

String? _img = "";

class _UserProfileState extends State<UserProfile> {
  String? _name = "";
  String? _email = "";
  String? _nat_id = "";
  String? _mobile = "";
  String? _nation = "";
  String? _univer = "";
  String? _facul = "";
  String? _dept = "";
  String? _token = "";
  String _errorMessage = '';
  bool imgfromapi = false;
  File? _imageFile;
  bool _showAdditionalContent = false;

  String? url = "http://10.0.2.2:5001";
  String? _fuc_id = "";
  String? _facultyNameAr;
  bool showPersonal = false;
  crud _crud = crud();
  List<Map<String, dynamic>> faculty = [];
  List<Map<String, dynamic>> servicewait = [];
  Map<String, dynamic>? serv;
  int? id2;
  int? id;
  Map<String, dynamic>? datagetd;
  Map<String, dynamic>? databef;
  String? filepath;
  bool isDownloading = false;
  int filenum = 0;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();

    initializeData();
    initializewaitData();
  }

  Future<void> initializeData() async {
    await getdata();
    fetchData().then((data) {
      setState(() {
        faculty = data;
      });
    });

    await get2();

    if (_univer == "1") {
      _univer = "جامعة حلوان";
    }

    // get2();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToEnd() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(seconds: 1),
        curve: Curves.easeOut,
      );
    });
  }

  initializewaitData() async {
    await fetchwaitData(_token!).then((data) {
      setState(() {
        servicewait = data;
        // print(servicewait);
      });
    });
  }

  Future<List<Map<String, dynamic>>> fetchwaitData(String token) async {
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

  Future<void> collecold(Map<String, dynamic> serr) async {
    setState(() {
      databef = serr;
    });
  }

  Future<void> seyvget(
    String token,
  ) async {
    try {
      Uri url = Uri.parse('http://10.0.2.2:5001/StepTwoRegEdit/$id/$id2');
      final response = await http.get(url, headers: {
        'Authorization': 'Bearer $token',
        'withCredentials': 'true'
      });
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(response.body);
        setState(() {
          datagetd = responseData;
          int filenum = (datagetd?["files_numbers"] as num?)?.toInt() ?? 0;
          print(filenum);
        });
      } else {
        // Handle other status codes
        print('Error: ${response.statusCode}');
      }
    } catch (error) {
      print('Error: $error'); // Log any caught errors
    }
  }

  Future<void> get2() async {
    try {
      Uri url = Uri.parse('http://10.0.2.2:5001/user/getuser');
      final response = await http.get(url, headers: {
        'Authorization': 'Bearer $_token',
        'withCredentials': 'true'
      });
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(response.body);
        // print(responseData); // Log the response data
        setState(() {
          _img = responseData['img'];
          _name = responseData['name'];
          _email = responseData['email'];
          _nat_id = responseData['national_id'].toString();
          _mobile = responseData['phone'].toString();
          _nation = responseData['nationality'].toString();
          _univer = responseData['university'].toString();
          _facul = responseData['faculity'].toString();
          _dept = responseData['department'];
          _fuc_id = responseData['faculty_id'].toString();

          if (_fuc_id != null) {
            for (var item in faculty) {
              if (item['faculty_id'].toString() == _fuc_id.toString()) {
                _facultyNameAr = item['faculty_name_ar'];
                _facul = _facultyNameAr; // Update _facul here

                break; // Exit the loop since we found a match
              }
            }
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

  getdata() async {
    String? token = sharedpref.getString("token");
    setState(() {
      _token = token;
    });
  }

  Future<void> editUser() async {
    final picker = ImagePicker();
    final pickedImage = await picker.pickImage(source: ImageSource.gallery);

    var request =
        http.MultipartRequest('PUT', Uri.parse('$url/user/updateuser'));
    request.headers['Authorization'] = 'Bearer $_token';
    request.headers['withCredentials'] = 'true';

    request.fields['name'] = _name!;
    request.fields['email'] = _email!;
    request.fields['national_id'] = _nat_id!;
    request.fields['phone'] = _mobile!;
    request.fields['nationality'] = _nation!;
    if (_univer == "جامعة حلوان") {
      request.fields['university'] = "1";
    } else {
      request.fields['university'] = _univer!;
    }
    if (_facultyNameAr != null) {
      request.fields['faculity'] = "";
    } else {
      request.fields['faculity'] = _facul!;
    }
    request.fields['department'] = _dept!;

    if (pickedImage != null) {
      _imageFile = File(pickedImage.path!);

      final parts = pickedImage.name.split('.');
      final fileExtension = parts.last.toLowerCase();
      request.files.add(
        await http.MultipartFile.fromPath(
          'img',
          pickedImage.path,
          contentType: MediaType('image', fileExtension),
        ),
      );
    }

    try {
      final response = await request.send();

      if (response.statusCode == 200) {
        final responseBody = await response.stream.bytesToString();
        // print('Request URL: ${request.url}');
        // print('Request Headers: ${request.headers}');
        // print('Response Status Code: ${response.statusCode}');
        // print('Response Body: $responseBody');

        setState(() {
          _img = pickedImage?.name;
          imgfromapi = true;
        });
      } else {
        final responseBody = await response.stream.bytesToString();
        final decodedData = json.decode(responseBody);
        setState(() {
          _errorMessage = decodedData['message'][0];
          ErrorDialog.showErrorDialog(context, _errorMessage);
        });
      }
    } catch (error) {
      setState(() {
        _errorMessage = error.toString();
      });
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
              child: Text(" الملف الشخصى",
                  textAlign: TextAlign.end,
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            )),
          ],
        ),
        backgroundColor: const Color.fromARGB(255, 16, 54, 92),
      ),
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          Container(
            height: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: const BoxDecoration(
              color: Color(0xFFF5F5F5),
            ),
            child: SingleChildScrollView(
              controller: _scrollController,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          GestureDetector(
                            onTap: () async {
                              editUser();
                            },
                            child: CircleAvatar(
                              backgroundImage: (_img == "" ||
                                      _img == null ||
                                      _nat_id == "" ||
                                      _nat_id == null)
                                  ? const AssetImage(
                                          'assets/images/Ellipse 1.png')
                                      as ImageProvider
                                  : imgfromapi == false
                                      ? NetworkImage('$url/${_nat_id}/${_img}')
                                          as ImageProvider
                                      : FileImage(_imageFile!),
                              radius: 60,
                            ),
                          )
                        ]),
                  ),
                  Text(
                    "$_name",
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 17),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      GestureDetector(
                          onTap: () {
                            setState(() {
                              showPersonal = true;
                            });
                          },
                          child: Container(
                            width: 110,
                            child: Text(
                              "الخدمات التى قمت بالتسجيل فيها",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: !showPersonal
                                    ? Colors.black
                                    : const Color.fromRGBO(173, 135, 0, 1),
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          )),
                      const SizedBox(
                        width: 15,
                      ),
                      GestureDetector(
                          onTap: () {
                            setState(() {
                              showPersonal = false;
                            });
                          },
                          child: Text(
                            "البيانات الشخصية ",
                            style: TextStyle(
                              color: !showPersonal
                                  ? const Color.fromRGBO(173, 135, 0, 1)
                                  : Colors.black,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          )),
                    ],
                  ),
                  const SizedBox(
                    height: 15,
                  ),
                  if (showPersonal == false)
                    Container(
                      width: 350,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFF19355A),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  "$_name",
                                  style: const TextStyle(
                                    fontSize: 18,
                                    color: Color.fromRGBO(173, 135, 0, 1),
                                  ),
                                ),
                              ),
                              const Text(
                                'الاسم',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  '$_email',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    color: Color.fromRGBO(173, 135, 0, 1),
                                  ),
                                ),
                              ),
                              const Text(
                                'الايميل',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  '$_nat_id',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    color: Color.fromRGBO(173, 135, 0, 1),
                                  ),
                                ),
                              ),
                              const Text(
                                'الرقم القومى',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  '$_mobile',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    color: Color.fromRGBO(173, 135, 0, 1),
                                  ),
                                ),
                              ),
                              const Text(
                                'رقم الهاتف',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  '$_nation',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    color: Color.fromRGBO(173, 135, 0, 1),
                                  ),
                                ),
                              ),
                              const Text(
                                'الجنسية',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  '$_univer',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    color: Color.fromRGBO(173, 135, 0, 1),
                                  ),
                                ),
                              ),
                              const Text(
                                'الجامعة',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  '$_facul',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    color: Color.fromRGBO(173, 135, 0, 1),
                                  ),
                                ),
                              ),
                              const Text(
                                'الكلية',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  '$_dept',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    color: Color.fromRGBO(173, 135, 0, 1),
                                  ),
                                ),
                              ),
                              const Text(
                                'القسم',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          const Column(
                            children: [
                              Text(
                                "لطلب تعديل بياناتك الشخصيه يرجي ارسال رساله من صفحه تواصل معنا بخصوص اي خدمه وتوضيح البيانات المراد تعديلها",
                                style: TextStyle(
                                    fontSize: 17,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black),
                              )
                            ],
                          ),
                        ],
                      ),
                    ),
                  if (showPersonal == true)
                    Container(
                      // width: 350,
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF19355A),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        children: [
                          const Center(
                            child: Text(
                              "في حاله كان لديك اي استفسار او شكوي او طلب تعديل علي الافاده او التقرير المقدم يرجي التواصل معنا وتوضيح الاسباب من صفحه (تواصل معنا)",
                              style: TextStyle(
                                  fontSize: 15,
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold),
                              textDirection: TextDirection.rtl,
                            ),
                          ),
                          const SizedBox(
                            height: 15,
                          ),
                          servicewait.isEmpty
                              ? const Center(
                                  child: Text(
                                    "لم تقم بطلب اي خدمه بعد",
                                    style: TextStyle(
                                        fontSize: 20,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold),
                                  ),
                                )
                              : Padding(
                                  padding: const EdgeInsets.all(0),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.stretch,
                                    children: [
                                      Container(
                                        decoration: BoxDecoration(
                                          color: const Color.fromARGB(
                                              255, 16, 54, 92),
                                          borderRadius:
                                              BorderRadius.circular(10),
                                        ),
                                        padding: const EdgeInsets.all(0),
                                        child: Table(
                                          border: TableBorder.all(
                                            color: Colors.white,
                                            width: 0.7,
                                          ),
                                          children: [
                                            const TableRow(
                                              children: [
                                                TableCell(
                                                  child: Center(
                                                    child: Padding(
                                                      padding:
                                                          EdgeInsets.all(3.0),
                                                      child: Text(' المزيد',
                                                          textAlign:
                                                              TextAlign.center,
                                                          textDirection:
                                                              TextDirection.rtl,
                                                          style: TextStyle(
                                                              color:
                                                                  Colors.white,
                                                              fontWeight:
                                                                  FontWeight
                                                                      .bold,
                                                              fontSize: 14)),
                                                    ),
                                                  ),
                                                ),
                                                TableCell(
                                                  child: Center(
                                                    child: Padding(
                                                      padding:
                                                          EdgeInsets.all(3.0),
                                                      child: Text(
                                                          ' تاريخ التسجيل',
                                                          textAlign:
                                                              TextAlign.center,
                                                          textDirection:
                                                              TextDirection.rtl,
                                                          style: TextStyle(
                                                              color:
                                                                  Colors.white,
                                                              fontWeight:
                                                                  FontWeight
                                                                      .bold,
                                                              fontSize: 14)),
                                                    ),
                                                  ),
                                                ),
                                                TableCell(
                                                  child: Center(
                                                    child: Padding(
                                                      padding:
                                                          EdgeInsets.all(3.0),
                                                      child: Text(
                                                          ' حاله الخدمة',
                                                          textAlign:
                                                              TextAlign.center,
                                                          textDirection:
                                                              TextDirection.rtl,
                                                          style: TextStyle(
                                                              color:
                                                                  Colors.white,
                                                              fontWeight:
                                                                  FontWeight
                                                                      .bold,
                                                              fontSize: 14)),
                                                    ),
                                                  ),
                                                ),
                                                TableCell(
                                                  child: Center(
                                                    child: Padding(
                                                      padding:
                                                          EdgeInsets.all(3.0),
                                                      child: Text('اسم الخدمة',
                                                          textAlign:
                                                              TextAlign.center,
                                                          textDirection:
                                                              TextDirection.rtl,
                                                          style: TextStyle(
                                                              color:
                                                                  Colors.white,
                                                              fontWeight:
                                                                  FontWeight
                                                                      .bold,
                                                              fontSize: 14)),
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                          ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: servicewait.length,
                              itemBuilder: (BuildContext context, int index) {
                                final service = servicewait[index];

                                return Padding(
                                  padding: const EdgeInsets.all(0),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.stretch,
                                    children: [
                                      Container(
                                        decoration: BoxDecoration(
                                          color: const Color.fromARGB(
                                              255, 16, 54, 92),
                                          borderRadius:
                                              BorderRadius.circular(10),
                                        ),
                                        padding: const EdgeInsets.all(0),
                                        child: Table(
                                          border: TableBorder.all(
                                            color: Colors.white,
                                            width: 0.7,
                                          ),
                                          children: [
                                            TableRow(
                                              children: [
                                                TableCell(
                                                  child: Center(
                                                    child: Padding(
                                                      padding:
                                                          const EdgeInsets.all(
                                                              5.0),
                                                      child: ElevatedButton(
                                                        onPressed: () {
                                                          setState(() {
                                                            id2 = service[
                                                                        'ser_reg'] !=
                                                                    null
                                                                ? service[
                                                                    'ser_reg']
                                                                : service['ser_formation'] !=
                                                                        null
                                                                    ? service[
                                                                        'ser_formation']
                                                                    : service['ser_grant'] !=
                                                                            null
                                                                        ? service[
                                                                            'ser_grant']
                                                                        : service['ser_personal'] !=
                                                                                null
                                                                            ? service['ser_personal']
                                                                            : service['ser_upgrade'] != null
                                                                                ? service['ser_upgrade']
                                                                                : service['ser_knowledge'] != null
                                                                                    ? service['ser_knowledge']
                                                                                    : service['ser_magazine'] != null
                                                                                        ? service['ser_magazine']
                                                                                        : service['ser_best'] != null
                                                                                            ? service['ser_best']
                                                                                            : "";
                                                            id = service[
                                                                'service_id'];
                                                            seyvget(
                                                              _token!,
                                                            );
                                                            collecold(service);

                                                            _showAdditionalContent =
                                                                true;
                                                          });
                                                          _scrollToEnd();
                                                        },
                                                        style: ElevatedButton
                                                            .styleFrom(
                                                          shape:
                                                              RoundedRectangleBorder(
                                                            borderRadius:
                                                                BorderRadius
                                                                    .circular(
                                                                        7),
                                                          ),
                                                          backgroundColor:
                                                              const Color(
                                                                  0xFFAD8700),
                                                        ),
                                                        child: const Column(
                                                          children: [
                                                            Text(
                                                              'مزيد من التفاصيل',
                                                              textAlign:
                                                                  TextAlign
                                                                      .center,
                                                              textDirection:
                                                                  TextDirection
                                                                      .rtl,
                                                              style: TextStyle(
                                                                color: Colors
                                                                    .white,
                                                                fontWeight:
                                                                    FontWeight
                                                                        .bold,
                                                                fontSize: 12,
                                                              ),
                                                            ),
                                                          ],
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                                TableCell(
                                                  child: Padding(
                                                    padding:
                                                        const EdgeInsets.all(
                                                            5.0),
                                                    child: Center(
                                                      child: Text(
                                                        service['req_code_date'] !=
                                                                null
                                                            ? service[
                                                                    'req_code_date']
                                                                .substring(
                                                                    0, 10)
                                                            : service['submit_date'] !=
                                                                    null
                                                                ? service[
                                                                        'submit_date']
                                                                    .substring(
                                                                        0, 10)
                                                                : "",
                                                        textAlign:
                                                            TextAlign.center,
                                                        textDirection:
                                                            TextDirection.rtl,
                                                        style: const TextStyle(
                                                            fontWeight:
                                                                FontWeight.bold,
                                                            fontSize: 12,
                                                            color:
                                                                Colors.white),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                                TableCell(
                                                  child: Padding(
                                                    padding:
                                                        const EdgeInsets.all(
                                                            4.0),
                                                    child: Center(
                                                      child: Text(
                                                        service['status'] == 0
                                                            ? 'انتظار كود الدفع الخاص بالخدمه ... بعد وصول كود الدفع ودفع الرسوم يتم استكمال الاجراءات التالية  '
                                                            : service['status'] ==
                                                                    1
                                                                ? " استكمل الطلب "
                                                                : service['status'] ==
                                                                        2
                                                                    ? " في انتظار الرد من المكتبة "
                                                                    : service['status'] ==
                                                                            3
                                                                        ? " الرد متوقف لحين تعديل المرفقات "
                                                                        : service['status'] ==
                                                                                4
                                                                            ? " الرد متوقف لحين تعديل المرفقات "
                                                                            : service['status'] == 5
                                                                                ? "مقبول"
                                                                                : service['status'] == 6
                                                                                    ? "مرفوض"
                                                                                    : "",
                                                        textAlign:
                                                            TextAlign.center,
                                                        textDirection:
                                                            TextDirection.rtl,
                                                        style: const TextStyle(
                                                            fontWeight:
                                                                FontWeight.bold,
                                                            fontSize: 12,
                                                            color:
                                                                Colors.white),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                                TableCell(
                                                  child: Padding(
                                                    padding:
                                                        EdgeInsets.all(4.0),
                                                    child: Center(
                                                      child: Text(
                                                        service[
                                                            "service_name_ar"],
                                                        textAlign:
                                                            TextAlign.center,
                                                        textDirection:
                                                            TextDirection.rtl,
                                                        style: TextStyle(
                                                            fontWeight:
                                                                FontWeight.bold,
                                                            fontSize: 12,
                                                            color:
                                                                Colors.white),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              })
                        ],
                      ),
                    ),
                  const SizedBox(height: 40),
                  _showAdditionalContent
                      ? Container(
                          // height: 2000,

                          decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 16, 54, 92),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          padding: const EdgeInsets.fromLTRB(
                            16.0,
                            16.0,
                            16.0,
                            32.0,
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                padding: const EdgeInsets.only(bottom: 8.0),
                                child: Column(
                                  children: [
                                    databef!["service_name_ar"] != null
                                        ? Text(
                                            databef!["service_name_ar"],
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                            ),
                                          )
                                        : SizedBox(
                                            height: 10,
                                          ),
                                    const SizedBox(height: 5),
                                    Text(
                                      'المرفقات المرسلة',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 16,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                height: 2.0,
                                color: Colors.white,
                              ),
                              const SizedBox(height: 15),
                              databef!["submit_date"] != null
                                  ? Row(
                                      children: [
                                        Text(
                                          databef!["submit_date"] != null
                                              ? databef!["submit_date"]
                                                  .substring(0, 10)
                                              : "",
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 16,
                                          ),
                                        ),
                                        Expanded(
                                          child: Text(
                                            textDirection: TextDirection.rtl,
                                            "تاريخ ارسال المرفقات :  ",
                                            style: TextStyle(
                                              color: Color(0xFFAD8700),
                                              fontSize: 16,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 10),
                                      ],
                                    )
                                  : SizedBox(
                                      height: 1,
                                    ),
                              databef!["req_code_date"] != null &&
                                      databef!["submit_date"] != null
                                  ? Row(
                                      children: [
                                        Text(
                                          databef!["req_code_date"] != null
                                              ? databef!["req_code_date"]
                                                  .substring(0, 10)
                                              : "",
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 16,
                                          ),
                                        ),
                                        Expanded(
                                          child: Text(
                                            textDirection: TextDirection.rtl,
                                            "تاريخ طلب كود الدفع:  ",
                                            style: TextStyle(
                                              color: Color(0xFFAD8700),
                                              fontSize: 16,
                                            ),
                                          ),
                                        ),
                                        SizedBox(height: 15),
                                      ],
                                    )
                                  : SizedBox(
                                      height: 1,
                                    ),
                              datagetd?["level"].toString() != null &&
                                      datagetd?["level"] != ""
                                  ? Row(
                                      children: [
                                        Text(
                                          datagetd!["level"] == 0
                                              ? "ماجستير"
                                              : "دكتوراه",
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 16,
                                          ),
                                        ),
                                        Expanded(
                                          child: Text(
                                            textDirection: TextDirection.rtl,
                                            "المرحله العلميه:  ",
                                            style: TextStyle(
                                              color: Color(0xFFAD8700),
                                              fontSize: 16,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 15),
                                      ],
                                    )
                                  : SizedBox(height: 1),
                              datagetd?["academic"] != null
                                  ? Row(
                                      children: [
                                        Text(
                                          datagetd!["academic"] != null
                                              ? datagetd!["academic"]
                                              : "",
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 16,
                                          ),
                                        ),
                                        Expanded(
                                          child: Text(
                                            textDirection: TextDirection.rtl,
                                            "الشعبة الدراسيه : ",
                                            style: TextStyle(
                                              color: Color(0xFFAD8700),
                                              fontSize: 16,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 15),
                                      ],
                                    )
                                  : SizedBox(height: 1),

                              datagetd?["photo_college_letter"] != null &&
                                      datagetd?["photo_college_letter"] != ""
                                  ? Padding(
                                      padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: Row(
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              ElevatedButton(
                                                onPressed: () {
                                                  openpdf(datagetd![
                                                      "photo_college_letter"]);
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor:
                                                      Color(0xFFAD8700),
                                                  minimumSize: Size(90, 40),
                                                  disabledBackgroundColor:
                                                      Color(0xFFAD8700),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
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
                                            ],
                                          ),
                                          Expanded(
                                            child: Text(
                                              textDirection: TextDirection.rtl,
                                              'الخطاب الموجه الى مدير المكتبة الرقمية',
                                              style: TextStyle(
                                                color: Color(0xFFAD8700),
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          SizedBox(height: 15),
                                        ],
                                      ),
                                    )
                                  : SizedBox(height: 1),
                              datagetd?["photo_payment_receipt"] != null &&
                                      datagetd?["photo_payment_receipt"] != ""
                                  ? Padding(
                                      padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: Row(
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              ElevatedButton(
                                                onPressed: () {
                                                  openpdf(datagetd![
                                                      "photo_payment_receipt"]);
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: Color(
                                                      0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                  minimumSize: Size(90, 40),
                                                  disabledBackgroundColor:
                                                      Color(0xFFAD8700),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
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
                                            ],
                                          ),
                                          Expanded(
                                            child: Text(
                                              textDirection: TextDirection.rtl,
                                              'صورة ايصال الدفع',
                                              style: TextStyle(
                                                color: Color(0xFFAD8700),
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 15),
                                        ],
                                      ),
                                    )
                                  : SizedBox(height: 1),
                              datagetd?["research_plan_ar_pdf"] != null &&
                                      datagetd?["research_plan_ar_pdf"] != ""
                                  ? Padding(
                                      padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: Row(
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              ElevatedButton(
                                                onPressed: () {
                                                  openpdf(datagetd![
                                                      "research_plan_ar_pdf"]);
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: Color(
                                                      0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                  minimumSize: Size(90, 40),
                                                  disabledBackgroundColor:
                                                      Color(0xFFAD8700),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
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
                                            ],
                                          ),
                                          Expanded(
                                            child: Text(
                                              textDirection: TextDirection.rtl,
                                              'المخطط البحثي باللغة العربية PDF',
                                              style: TextStyle(
                                                color: Color(0xFFAD8700),
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 15),
                                        ],
                                      ),
                                    )
                                  : SizedBox(height: 1),
                              datagetd?["research_plan_ar_word"] != null &&
                                      datagetd?["research_plan_ar_word"] != ""
                                  ? Padding(
                                      padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: Row(
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              ElevatedButton(
                                                onPressed: () {
                                                  openpdf(datagetd![
                                                      "research_plan_ar_word"]);
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: Color(
                                                      0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                  minimumSize: Size(90, 40),
                                                  disabledBackgroundColor:
                                                      Color(0xFFAD8700),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
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
                                            ],
                                          ),
                                          Expanded(
                                            child: Text(
                                              textDirection: TextDirection.rtl,
                                              'المخطط البحثي باللغة العربية Word',
                                              style: TextStyle(
                                                color: Color(0xFFAD8700),
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 80),
                                        ],
                                      ),
                                    )
                                  : SizedBox(height: 1),
                              datagetd?["research_plan_en_pdf"] != null &&
                                      datagetd?["research_plan_en_pdf"] != ""
                                  ? Padding(
                                      padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: Row(
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              ElevatedButton(
                                                onPressed: () {
                                                  openpdf(datagetd![
                                                      "research_plan_en_pdf"]);
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: Color(
                                                      0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                  minimumSize: Size(90, 40),
                                                  disabledBackgroundColor:
                                                      Color(0xFFAD8700),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
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
                                            ],
                                          ),
                                          Expanded(
                                            child: Text(
                                              textDirection: TextDirection.rtl,
                                              'المخطط البحثي باللغة الانجليزيه PDF',
                                              style: TextStyle(
                                                color: Color(0xFFAD8700),
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 80),
                                        ],
                                      ),
                                    )
                                  : SizedBox(height: 1),
                              datagetd?["research_plan_en_word"] != null &&
                                      datagetd?["research_plan_en_word"] != ""
                                  ? Padding(
                                      padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: Row(
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              ElevatedButton(
                                                onPressed: () {
                                                  openpdf(datagetd![
                                                      "research_plan_en_word"]);
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: Color(
                                                      0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                  minimumSize: Size(90, 40),
                                                  disabledBackgroundColor:
                                                      Color(0xFFAD8700),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
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
                                            ],
                                          ),
                                          Expanded(
                                            child: Text(
                                              textDirection: TextDirection.rtl,
                                              'المخطط البحثي باللغة الانجليزيه Word',
                                              style: TextStyle(
                                                color: Color(0xFFAD8700),
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 80),
                                        ],
                                      ),
                                    )
                                  : SizedBox(height: 1),
                              datagetd?["translation_paper"] != null &&
                                      datagetd?["translation_paper"] != ""
                                  ? Padding(
                                      padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: Row(
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              ElevatedButton(
                                                onPressed: () {
                                                  openpdf(datagetd![
                                                      "translation_paper"]);
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: Color(
                                                      0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                  minimumSize: Size(90, 40),
                                                  disabledBackgroundColor:
                                                      Color(0xFFAD8700),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
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
                                            ],
                                          ),
                                          Expanded(
                                            child: Text(
                                              textDirection: TextDirection.rtl,
                                              '(التدقيق اللغوى من مركز اللغات و الترجمة)صورة ورقة الترجمة',
                                              style: TextStyle(
                                                color: Color(0xFFAD8700),
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 80),
                                        ],
                                      ),
                                    )
                                  : SizedBox(height: 1),
                              datagetd?["message_pdf_ar"] != null &&
                                      datagetd?["message_pdf_ar"] != ""
                                  ? Padding(
                                      padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: Row(
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              ElevatedButton(
                                                onPressed: () {
                                                  openpdf(datagetd![
                                                      "message_pdf_ar"]);
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: Color(
                                                      0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                  minimumSize: Size(90, 40),
                                                  disabledBackgroundColor:
                                                      Color(0xFFAD8700),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
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
                                            ],
                                          ),
                                          Expanded(
                                            child: Text(
                                              textDirection: TextDirection.rtl,
                                              'الرسالة المقدمة للفحص كاملة بملف واحد مجمع دون حذف أى اجزاء منها فى صيغة PDF',
                                              style: TextStyle(
                                                color: Color(0xFFAD8700),
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 80),
                                        ],
                                      ),
                                    )
                                  : SizedBox(height: 1),
                              datagetd?["message_word_ar"] != null &&
                                      datagetd?["message_word_ar"] != ""
                                  ? Padding(
                                      padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: Row(
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              ElevatedButton(
                                                onPressed: () {
                                                  openpdf(datagetd![
                                                      "message_word_ar"]);
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: Color(
                                                      0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                  minimumSize: Size(90, 40),
                                                  disabledBackgroundColor:
                                                      Color(0xFFAD8700),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
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
                                            ],
                                          ),
                                          Expanded(
                                            child: Text(
                                              textDirection: TextDirection.rtl,
                                              'الرسالة المقدمة للفحص (كاملة بملف واحد مجمع دون حذف أى اجزاء منها فى صيغة WORD',
                                              style: TextStyle(
                                                color: Color(0xFFAD8700),
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 80),
                                        ],
                                      ),
                                    )
                                  : SizedBox(height: 1),
                              datagetd?["quote_check_form"] != null &&
                                      datagetd?["quote_check_form"] != ""
                                  ? Padding(
                                      padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: Row(
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              ElevatedButton(
                                                onPressed: () {
                                                  openpdf(datagetd![
                                                      "quote_check_form"]);
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: Color(
                                                      0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                  minimumSize: Size(90, 40),
                                                  disabledBackgroundColor:
                                                      Color(0xFFAD8700),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
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
                                            ],
                                          ),
                                          Expanded(
                                            child: Text(
                                              textDirection: TextDirection.rtl,
                                              'النموذج الخاص بفحص اقتباس الرسائل العلمية لغرض التشكيل',
                                              style: TextStyle(
                                                color: Color(0xFFAD8700),
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 15),
                                        ],
                                      ),
                                    )
                                  : SizedBox(height: 1),
                              datagetd?["decision"] != null &&
                                      datagetd?["decision"] != ""
                                  ? Padding(
                                      padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: Row(
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              ElevatedButton(
                                                onPressed: () {
                                                  openpdf(
                                                      datagetd!["decision"]);
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: Color(
                                                      0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                  minimumSize: Size(90, 40),
                                                  disabledBackgroundColor:
                                                      Color(0xFFAD8700),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
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
                                            ],
                                          ),
                                          Expanded(
                                            child: Text(
                                              textDirection: TextDirection.rtl,
                                              'قرار لجنة المناقشة والحكم معتمد ومختوم بختم النسر مذكور به عنوان الرسالة وتاريخ مناقشة الرسالة',
                                              style: TextStyle(
                                                color: Color(0xFFAD8700),
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 80),
                                        ],
                                      ),
                                    )
                                  : SizedBox(
                                      height: 1,
                                    ),
                              datagetd?["research_list"] != null &&
                                      datagetd?["research_list"] != ""
                                  ? Padding(
                                      padding: EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: Row(
                                        children: [
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              ElevatedButton(
                                                onPressed: () {
                                                  openpdf(datagetd![
                                                      "research_list"]);
                                                },
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: Color(
                                                      0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                  minimumSize: Size(90, 40),
                                                  disabledBackgroundColor:
                                                      Color(0xFFAD8700),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            20),
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
                                            ],
                                          ),
                                          Expanded(
                                            child: Text(
                                              textDirection: TextDirection.rtl,
                                              'قائمة الابحاث المعتمدة والمؤرخة بتاريخ حديث ( اختياري )',
                                              style: TextStyle(
                                                color: Color(0xFFAD8700),
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 80),
                                        ],
                                      ),
                                    )
                                  : SizedBox(
                                      height: 1,
                                    ),

                              filenum! >= 1
                                  ? Column(
                                      children: List.generate(filenum!, (i) {
                                      return ((datagetd?[
                                                      "research${i + 1}_image_word"] !=
                                                  null &&
                                              datagetd?[
                                                      "research${i + 1}_image_word"] !=
                                                  "")
                                          ? Padding(
                                              padding: EdgeInsets.fromLTRB(
                                                  0, 8, 0, 0),
                                              child: Row(children: [
                                                Row(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment
                                                          .spaceBetween,
                                                  children: [
                                                    ElevatedButton(
                                                      onPressed: () {
                                                        openword(i + 1);
                                                      },
                                                      style: ElevatedButton
                                                          .styleFrom(
                                                        backgroundColor: Color(
                                                            0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                        minimumSize:
                                                            Size(90, 40),
                                                        disabledBackgroundColor:
                                                            Color(0xFFAD8700),
                                                        shape:
                                                            RoundedRectangleBorder(
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(20),
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
                                                  ],
                                                ),
                                                Expanded(
                                                  child: Text(
                                                    textDirection:
                                                        TextDirection.rtl,
                                                    "البحث ${i + 1} word ",
                                                    style: TextStyle(
                                                      color: Color(0xFFAD8700),
                                                      fontSize: 16,
                                                    ),
                                                  ),
                                                ),
                                                SizedBox(
                                                  height: 20,
                                                ),
                                              ]),
                                            )
                                          : SizedBox(height: 1));
                                    }))
                                  : SizedBox(
                                      height: 1,
                                    ),
                              filenum! >= 1
                                  ? Column(
                                      children: List.generate(filenum!, (i) {
                                      return ((datagetd?[
                                                      "research${i + 1}_image_pdf"] !=
                                                  null &&
                                              datagetd?[
                                                      "research${i + 1}_image_pdf"] !=
                                                  "")
                                          ? Padding(
                                              padding: EdgeInsets.fromLTRB(
                                                  0, 8, 0, 0),
                                              child: Row(children: [
                                                Row(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment
                                                          .spaceBetween,
                                                  children: [
                                                    ElevatedButton(
                                                      onPressed: () {
                                                        openpdf2(i + 1);
                                                      },
                                                      style: ElevatedButton
                                                          .styleFrom(
                                                        backgroundColor: Color(
                                                            0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                        minimumSize:
                                                            Size(90, 40),
                                                        disabledBackgroundColor:
                                                            Color(0xFFAD8700),
                                                        shape:
                                                            RoundedRectangleBorder(
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(20),
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
                                                  ],
                                                ),
                                                Expanded(
                                                  child: Text(
                                                    textDirection:
                                                        TextDirection.rtl,
                                                    "البحث ${i + 1} PDF  ",
                                                    style: TextStyle(
                                                      color: Color(0xFFAD8700),
                                                      fontSize: 16,
                                                    ),
                                                  ),
                                                ),
                                                SizedBox(
                                                  height: 20,
                                                ),
                                              ]),
                                            )
                                          : SizedBox(height: 1));
                                    }))
                                  : SizedBox(
                                      height: 1,
                                    ),
                              filenum! >= 1
                                  ? Column(
                                      children: List.generate(filenum!, (i) {
                                      return ((datagetd?[
                                                      "acceptance_letter${i + 1}"] !=
                                                  null &&
                                              datagetd?[
                                                      "acceptance_letter${i + 1}"] !=
                                                  "")
                                          ? Padding(
                                              padding: EdgeInsets.fromLTRB(
                                                  0, 8, 0, 0),
                                              child: Row(children: [
                                                Row(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment
                                                          .spaceBetween,
                                                  children: [
                                                    ElevatedButton(
                                                      onPressed: () {
                                                        openpdf3(i + 1);
                                                      },
                                                      style: ElevatedButton
                                                          .styleFrom(
                                                        backgroundColor: Color(
                                                            0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                        minimumSize:
                                                            Size(90, 40),
                                                        disabledBackgroundColor:
                                                            Color(0xFFAD8700),
                                                        shape:
                                                            RoundedRectangleBorder(
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(20),
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
                                                  ],
                                                ),
                                                Expanded(
                                                  child: Text(
                                                    textDirection:
                                                        TextDirection.rtl,
                                                    "خطاب قبول البحث ${i + 1} في حاله ان البحث لم ينشر بعد ( اختياري )",
                                                    style: TextStyle(
                                                      color: Color(0xFFAD8700),
                                                      fontSize: 16,
                                                    ),
                                                  ),
                                                ),
                                                SizedBox(
                                                  height: 20,
                                                ),
                                              ]),
                                            )
                                          : SizedBox(height: 1));
                                    }))
                                  : SizedBox(
                                      height: 1,
                                    ),
                              // SizedBox(height: 180.0),
                              const Text(
                                'الرد من المكتبة',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 10),
                              Container(
                                height: 2.0,
                                color: Colors.white,
                              ),
                              const SizedBox(height: 10),
                              (databef?["response_date"] != null &&
                                      (databef!["status"] == 3 ||
                                          databef!["status"] == 5 ||
                                          databef!["status"] == 6))
                                  ? Row(
                                      children: [
                                        Text(
                                          databef!["response_date"] != null
                                              ? databef!["response_date"]
                                                  .substring(0, 10)
                                              : "",
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 16,
                                          ),
                                        ),
                                        Expanded(
                                          child: Text(
                                            textDirection: TextDirection.rtl,
                                            "تاريخ الرد من المكتبة : ",
                                            style: TextStyle(
                                              color: Color(0xFFAD8700),
                                              fontSize: 16,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 15),
                                      ],
                                    )
                                  : SizedBox(
                                      height: 1,
                                    ),

                              databef?["payment_code"] != null
                                  ? Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            databef!["payment_code"] != null
                                                ? databef!["payment_code"]
                                                : "",
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                            ),
                                          ),
                                        ),
                                        Expanded(
                                          child: Text(
                                            textDirection: TextDirection.rtl,
                                            "كود الدفع :",
                                            style: TextStyle(
                                              color: Color(0xFFAD8700),
                                              fontSize: 16,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 15),
                                      ],
                                    )
                                  : SizedBox(
                                      height: 1,
                                    ),

                              (databef?["response_text"] != null &&
                                      (databef!["status"] == 3 ||
                                          databef!["status"] == 5 ||
                                          databef!["status"] == 6))
                                  ? Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            databef!["response_text"] != null
                                                ? databef!["response_text"]
                                                : "",
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                            ),
                                          ),
                                        ),
                                        Expanded(
                                          child: Text(
                                            textDirection: TextDirection.rtl,
                                            " ملاحظات : ",
                                            style: TextStyle(
                                              color: Color(0xFFAD8700),
                                              fontSize: 16,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 15),
                                      ],
                                    )
                                  : SizedBox(
                                      height: 1,
                                    ),
                              datagetd?["response_pdf"] != null &&
                                      datagetd?["response_pdf"] != ""
                                  ? Row(
                                      children: [
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            ElevatedButton(
                                              onPressed: () {
                                                openpdf(
                                                    datagetd!["response_pdf"]);
                                              },
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: Color(
                                                    0xFFAD8700), // ألوان الزر يمكن تعديلها وفقًا لرغبتك
                                                minimumSize: Size(90, 40),
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
                                          ],
                                        ),
                                        Expanded(
                                          child: Text(
                                            textDirection: TextDirection.rtl,
                                            'الافاده المرسله من المكتبة',
                                            style: TextStyle(
                                              color: Color(0xFFAD8700),
                                              fontSize: 16,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 15),
                                      ],
                                    )
                                  : SizedBox(height: 1),
                            ],
                          ),
                        )
                      : const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void openpdf(String pdf) {
    if (pdf != null) {
      launchUrlString('$url/${databef!['national_id']}/$pdf');
      print(pdf);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No file selected'),
        ),
      );
    }
  }

  void openpdf2(int valu) {
    if (valu != null) {
      launchUrlString(
          '$url/${databef!['national_id']}/${datagetd!["research${valu}_image_pdf"]}');
      print(datagetd!["research${valu}_image_pdf"]);
      // print(pdf);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No file selected'),
        ),
      );
    }
  }

  void openword(int valu) {
    if (valu != null) {
      launchUrlString(
          '$url/${databef!['national_id']}/${datagetd!["research${valu}_image_word"]}');
      print(datagetd!["research${valu}_image_word"]);
      // print(pdf);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No file selected'),
        ),
      );
    }
  }

  void openpdf3(int valu) {
    if (valu != null) {
      launchUrlString(
          '$url/${databef!['national_id']}/${datagetd!["acceptance_letter${valu}"]}');
      print(datagetd!["acceptance_letter${valu}"]);
      // print(pdf);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No file selected'),
        ),
      );
    }
  }

//     void download(String filepath3)async {

//      if (filepath3 != null)
//         final taskId = await FlutterDownloader.enqueue(
//   url:'$url/${databef!['national_id']}/$filepath3',
//   savedDir: 'the path of directory where you want to save downloaded files',
//   showNotification: true, // show download progress in status bar (for Android)
//   openFileFromNotification: true,
// );

//        else {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(
//           content: Text('No file selected'),
//         ),
//       );
//     }
//   }
}
