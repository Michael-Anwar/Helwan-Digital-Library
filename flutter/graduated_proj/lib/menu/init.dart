import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:graduated_proj/pages/welcome.dart';

class initr extends StatefulWidget {
  const initr({super.key});

  @override
  State<initr> createState() => _initrState();
}

class _initrState extends State<initr> with SingleTickerProviderStateMixin {
  @override
  void initState() {
    super.initState();
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersive);
    Future.delayed(Duration(seconds: 1), () {
       Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => Welcome()),
      );
    });
    
  }

  @override
  void dispose() {
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual, overlays: SystemUiOverlay.values);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.white,
        ),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "DIGITAL",
                style: TextStyle(
                  fontSize: 50,
                  fontWeight: FontWeight.w900,
                  color: Colors.amber,
                ),
              ),
              Text(
                "LIBRARY SYSTEM",
                style: TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.w900,
                  color: Color.fromARGB(255, 2, 33, 101),
                ),
              ),
              SizedBox(height: 20),
              Image.asset("assets/images/librarylog.jpg"),
            ],
          ),
        ),
      ),
    );
  }
}
