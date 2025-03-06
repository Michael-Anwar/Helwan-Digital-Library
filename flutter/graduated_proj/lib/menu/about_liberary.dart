import 'package:flutter/material.dart';
import 'package:graduated_proj/menu/navbar.dart';
import 'package:visibility_detector/visibility_detector.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      localizationsDelegates: [
        // GlobalMaterialLocalizations.delegate,
        // GlobalWidgetsLocalizations.delegate,
        // GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: [
        Locale('en', ''),
        Locale('ar', ''),
        Locale('ar', 'SA'),
      ],
      locale: const Locale.fromSubtags(languageCode: 'ar'),
      home: Aboutliberary(),
    );
  }
}

class Aboutliberary extends StatefulWidget {
  const Aboutliberary({Key? key}) : super(key: key);

  @override
  _AboutliberaryState createState() => _AboutliberaryState();
}

class _AboutliberaryState extends State<Aboutliberary> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  bool _firstItemVisible = false;
  bool _animationStarted = false;
  bool _isPageLoaded = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 700),
      vsync: this,
    );
    WidgetsBinding.instance!.addPostFrameCallback((_) {
      setState(() {
        _isPageLoaded = true;
      });
      _animateVisibleContainers();
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _animateVisibleContainers() {
    // Apply animation effect to all containers here
    _animationController.forward();
    setState(() {
      _firstItemVisible = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: Navbar(),
        drawer: NavbarDrawer(),
        body: Container(
          color: Color.fromARGB(255, 245, 254, 255),
          child: SingleChildScrollView(
            child: Column(
              children: [
                Container(
                  width: double.infinity,
                  color: Color.fromARGB(255, 245, 254, 255),
                  child: Padding(
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        SizedBox(height: 15),
                        Text(
                          "عن المكتبة الرقمية",
                          style: TextStyle(
                            fontSize: 30,
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                            shadows: [
                              Shadow(
                                color: Colors.grey,
                                offset: Offset(2, 2),
                                blurRadius: 4,
                              ),
                            ],
                          ),
                          textAlign: TextAlign.right,
                        )
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(5),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        "دعم الرقمنة والبحث العلمي وتقديم خدمات معلوماتية موثقة لمجتمع الباحثين",
                        style: TextStyle(
                          fontSize: 20,
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.right,
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 20),
                VisibilityDetector(
                  key: Key('animated_container'),
                  onVisibilityChanged: (visibilityInfo) {
                    if (visibilityInfo.visibleFraction > 0.5 && !_firstItemVisible) {
                      _animationController.forward();
                      setState(() {
                        _firstItemVisible = true;
                      });
                    }
                  },
                  child: AnimatedSwitcher(
                    duration: Duration(milliseconds: 500),
                    transitionBuilder: (Widget child, Animation<double> animation) {
                      return ScaleTransition(
                        scale: animation,
                        child: child,
                      );
                    },
                    child: _firstItemVisible
                        ? _buildCustomContainer(
                            context,
                            """
١. مشاركة المصادر الرقمية واتاحتها
٢. رقمنة المصادر الورقية التي تنتجها الجامعة  
٣. مساندة منظومة التعليم والبحث بالجامعة
٤. الارتقاء بمستوى البحث العلمي بالجامعة
٥. تعزيز النزاهة الأكاديمية وتجنب الانتحال
٦. بناء بيئة رقمية تواكب التطورات التقنية
٧. تعزيز الوعي المعلوماتي والوصول الحر
٨. نشر ثقافة الاستدامة وربطها بالبحث
٩. تنفيذ قرارات المجلس الأعلى المتعلقة بالمكتبات الرقمية
""",
                            'اهدافنا',
                            26,
                            Color(0xFFAD8700),
                          )
                        : SizedBox.shrink(),
                  ),
                ),
                SizedBox(height: 40),
                _buildCustomContainer(
                  context,
                  """
تتفق الرؤية مع الهدف حيث تسعي المكتبة الرقمية إلي 
١.تقديم خدمات معلوماتية متميزة لتلبية احتياجات المستفيدين وتوقعاتهم .
٢. توفير سبل الوصول لمصادر المعلومات الرقمية العالمية التى تصدر عن أبرز الناشرين فى العالم.
٣. تقديم خدمات معلوماتية متميزة بإستخدام تكنولوجيا المعلومات لتحقيق الوصول الأمثل لمصادر المعلومات محليا ودوليا .
٤. التطوير الدائم لكافة الخدمات المتاحة. نظرًا للخبرة والمعرفة، فقد أُسندت إلى فريق العمل بالمكتبة الرقمية مهام أخرى لخدمة أعضاء هيئة التدريس وطلبة الدراسات العليا المصريين والوافدين. ذلك تنفيذًا لسياسة الجامعة التي تهدف لدعم قطاع التعليم العالي والبحث العلمي بما يتناسب مع متطلبات البيئة الرقمية وفي ضوء خطة التنمية المستدامة ٢٠٣٠. كما تسعى الجامعة أيضًا لرفع إمكانياتها التنافسية بين الجامعات العربية والعالمية من خلال العديد من محاور العمل المحتلفة.
""",
                  'رؤيتنا',
                  26,
                  Color(0xFFAD8700),
                ),
                SizedBox(height: 40),
                _buildCustomContainer(
                  context,
                  """
نشأت المكتبة الرقمية كأحد المشاريع المرتبطة بالمجلس الأعلي للجامعات في جامعة حلوان عام 2007 ثم أصبحت أحد الوحدات ذات الطابع الخاص بالجامعة عام 2022 . وهي تهدف إلي رفع درجة الاستفادة من تكنولوجيا المعلومات بالجامعة وتقديم الدعم المعرفي لكافة اطراف المجتمع الأكاديمي بجامعة حلوان وخارجها مع العمل المستمر لتوفير أفضل الخدمات . فقد كانت تهدف في الأساس إلى توفير مصادر المعلومات الرقمية العالمية التى تصدر عن أبرز الناشرين فى العالم، و ذلك لسد الفجوة التى كانت تعانى منها المكتبات الجامعية من أجل توفير تلك المصادر، و نظرا للخبرة و المعرفة فقد أُسند إليها مهام أخرى لخدمة أعضاء هيئة التدريس وطلبة الدراسات العليا.
""",
                  'من نحن',
                  26,
                  Color(0xFFAD8700),
                ),
                SizedBox(height: 50),
                Column(
                  children: [
                    SizedBox(height: 20),
                    Container(
                      padding: EdgeInsets.all(10),
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
                                  "هل لديك استفسار او شكوي او اقتراح؟",
                                  style: TextStyle(
                                    fontSize: 21,
                                    color: Colors.black,
                                    fontWeight: FontWeight.w900,
                                  ),
                                  textAlign: TextAlign.right,
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 20),
                          Container(
                            height: 1,
                            width: double.infinity,
                            color: Colors.black,
                          ),
                          SizedBox(height: 10),
                          Text(
                            """
في حال اذا ما كان لديك استفسار او شكوي او حتي اقتراح لتحسين العمل في وحدة المكتبة الرقمية. وذلك بهدف تحسين العمل في الوحدة وتطوير الاداء وتقويمه وذلك للوصول الي مستوي خدمة نموذجي ومتميز
""",
                            style: TextStyle(
                              fontSize: 17,
                              color: Colors.black,
                              fontWeight: FontWeight.bold,
                            ),
                            textAlign: TextAlign.right,
                          ),
                          SizedBox(height: 2),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Image.asset(
                                'assets/images/qrcode.png',
                                width: 80,
                                height: 100,
                              ),
                              SizedBox(width: 100),
                              ElevatedButton(
                                onPressed: () {
                                  // الإجراء الذي يتم تنفيذه عند الضغط على الزرار
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Color.fromARGB(255, 16, 54, 92),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(25),
                                  ),
                                ),
                                child: Text(
                                  "اضغط هنا",
                                  style: TextStyle(
                                    fontSize: 17,
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
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCustomContainer(
    BuildContext context,
    String text,
    String name,
    double fontSize,
    Color textColor,
  ) {
    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        return Transform.scale(
          scale: _animationController.value,
          child: Container(
            padding: EdgeInsets.all(10),
            width: 350,
            decoration: BoxDecoration(
              color: Colors.white,
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Expanded(
                      child: Text(
                        name,
                        style: TextStyle(
                          fontSize: fontSize,
                          color: textColor,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.right,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 5),
                Container(
                  height: 1,
                  width: double.infinity,
                  color: Colors.black,
                ),
                SizedBox(height: 10),
                Text(
                  text,
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.right,
                ),
                SizedBox(height: 5),
              ],
            ),
          ),
        );
      },
    );
  }
}
