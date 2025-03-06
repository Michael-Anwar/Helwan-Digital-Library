import 'package:flutter/material.dart';
import 'package:graduated_proj/back_flutt/crud.dart';
import 'package:graduated_proj/back_flutt/link.dart';
import 'package:graduated_proj/files_viewer/errormess.dart';
import 'package:graduated_proj/pages/instructions.dart';

class services extends StatefulWidget {
  const services({Key? key});

  @override
  State<services> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<services> with SingleTickerProviderStateMixin {
  crud _crud = crud();
  List<Map<String, dynamic>> service = [];
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 700),
      vsync: this,
    );

    fetchData().then((data) {
      setState(() {
        service = data;
      });
      _animateServiceContainers();
    });
  }

  void _animateServiceContainers() {
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future fetchData() async {
    try {
      final response = await _crud.getreq(linksservices);

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

  String getTranslatedServiceName(dynamic service) {
    return service['service_name_ar'];
  }

  String getTranslatedServicePref(dynamic service) {
    return service['pref_ar'];
  }

  int getTranslatedServiceid(dynamic service) {
    return service['id'];
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
                                " الخدمات التى تقدمها المكتبة ",
                      textAlign: TextAlign.end,
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                )),
              ],
            ),
        backgroundColor: const Color.fromARGB(255, 16, 54, 92),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              color: Color.fromARGB(255, 201, 199, 199),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 15, 16, 10),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      "الخدمات التي تقدمها المكتبة الرقمية",
                      style: TextStyle(
                        fontSize: 26,
                        color: Color.fromARGB(255, 16, 54, 92),
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.right,
                    ),
                  ],
                ),
              ),
            ),
            Container(
              width: double.infinity,
              color: const Color.fromARGB(255, 255, 255, 255),
              child: Padding(
                padding: const EdgeInsets.all(6),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Column(
                      children: [
                        Text(
                          "تقدم المكتبة الرقمية خدمات معلوماتية متميزة بإستخدام تكنولوجيا المعلومات لدعم مجتمع البحث العلمي بما يتناسب مع متطلبات البيئة الرقمية وتحقيق الوصول الأمثل لمصادر المعلومات محليا ودوليا . هذا بالإضافة إلي التطوير الدائم لكافة الخدمات المتاحة والمسندة إليها وذلك تنفيذا لسياسة الجامعة التي تهدف لدعم قطاع التعليم العالي والبحث العلمي بما يتناسب مع متطلبات البيئة الرقمية وفي ضوء خطة التنمية المستدامة 2030",
                          style: TextStyle(
                            fontSize: 18,
                            color: Color.fromARGB(255, 16, 54, 92),
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.right,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            ListView.builder(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              itemCount: service.length > 8 ? 8 : service.length,
              itemBuilder: (BuildContext context, int index) {
                return AnimatedBuilder(
                  animation: _animationController,
                  builder: (context, child) {
                    return Transform.scale(
                      scale: _animationController.value,
                      child: child,
                    );
                  },
                  child: Container(
                    child: _buildServiceContainer(service[index]),
                    margin: EdgeInsets.all(7),
                    padding: EdgeInsets.all(7),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceContainer(Map<String, dynamic> service) {
    return Padding(
      padding: const EdgeInsets.all(15.0),
      child: Container(
        // padding: EdgeInsets.all(20),
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(25),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.7),
              spreadRadius: 5,
              blurRadius: 7,
              offset: Offset(7, 14),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(15.0),
          child: Column(
            children: [
              Text(
                getTranslatedServiceName(service),
                style: TextStyle(
                  fontSize: 26,
                  color: Color.fromARGB(210, 0, 0, 0),
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 15),
              Container(
                height: 1,
                width: double.infinity,
                color: Colors.black,
              ),
              SizedBox(height: 15),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Expanded(
                    child: Text(
                      getTranslatedServicePref(service),
                      style: TextStyle(
                        fontSize: 20,
                        color: Color.fromARGB(255, 0, 0, 0),
                        // fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.right,
                    ),
                  ),
                  SizedBox(width: 15),
                  Icon(
                    Icons.check_circle_outline, // Your desired icon
                    color: Color(0xFFAD8700),
                  ),
                ],
              ),
              SizedBox(height: 15),
              ElevatedButton(
                onPressed: () {
                  if (service['enabled'] == 1) {
                    int id = getTranslatedServiceid(service);
            
                    Navigator.push(
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
                          return instructions(
                            value: id,
                          );
                        },
                      ),
                    );
                  } else {
                    String error = " عفوا الخدمات متوقفه أيام الجمعة والسبت والأجازات الرسمية";
                    ErrorDialog.showErrorDialog(context, error);
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFFAD8700),
                  minimumSize: Size(100, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                  elevation: 15,
                ),
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(width: 5),
                      Text(
                        'مزيد من التفاصيل',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
              // Add the rest of your service container content here
            ],
          ),
        ),
      ),
    );
  }
}
