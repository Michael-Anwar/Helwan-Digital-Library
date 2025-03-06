import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:graduated_proj/back_flutt/crud.dart';
import 'package:graduated_proj/back_flutt/link.dart';
import 'package:graduated_proj/files_viewer/errormess.dart';
import 'package:graduated_proj/menu/navbar.dart';
import 'package:graduated_proj/pages/instructions.dart';
import 'package:graduated_proj/pages/services.dart';
import 'package:url_launcher/url_launcher_string.dart';

// import 'package:flutter_icons/flutter_icons.dart';
// import 'package:flutter_svg/flutter_svg.dart';

class Welcome extends StatefulWidget {
  @override
  _WelcomeState createState() => _WelcomeState();
}

class _WelcomeState extends State<Welcome> with SingleTickerProviderStateMixin {
  crud _crud = crud();
  // List<dynamic> services = [];
  List<Map<String, dynamic>> service = [];
    late AnimationController _animationController;

  String idd = "";

  void initState() {
    super.initState();
     _animationController = AnimationController(
      duration: const Duration(milliseconds: 2500),
      vsync: this,);
    fetchData().then((data) {
      setState(() {
        service = data;
        // print(service);
      });
            _animateServiceContainers();

    });
    ;
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
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          titleSpacing: 0,
          title: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
            ],
          ),
          backgroundColor: Color.fromARGB(255, 16, 54, 92),
        ),
        drawer: NavbarDrawer(),
        body: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                width: double.infinity,
                height: MediaQuery.of(context).size.height,
                child: Stack(
                  children: [
                    Image.asset(
                      "assets/images/WhatsApp Image 2023-08-10 at 01.01.55.jpg",
                      width: double.infinity,
                      height: MediaQuery.of(context).size.height,
                      fit: BoxFit.cover,
                    ),
                    TweenAnimationBuilder(
                      tween: Tween<double>(begin: 0.0, end: 1.0),
                      duration: Duration(seconds: 2),
                      builder:
                          (BuildContext context, double value, Widget? child) {
                        return Container(
                          width: double.infinity,
                          height: MediaQuery.of(context).size.height,
                          color: Colors.black.withOpacity(0.2),
                          child: Align(
                            alignment: AlignmentDirectional.topEnd,
                            child: Padding(
                              padding: const EdgeInsets.fromLTRB(16, 10, 16, 0),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Transform.scale(
                                    scale: value,
                                    child: RichText(
                                      text: TextSpan(
                                        style: TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                        children: [
                                          TextSpan(
                                            text: "جامعة حلوان\n",
                                            style: TextStyle(
                                              fontSize: 30,
                                            ),
                                          ),
                                          TextSpan(
                                            text:
                                                "المكتبة الرقمية", // هنا تكبير "المكتبة الرقمية"
                                            style: TextStyle(
                                              fontSize: 25,
                                            ),
                                          ),
                                          TextSpan(
                                            text: "\n\n"
                                                "المكتبة الرقمية أحد المشاريع المرتبطة بالمجلس الأعلي للجامعات والتي تهدف إلي رفع درجة الاستفادة من تكنولوجيا المعلومات بالجامعة وتقديم الدعم المعرفي لكافة اطراف المجتمع الأكاديمي بجامعة حلوان وخارجها مع العمل المستمر لتوفير أفضل الخدمات.",
                                          ),
                                        ],
                                      ),
                                      textAlign: TextAlign.end,
                                      textScaleFactor: 1.0,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              Container(
                width: double.infinity,
                // color: Color.fromARGB(255, 201, 199, 199),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 10, 16, 10),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        "الخدمات التي تقدمها المكتبة الرقمية",
                        style: TextStyle(
                          fontSize: 27,
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
                  padding: const EdgeInsets.fromLTRB(16, 10, 16, 10),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
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
                ),
              ),
              SizedBox(height: 5),
              ListView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount: service.length > 3 ? 3 : service.length,
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
                      padding: EdgeInsets.all(7), // Add margin for space
                    ),
                  );
                },
              ),
              SizedBox(height: 20),
              Column(
                children: [
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        PageRouteBuilder(
                          transitionDuration: Duration(milliseconds: 500),
                          transitionsBuilder: (BuildContext context,
                              Animation<double> animation,
                              Animation<double> secondaryAnimation,
                              Widget child) {
                            return ScaleTransition(
                              scale: animation,
                              child: child,
                            );
                          },
                          pageBuilder: (BuildContext context,
                              Animation<double> animation,
                              Animation<double> secondaryAnimation) {
                            return services();
                          },
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color.fromARGB(255, 16, 54, 92),
                      minimumSize: Size(350, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                      elevation: 0,
                    ),
                    child: Text(
                      'المزيد من الخدمات',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  SizedBox(height: 20),
                  Container(
                    width: double.infinity,
                    height: 2,
                    color: Colors.black, // لون الخط الأحمر
                  ),
                ],
              ),
              SizedBox(height: 10),
              Container(
                width: double.infinity,
                child: Padding(
                  padding: const EdgeInsets.all(5),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        " مجتمع المستفيدين",
                        style: TextStyle(
                          fontSize: 28,
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
                  padding: const EdgeInsets.all(5),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        "تخدم المكتبة قطاع كبير من المستفيدين كأعضاء هيئة التدريس وطلاب الدراسات العليا وطلاب المرحلة الجامعية الأولى، بالإضافة إلى المؤسسات البحثية والتعليمية الأخرى مثل الجامعات الخاصة والأهلية والمعاهد التعليمية",
                        style: TextStyle(
                          fontSize: 18,
                          color: Color.fromARGB(255, 16, 54, 92),
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.right,
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(
                height: 15,
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Container(
                  child: Row(
                      // mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.all(10.0),
                            child: Column(
                              children: [
                             Container(
                                  width: 60,
                                  height: 60,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: Color.fromARGB(255, 16, 54, 92),
                                  ),
                                  padding: EdgeInsets.all(10),
                                  child: Icon(
                                    FontAwesomeIcons.userGraduate,
                                    size: 30,
                                    color: Colors.white,
                                  ),
                                ),
                                SizedBox(
                                  height: 10,
                                ),
                                Text(
                                  "أعضاء هيئة التدريس",
                                  style: TextStyle(
                                      fontSize: 15,
                                      color: Colors.black,
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          ),
                        ),
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.all(10.0),
                            child: Column(
                              children: [
                                Column(
                                  children: [
                                   Container(
                                  width: 60,
                                  height: 60,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: Color.fromARGB(255, 16, 54, 92),
                                  ),
                                  padding: EdgeInsets.all(10),
                                  child: Icon(
                                    FontAwesomeIcons.school,
                                    size: 30,
                                    color: Colors.white,
                                  ),
                                ),
                                    SizedBox(
                                      height: 10,
                                    ),
                                    Text(
                                      "الجامعات والمعاهد الخاصة والأهلية",
                                      style: TextStyle(
                                          fontSize: 15,
                                          color: Colors.black,
                                          fontWeight: FontWeight.bold),
                                      textAlign: TextAlign.center,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.all(10.0),
                            child: Column(
                              children: [
                              Container(
                                  width: 60,
                                  height: 60,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: Color.fromARGB(255, 16, 54, 92),
                                  ),
                                  padding: EdgeInsets.all(10),
                                  child: Icon(
                                    FontAwesomeIcons.users,
                                    size: 30,
                                    color: Colors.white,
                                  ),
                                ),
                                SizedBox(
                                  height: 10,
                                ),
                                Text(
                                  " طلاب الدراسات العليا والباحثين",
                                  style: TextStyle(
                                      fontSize: 15,
                                      color: Colors.black,
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ]),
                ),
              ),
              SizedBox(
                height: 30,
              ),
              Container(
                padding: EdgeInsets.all(25),
                width: 350,
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 176, 214, 245),
                  borderRadius: BorderRadius.circular(25),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.9),
                      spreadRadius: 5,
                      blurRadius: 7,
                      offset: Offset(7, 14),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "هل لديك استفسار او شكوي او اقتراح ؟",
                            style: TextStyle(
                              fontSize:
                                  20, // تعديل حجم النص بناءً على عرض الكونتينر
                              color: Colors.black,
                              fontWeight: FontWeight.w900,
                            ),
                            textAlign: TextAlign.right,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 10),
                    Container(
                      height: 1,
                      width: double.infinity,
                      color: Colors.black,
                    ),
                    SizedBox(height: 10),
                    Text(
                      "في حال إذا ما كان لديك استفسار أو شكوى أو حتى اقتراح لتحسين العمل في وحدة المكتبة الرقمية، وذلك بهدف تحسين العمل في الوحدة وتطوير الأداء وتقويمه وذلك للوصول إلى مستوى خدمة نموذجي ومتميز.",
                      style: TextStyle(
                        fontSize: 0.048 *
                            350, // تعديل حجم النص بناءً على عرض الكونتينر
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.right,
                    ),
                    SizedBox(height: 2),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Image.asset(
                          'assets/images/qrcode.png', // استبدل بمسار صورتك الفعلي
                          width: 80, // تحديد عرض الصورة
                          height: 100, // تحديد ارتفاع الصورة
                        ),
                        ElevatedButton(
                          onPressed: () async {
                                launchUrlString('https://forms.office.com/r/S3Z2zEANgM');

                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color(0xFF003C70),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(25),
                            ),
                          ),
                          child: Text(
                            "اضغط هنا",
                            style: TextStyle(
                              fontSize: 0.048 *
                                  350, // تعديل حجم النص بناءً على عرض الكونتينر
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
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
                        transitionDuration: Duration(milliseconds: 500),
                        transitionsBuilder: (BuildContext context,
                            Animation<double> animation,
                            Animation<double> secondaryAnimation,
                            Widget child) {
                          return ScaleTransition(
                            scale: animation,
                            child: child,
                          );
                        },
                        pageBuilder: (BuildContext context,
                            Animation<double> animation,
                            Animation<double> secondaryAnimation) {
                          return instructions(value: id);
                        },
                      ),
                    );
                  } else {
                    String error =
                        "عفوًا، الخدمات متوقفة أيام الجمعة والسبت والأجازات الرسمية";
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
              )
            
              // Add the rest of your service container content here
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildIconContainer({
    IconData? icon,
  }) {
    return Column(
      children: [
        Icon(
          icon,
          size: 40,
          color: Color(0xFF19355A),
        ),
        SizedBox(height: 8),
      ],
    );
  }
}
