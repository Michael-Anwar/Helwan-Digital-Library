// ignore_for_file: unused_import

import 'package:awesome_dialog/awesome_dialog.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:graduated_proj/back_flutt/crud.dart';
import 'package:graduated_proj/back_flutt/link.dart';
import 'package:graduated_proj/menu/navbar.dart';
import 'package:graduated_proj/menu/pageroute.dart';
import 'package:graduated_proj/pages/login.dart';
import 'package:graduated_proj/pages/ser.dart';
import 'package:graduated_proj/pages/welcome.dart';
import 'package:shared_preferences/shared_preferences.dart';

class instructions extends StatefulWidget {
  final int value;

  const instructions({required this.value});

  @override
  _instructionsState createState() => _instructionsState();
}

class _instructionsState extends State<instructions> {
  List<Map<String, dynamic>> instruction = [];
  crud _crud = crud();

  void initState() {
    super.initState();
    fetchinstruction().then((data) {
      setState(() {
        instruction = [data];
        _loadSetLoggedState();

        // print(instruction);
        // print(service);
      });
    });
    ;
  }

  Future<Map<String, dynamic>> fetchinstruction() async {
    try {
      final response = await _crud
          .getreq("http://10.0.2.2:5001/manager/getOneService/${widget.value}");
      print('Server Response: $response'); // Add this line for debugging

      if (response is Map<String, dynamic>) {
        return response;
      } else {
        throw Exception('Invalid data format');
      }
    } catch (error) {
      print('Error fetching data: $error');
      throw Exception('Failed to load data');
    }
  }

  _loadSetLoggedState() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    bool? savedSetLogged = prefs.getBool('setlogged');
    if (savedSetLogged != null) {
      setState(() {
        setlogged = savedSetLogged;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    int value = widget.value;

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
                if (instruction
                    .isNotEmpty) // Check if instruction is not empty before accessing its elements
                  Expanded(
                      child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text(instruction[0]['service_name_ar'],
                        textAlign: TextAlign.start,
                        style: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold)),
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
                                instruction.isNotEmpty
                                    ? instruction[0]['service_name_ar']
                                    : '',
                                textDirection: TextDirection.rtl,
                                style: TextStyle(
                                  fontSize: 20,
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
                              ),
                            ),
                            SizedBox(height: 10),
                            Container(
                              height: 2,
                              width: double.infinity,
                              color: Colors.white,
                            ),
                            SizedBox(height: 16),
                            Align(
                              alignment: Alignment.center,
                              child: Text(
                                "خطوات الخدمه                                                                                                                                                                          ",
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: const Color(0xFFAD8700),
                                ),
                                textAlign: TextAlign.right,
                              ),
                            ),
                            if (widget.value == 1) _padd(context, """
١- ارسال الخطاب الموجه الى مدير المكتبة الرقمية ؛ بطلب استخراج افادة للتسجيل لدرجة الماجستير أو الدكتوراه للتحقق من وجود عنوان الخطة البحثية أو عدمه فى الجامعات المصرية معتمد ومؤرخ بتاريخ حديث من ادارة الدراسات العليا بالكلية المنتسب اليها طالب الدراسات العليا بالجامعة مذكور فيه الآتى : اسم الباحث كامل – الكلية – القسم – عنوان المخطط البحثي كامل باللغة العربية و اللغة الانجليزية – ماجستير أو دكتوراه

٢- اختار المرحله العلميه ( ماجستير - دكتوراه )

*** انتظار كود الدفع الخاص بالخدمه ... بعد وصول كود الدفع ودفع الرسوم يتم استكمال الاجراءات التالية ***

٣- ارسال صوره ايصال الدفع

٤- المخطط البحثي باللغة العربية واللغة الانجليزية ان وجد (كامل من اول الغلاف حتى المصادر والمراجع بملف واحد مجمع فى صيغة Word و PDF ويكون قابل للنسخ وليس صورة)

٥- صورة ورقة الترجمة
""", """
ملحوظة هامة
١- لا يوجد داعي أن يتوجه الباحث لمقر المكتبة الرقمية حيث سيتم ارسال الافادة له على الموقع خلال 3 ايام عمل وطباعتها لتوقيعها وختمها من وكيل الكلية للدراسات العليا بالكلية المنتسب لها .
٢- ولأى استفسارات أخرى يرجى مراسلاتنا عبر لينك الشكاوي في الصفحه الرئيسيه .
""", """
من أماكن الدفع : opey أو سمارت أي مكان غير فوري و مصاري رجاء اختيار الجامعات الحكومية/جامعة حلوان الأهلية عند الدفع (رسوم الدفع : ١- مصري: 150 جنيها مصريا ٢- وافد : ما يعادل 10 دولار)
"""),
                            if (widget.value == 2)
                              _padd(
                                  context,
                                  """١- ارسال الخطاب الموجه الى مدير المكتبة الرقمية ؛ بطلب فحص الرسالة العلمية على برنامج الـiThenticate معتمد ومؤرخ بتاريخ حديث من وكيل الكلية للدراسات العليا والبحوث و المنتسب اليها طالب الدراسات العليا بالجامعة ومختوم (خاتم شعار الجمهورية (ختم النسر)) مذكور فيه الآتى : ١- بيانات الباحث المتقدم : اسم الباحث كامل – الكلية – القسم – البريد الالكترونى الجامعي – رقم الموبايل . ٢- بيانات الرسالة العلمية :( عنوان الرسالة كامل باللغة العربية و اللغة الانجليزية – ماجستير أو دكتوراه ).

٢- اختار المرحله العلميه ( ماجستير - دكتوراه )

*** انتظار كود الدفع الخاص بالخدمه ... بعد وصول كود الدفع ودفع الرسوم يتم استكمال الاجراءات التالية ***

٣- ارسال صوره ايصال الدفع

٤- الرسالة المقدمة للفحص
(كاملة بملف واحد مجمع دون حذف أى اجزاء منها فى صيغة Word و Pdf Text وليست Pdf image) قابلة للنسخ هذا لكل الكليات فيما عدا كليات علوم وصيدلة واقتصاد منزلي (قسم تغذيه) يتم حذف ال methods&materials .

٥- النموذج الخاص بفحص اقتباس الرسائل العلمية لغرض التشكيل
""",
                                  """
ملحوظة هامة
1- لا يوجد داعي أن يتوجه الباحث لمقر المكتبة الرقمية حيث سيتم ارسال الافادة له على الموقع خلال 7 ايام عمل (لا تحسب أيام الجمعة والسبت والاجازات الرسمية) وطباعتها لتوقيعها وختمها من وكيل الكلية للدراسات العليا بالكلية المنتسب لها .
2- ولأى استفسارات أخرى يرجى مراسلاتنا عبر لينك الشكاوي في الصفحه الرئيسيه . """,
                                  """ 
من أماكن الدفع : opey أو سمارت أي مكان غير فوري و مصاري رجاء اختيار الجامعات الحكومية/جامعة حلوان الأهلية عند الدفع  (رسوم الدفع : 1- مصري: 500 جنيها مصريا 2- وافد : ما يعادل 20 دولار بالجنية المصري))  
    """),
                            if (widget.value == 3)
                              _padd(context, """ ١- التسجيل لطلب كود الدفع
*** انتظار كود الدفع الخاص بالخدمه ... بعد وصول كود الدفع ودفع الرسوم يتم استكمال الاجراءات التالية ***

٢- ارسال صوره ايصال الدفع

٣- ارسال الابحاث بصيغة (WORD && PDF)

٤- تاريخ قبول نشر الابحاث او تاريخ النشر إن وجد""", """ 
    
ملحوظة هامة
1- لا يوجد داعي أن يتوجه الباحث لمقر المكتبة الرقمية حيث سيتم ارسال (الافادة / التقرير) له على الموقع خلال 3 ايام عمل .
2- ولأى استفسارات أخرى يرجى مراسلاتنا عبر لينك الشكاوي في الصفحه الرئيسيه .
    """, """ 
من أماكن الدفع : opey أو سمارت أي مكان غير فوري و مصاري رجاء اختيار الجامعات الحكومية/جامعة حلوان الأهلية عند الدفع (رسوم الدفع : 300جنيها مصري للبحث الواحد)  
    """),
                            if (widget.value == 4)
                              _padd(context,
                                  """١- ارسال الخطاب الموجه الى مدير وحدة المكتبة الرقمية ؛ بطلب فحص الابحاث العلمية على برنامج الـ iThenticate معتمد ومؤرخ بتاريخ حديث من وكيل الكلية للدراسات العليا والبحوث المنتسب اليها عضو هيئة التدريس بالجامعة ومختوم (خاتم شعار الجمهورية (ختم النسر))
*** انتظار كود الدفع الخاص بالخدمه ... بعد وصول كود الدفع ودفع الرسوم يتم استكمال الاجراءات التالية ***

٢- ارسال صوره ايصال الدفع
٣- ارسال الابحاث بصيغة (WORD && PDF) 
""", """

ملحوظة هامة
١- لا يوجد داعي أن يتوجه الباحث لمقر المكتبة الرقمية حيث سيتم ارسال (الافادة / التقرير) له على الموقع خلال 5 ايام عمل .
٢- ولأى استفسارات أخرى يرجى مراسلاتنا عبر لينك الشكاوي في الصفحه الرئيسيه .
 """, """ 
    
من أماكن الدفع : opey أو سمارت أي مكان غير فوري و مصاري رجاء اختيار الجامعات الحكومية/جامعة حلوان الأهلية عند الدفع (رسوم الدفع : 300جنيها مصري للبحث الواحد)
    """),
                            if (widget.value == 5)
                              _padd(
                                  context,
                                  """ ١- يتم التسجيل على [موقع المجلس الاعلي للجامعات]   (https://sso.scu.eg)

٢- يرفع المتقدم على الموقع : خطاب العميد بطلب الفحص (المعتمد والمؤرخ بتاريخ حديث) + قائمة الابحاث المعتمدة والمؤرخة بتاريخ حديث + خطابات قبول النشر فى حالة الابحاث التى لم تنشر بعد + الابحاث بصيغة Text pdf + word ، بحد أقصى 8 أبحاث (يتم ملء بيانات المتقدم للترقيه بشكل صحيح وبدقة ) .

******** بعد ذلك تعود هنا لرفع المستندات المطلوبة للخدمة وهى : ********

٣- ارسال الخطاب الموجه الى مدير وحدة المكتبة الرقمية ؛ بطلب فحص الابحاث العلمية على برنامج الـ iThenticate معتمد ومؤرخ بتاريخ حديث من وكيل الكلية للدراسات العليا والبحوث المنتسب اليها عضو هيئة التدريس بالجامعة ومختوم (خاتم شعار الجمهورية (ختم النسر))
٤- ادخل عدد الابحاث
*** انتظار كود الدفع الخاص بالخدمه والذى سيتم ارساله بعد وصول اسم سيادتكم لنا من موقع المجلس الاعلي للجامعات ... بعد وصول كود الدفع ودفع الرسوم يتم استكمال الاجراءات التالية ***

٥- ارسال صوره ايصال الدفع

٦- قائمة الابحاث المعتمدة والمؤرخة بتاريخ حديث

٧- خطابات قبول النشر فى حالة الابحاث التى لم تنشر بعد

٨- الابحاث بصيغة (PDF TEXT & WORD)، بحد أقصى 8 أبحاث""",
                                  """ 
    
ملحوظة هامة
1- لا يوجد داعي أن يتوجه الباحث لمقر المكتبة الرقمية حيث سيتم ارسال (الافادة / التقرير) له على الموقع خلال 15 الي 20 يوم عمل .
2- ولأى استفسارات أخرى يرجى مراسلاتنا عبر لينك الشكاوي في الصفحه الرئيسيه .
    """,
                                  "من أماكن الدفع : opey أو سمارت أي مكان غير فوري و مصاري رجاء اختيار الجامعات الحكومية/جامعة حلوان الأهلية عند الدفع (رسوم الدفع : 1- داخل الجامعة :250 جنيها مصريا للبحث الواحد 2-خارج الجامعة :300 جنيها مصريا للبحث الواحد )"),
                            if (widget.value == 6)
                              _padd(
                                context,
                                """ ١- ارسال الخطاب الموجه الى مدير وحدة المكتبة الرقمية ؛ بطلب فحص الابحاث العلمية على برنامج الـ iThenticate معتمد ومختوم ومؤرخ بتاريخ حديث (خاتم شعار الجمهورية (ختم النسر) . مذكور فيه الآتى : اسم المتقدم - عنوان البحث كامل وتاريخ قبول النشر او تاريخ النشر – الكلية – الجامعة – القسم – البريد الالكترونى + رقم التليفون ورقم البطاقة كامل و صورة من جواز السفر (للوافدين فقط)
*** انتظار كود الدفع الخاص بالخدمه ... بعد وصول كود الدفع ودفع الرسوم يتم استكمال الاجراءات التالية ***

٢- ارسال صوره ايصال الدفع
٣- ارسال الابحاث بصيغة (WORD && PDF)""",
                                """

ملحوظة هامة
١- لا يوجد داعي أن يتوجه الباحث لمقر المكتبة الرقمية حيث سيتم ارسال (الافادة / التقرير) له على الموقع خلال 5 ايام عمل .
٢- ولأى استفسارات أخرى يرجى مراسلاتنا عبر لينك الشكاوي في الصفحه الرئيسيه .
 """,
                                """ 
    
من أماكن الدفع : opey أو سمارت أي مكان غير فوري و مصاري رجاء اختيار الجامعات الحكومية/جامعة حلوان الأهلية عند الدفع (رسوم الدفع : 300جنيها مصريا)  
    """,
                              ),
                            if (widget.value == 7)
                              _padd(
                                  context,
                                  """١- اختار المرحله العلميه ( ماجستير - دكتوراه )
٢- قرار لجنة المناقشة والحكم معتمد ومختوم بختم النسر مذكور به عنوان الرسالة وتاريخ مناقشة الرسالة
٣- نسخة الكترونية من الرسالة (كاملة بملف واحد مجمع فى صيغة Word و Pdf Text وليست Pdf image . """,
                                  """ 
    
ملحوظة هامة
١- لا يوجد داعي أن يتوجه الباحث لمقر المكتبة الرقمية حيث سيتم ارسال الافادة له على الموقع خلال 3 ايام عمل وطباعتها والتوجه بها لمقر المكتبة الرقمية لاعتمادها بختم المكتبة الرقمية .
٢- ولأى استفسارات أخرى يرجى مراسلاتنا عبر لينك الشكاوي في الصفحه الرئيسيه .  
    """,
                                  """ 
    """),
                            if (widget.value == 8)
                              _padd(context, """ ١- ادخل الشعبه
٢- ادخل الدرجه العلميه""", """ 
    
ملحوظة هامة
١- لا يوجد داعي أن يتوجه الباحث لمقر المكتبة الرقمية حيث سيتم ارسال كافة التفاصيل على الموقع .
٢- ولأى استفسارات أخرى يرجى مراسلاتنا عبر لينك الشكاوي في الصفحه الرئيسيه .
    """, """ """),
                            ElevatedButton(
                              onPressed: () {
                                if (setlogged == true) {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) =>
                                          ser(value: widget.value),
                                    ),
                                  );
                                } else {
                                  AwesomeDialog(
                                    context: context,
                                    dialogType: DialogType.warning,
                                    showCloseIcon: true,
                                    title: "عذرا",
                                    desc: "يجب عليك تسجيل الدخول اولا",
                                    descTextStyle: TextStyle(fontSize: 20),
                                    btnOkText: "تسجيل دخول",
                                    btnOkOnPress: () {
                                      Navigator.push(
                                        context,
                                        PageRouteBuilder(
                                          transitionDuration:
                                              Duration(milliseconds: 500),
                                          transitionsBuilder:
                                              (BuildContext context,
                                                  Animation<double> animation,
                                                  Animation<double>
                                                      secondaryAnimation,
                                                  Widget child) {
                                            return ScaleTransition(
                                              scale: animation,
                                              child: child,
                                            );
                                          },
                                          pageBuilder: (BuildContext context,
                                              Animation<double> animation,
                                              Animation<double>
                                                  secondaryAnimation) {
                                            return Login();
                                          },
                                        ),
                                      );
                                    },
                                    btnOkColor:
                                        const Color.fromARGB(255, 16, 54, 92),
                                  ).show();
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color(0xFFAD8700),
                                minimumSize: Size(200, 50),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                              child: Text(
                                // Use localized string instead of hardcoded text
                                'سجل الان',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Container(
                      //   width: 350,
                      //   padding: EdgeInsets.all(20),
                      //   decoration: BoxDecoration(
                      //     color: Color(0xFF19355A),
                      //     borderRadius: BorderRadius.circular(10),
                      //   ),
                      //   child: Column(
                      //     children: [
                      //       Center(
                      //         child: Text(
                      //           "لم تقم بطلب اي خدمه بعد",
                      //           style:
                      //               TextStyle(fontSize: 20, color: Colors.white),
                      //         ),
                      //       )
                      //     ],
                      //   ),
                      // ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ));
  }

  Widget _padd(
    BuildContext context,
    String text1,
    String text2,
    String text3,
  ) {
    return Padding(
      padding: const EdgeInsets.only(top: 5, bottom: 5),
      child: Column(
        children: [
          Text(
            text1,
            style: TextStyle(fontSize: 20, color: Colors.white),
            textAlign: TextAlign.right,
          ),

          // SizedBox(height: 4,),
          Align(
            alignment: Alignment.center,
            child: Text(
              text2,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: const Color(0xFFAD8700),
              ),
              textAlign: TextAlign.right,
            ),
          ),
          SizedBox(height: 7),
          Align(
            alignment: Alignment.center,
            child: Text(
              text3,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }
}
  //  child: Column(
  //         children: [
  //           // Your widgets go here
  //           Text(instruction.isNotEmpty ? instruction[0]['service_name'] : ''),
  //           // Other widgets...
  //           ElevatedButton(
  //             onPressed: () {},
  //             child: Text("mom"),
  //           ),
  