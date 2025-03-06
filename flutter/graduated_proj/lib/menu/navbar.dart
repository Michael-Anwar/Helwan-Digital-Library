// ignore_for_file: prefer_const_constructors

import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import "package:graduated_proj/back_flutt/crud.dart";
import 'package:graduated_proj/back_flutt/link.dart';
import 'package:graduated_proj/main.dart';
import 'package:graduated_proj/menu/about_liberary.dart';
import 'package:graduated_proj/menu/contact.dart';
import 'package:graduated_proj/menu/myser.dart';
import 'package:graduated_proj/pages/login.dart';
import 'package:graduated_proj/pages/services.dart';
import 'package:graduated_proj/pages/signup.dart';
import 'package:graduated_proj/pages/userprofile.dart';
import 'package:graduated_proj/pages/welcome.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
// import 'package:shared_preferences/shared_preferences.dart';

class Navbar extends StatelessWidget implements PreferredSizeWidget {
  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      
      leading: IconButton(
        icon: Icon(
          Icons.arrow_back,
          size: 30,
        ),
        onPressed: () {
          Navigator.pop(context);
        },
      ),
      titleSpacing: 0,
      title: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
      
        ],
      ),
      backgroundColor: Color.fromARGB(255, 16, 54, 92),
    );
  }
}

class NavbarDrawer extends StatefulWidget {
  @override
  _NavbarDrawerState createState() => _NavbarDrawerState();
}

class _NavbarDrawerState extends State<NavbarDrawer> {
  File? _pickedImage;
  crud _crud = crud();
  String? _img = "";
  String? _nat_id = "";
  String? url = "http://10.0.2.2:5001";
  String? _token = "";


  void initState() {
    super.initState();

    initializeData();
    _loadSetLoggedState();
  }

  Future<void> initializeData() async {

     await   getdata();
    

    await get2();

    
    // get2();
  }
Future<void> get2() async {
    try {
      Uri url = Uri.parse('http://10.0.2.2:5001/user/getuser');
            print('Token: $_token'); // Debug print to check the token

      final response = await http.get(url, headers: {
        
        'Authorization': 'Bearer $_token',
        'withCredentials': 'true'
      });
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(response.body);
        print(responseData); // Log the response data
        setState(() {
          _img = responseData['img'];
         
          _nat_id = responseData['national_id'].toString();
          

    

        });
      } else {
        print(json.decode(response.body));
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
    });
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
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
            decoration: BoxDecoration(
              color:Color.fromARGB(255, 16, 54, 92),
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // if (setlogged == true)
                  Container(
                    child: Column(
                      children: [
                        GestureDetector(
                          child: CircleAvatar(
                            backgroundImage: setlogged
                                ? (_img == "" || _img == null
                                    ? AssetImage('assets/images/Ellipse 1.png')
                                        as ImageProvider
                                    : NetworkImage('$url/$_nat_id/$_img')
                                        as ImageProvider)
                                : AssetImage('assets/images/librarylog.jpg')
                                    as ImageProvider,
                            radius: 35,
                          ),
                        ),
                        SizedBox(height: 10),
                        Container(
                          child: setlogged
                              ? ElevatedButton(
  onPressed: () {
    Navigator.push(
      context,
      PageRouteBuilder(
        transitionDuration: Duration(milliseconds: 500),
        transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
          return ScaleTransition(
            scale: animation,
            child: child,
          );
        },
        pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
          return UserProfile();
        },
      ),
    );
  },
  style: ElevatedButton.styleFrom(
    backgroundColor: Color(0xFFAD8700),
    minimumSize: Size(300, 0),
  ),
  child: Container(
    child: Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'الملف الشخصي',
          style: TextStyle(
            fontSize: 16,
            color: Colors.white,
          ),
        ),
      ],
    ),
  ),
)

                              : Text(
                                  'المكتبة الرقمية بجامعة حلوان',
                                  style: TextStyle(
                                    shadows: [
                                      Shadow(
                                        offset: Offset(10.0, 10.0),
                                        blurRadius: 3.0,
                                        color: Color.fromARGB(255, 0, 0, 0),
                                      ),
                                      Shadow(
                                        offset: Offset(10.0, 10.0),
                                        blurRadius: 8.0,
                                        color: Color.fromARGB(125, 0, 0, 255),
                                      ),
                                    ],
                                    fontSize: 19,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                        ),
                      ],
                    ), // صورة الملف الشخصي
//
                  )
                ],
              ),
            ),
          ),
            ListTile(
            title: Text(
              'الرئيسية',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color.fromARGB(255, 16, 54, 92),
              ),
              textAlign: TextAlign.right,
            ),
            onTap: () {
               Navigator.pop(context);
  // Navigator.push(
  //   context,
  //   PageRouteBuilder(
  //     transitionDuration: Duration(milliseconds: 500),
  //     transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
  //       return ScaleTransition(
  //         scale: animation,
  //         child: child,
  //       );
  //     },
  //     pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
  //       return Welcome(); // أو الصفحة التي تريدها هنا
  //     },
  //   ),
  // );
},


          ),
          
       
            ListTile(
            title: Text(
              'عن المكتبة',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color.fromARGB(255, 16, 54, 92),
              ),
              textAlign: TextAlign.right,
            ),
            onTap: () {
  Navigator.push(
    context,
    PageRouteBuilder(
      transitionDuration: Duration(milliseconds: 700),
      transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
        return ScaleTransition(
          scale: animation,
          child: child,
        );
      },
      pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
        return Aboutliberary(); // أو الصفحة التي تريدها هنا
      },
    ),
  );
},

          ),
                    ListTile(
            title: Text(
              'الخدمات',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color.fromARGB(255, 16, 54, 92),
              ),
              textAlign: TextAlign.right,
            ),
            onTap: () {
  Navigator.push(
    context,
    PageRouteBuilder(
      transitionDuration: Duration(milliseconds: 500),
      transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
        return ScaleTransition(
          scale: animation,
          child: child,
        );
      },
      pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
        return services(); // أو الصفحة التي تريدها هنا
      },
    ),
  );
},

          ),
        if (setlogged == true)
        
  Container(
    child: Column(children: [
           ListTile(
            title: Text(
              'تواصل معنا',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color.fromARGB(255, 16, 54, 92),
              ),
              textAlign: TextAlign.right,
            ),
          onTap: () {
  Navigator.push(
    context,
    PageRouteBuilder(
      transitionDuration: Duration(milliseconds: 500),
      transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
        return ScaleTransition(
          scale: animation,
          child: child,
        );
      },
      pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
        return ContactPage(); // أو الصفحة التي تريدها هنا
      },
    ),
  );
},

          ),
      ListTile(
        title: Text(
          'حالة الخدمات',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color.fromARGB(255, 16, 54, 92),
          ),
          textAlign: TextAlign.right,
        ),
        onTap: () {
          Navigator.push(
            context,
            PageRouteBuilder(
              transitionDuration: Duration(milliseconds: 500),
              transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
                return ScaleTransition(
                  scale: animation,
                  child: child,
                );
              },
              pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
                return myser();
              },
            ),
          );
        },
      ),
    ]),
  ),

          if (setlogged == false)
  Container(
    child: Column(
      children: [
        ListTile(
          title: Text(
            'تسجيل دخول',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color.fromARGB(255, 16, 54, 92),
            ),
            textAlign: TextAlign.right,
          ),
          onTap: () {
            // Navigator.pop(context);
            Navigator.push(
              context,
              PageRouteBuilder(
                transitionDuration: Duration(milliseconds: 500),
                transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
                  return ScaleTransition(
                    scale: animation,
                    child: child,
                  );
                },
                pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
                  return Login();
                },
              ),
            );
          },
        ),
      ],
    ),
  ),

        if (setlogged == false)
  Container(
    child: Column(
      children: [
        ListTile(
          title: Text(
            'انشاء حساب',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color.fromARGB(255, 16, 54, 92),
            ),
            textAlign: TextAlign.right,
          ),
          onTap: () {
            Navigator.pop(context);
            Navigator.push(
              context,
              PageRouteBuilder(
                transitionDuration: Duration(milliseconds: 500),
                transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
                  return ScaleTransition(
                    scale: animation,
                    child: child,
                  );
                },
                pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
                  return SignUp();
                },
              ),
            );
          },
        ),
      ],
    ),
  ),

        if (setlogged == true)
  Container(
    child: Column(
      children: [
        ListTile(
          title: Text(
            'تسجيل خروج',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color.fromARGB(255, 16, 54, 92),
            ),
            textAlign: TextAlign.right,
          ),
          onTap: () async {
            setlogged = false;
            sharedpref.clear();
            await _crud.getreq(linkslogout);
            Navigator.pushAndRemoveUntil(
              context,
              PageRouteBuilder(
                transitionDuration: Duration(milliseconds: 500),
                transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
                  return ScaleTransition(
                    scale: animation,
                    child: child,
                  );
                },
                pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
                  return Welcome();
                },
              ),
              (route) => false,
            );
          },
        ),
      ],
    ),
  ),

        ],
      ),
    );
  }
}
