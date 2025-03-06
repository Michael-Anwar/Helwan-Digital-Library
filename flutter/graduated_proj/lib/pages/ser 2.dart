import 'package:flutter/material.dart';
import 'package:graduated_proj/servicesUpload/Ahsan_Risalat_Eilmia.dart';
import 'package:graduated_proj/servicesUpload/Almajalaat_Aleilmia.dart';
import 'package:graduated_proj/servicesUpload/Altarqia.dart';
import 'package:graduated_proj/servicesUpload/Fahs_Sha5sy.dart';
import 'package:graduated_proj/servicesUpload/Tahkeel.dart';
import 'package:graduated_proj/servicesUpload/Tasgeel.dart';
import 'package:graduated_proj/servicesUpload/Taslem.dart';
import 'package:graduated_proj/servicesUpload/bank_Almaerifa.dart';



class ser2 extends StatefulWidget {
    final int? value;
        final Map<String, dynamic> ? servv;


  const ser2({super.key,  this.value,  this.servv});

  @override
  State<ser2> createState() => _serState();
}

class _serState extends State<ser2> {
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
        return TasgeelService(serr:widget.servv);
      case 2:
        return TashkeelService( serr:widget.servv);
      case 3:
        return Fahs_Sha5syService(serr:widget.servv);
      case 4:
        return Almajalaat_Aleilmia(serr:widget.servv);
      case 5:
        return AltarqiaService(serr:widget.servv);
      case 6:
        return Ahsan_Risalat_Eilmia(serr:widget.servv);
      case 7:
        return Taslem(serr:widget.servv);
      case 8:
        return bank_Almaerifa(serr:widget.servv);
      default:
        return Text('Wrong');
    }
}
}