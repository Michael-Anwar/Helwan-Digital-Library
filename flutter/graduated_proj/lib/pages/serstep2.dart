import 'package:flutter/material.dart';
import 'package:graduated_proj/servicesUpload/Fahs_Sha5sy.dart';
import 'package:graduated_proj/servicesstep2/Ahsan_Risalat_Eilmia2.dart';
import 'package:graduated_proj/servicesstep2/Almajalaat_Eilmia2.dart';
import 'package:graduated_proj/servicesstep2/Fahs_sha5sy2.dart';
import 'package:graduated_proj/servicesstep2/Tasgeel2.dart';
import 'package:graduated_proj/servicesstep2/Tashkeel2.dart';
import 'package:graduated_proj/servicesstep2/tarq2.dart';



class serstep2 extends StatefulWidget {
    final int? value;
        final Map<String, dynamic> ? servv;


  const serstep2({super.key,  this.value,  this.servv});

  @override
  State<serstep2> createState() => _serState();
}

class _serState extends State<serstep2> {
  @override
  Widget build(BuildContext context) {
        var valuee = widget.value  ;

    return Scaffold(
         backgroundColor: Colors.white,
      body: _buildServiceWidget(valuee),);

      
  }
   Widget _buildServiceWidget(int? id) {
    switch (id) {
      case 1:
        return Tasgeel2(serr:widget.servv);
      case 2:
        return Tashkeel2( serr:widget.servv);
      case 3:
        return Fahs_sha5sy2(serr:widget.servv);
      case 4:
        return Almajalaat_Eilmia2(serr:widget.servv);
      case 5:
        return tarq2(serr:widget.servv);
      case 6:
        return Ahsan_Risalat_Eilmia2(serr:widget.servv);
      // case 7:
      //   return Taslem(serr:widget.servv);
      // case 8:
      //   return bank_Almaerifa(serr:widget.servv);
      default:
        return Text('Wrong');
    }
}
}