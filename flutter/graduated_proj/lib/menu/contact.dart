import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:graduated_proj/menu/RecievedMessages.dart';
import 'package:graduated_proj/menu/SendingMessages.dart';

class ContactPage extends StatefulWidget {
  final int? value;

  const ContactPage({super.key, this.value});

  @override
  _ContactPageState createState() => _ContactPageState();
}

class _ContactPageState extends State<ContactPage> {
  String? selectedValue;
  bool isButtonDisabled = false;

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
                                " للتواصل معنا",
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
          body: Center(
            child: Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
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
                          SizedBox(height: 10),
                          SizedBox(height: 16),
                          Image.asset(
                            'assets/images/Email campaign-amico 1.png',
                            width: 900,
                            height: 200,
                            fit: BoxFit.contain,
                          ),
                          SizedBox(height: 24),
                          SizedBox(height: 10),
                          SizedBox(height: 20),
                          ElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => SendingMessages()),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFFAD8700),
                              disabledBackgroundColor: Color(0xFFAD8700),
                              minimumSize: Size(200, 50),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: Text(
                              ' ارسال رسالة',
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          SizedBox(height: 10),
                          SizedBox(height: 20),
                          ElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => RecievedMessages()),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFFAD8700),
                              disabledBackgroundColor: Color(0xFFAD8700),
                              minimumSize: Size(200, 50),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: Text(
                              ' الرسائل المرسلة',
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          SizedBox(height: 50),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ));
  }
}


