import 'package:flutter/material.dart';
import 'package:graduated_proj/servicesUpload/Ahsan_Risalat_Eilmia.dart';
import 'package:graduated_proj/servicesUpload/Almajalaat_Aleilmia.dart';
import 'package:graduated_proj/servicesUpload/Altarqia.dart';
import 'package:graduated_proj/servicesUpload/Fahs_Sha5sy.dart';
import 'package:graduated_proj/servicesUpload/Tahkeel.dart';
import 'package:graduated_proj/servicesUpload/Tasgeel.dart';
import 'package:graduated_proj/servicesUpload/Taslem.dart';
import 'package:graduated_proj/servicesUpload/bank_Almaerifa.dart';



class ser extends StatefulWidget {
    final int value;

  const ser({super.key, required this.value});

  @override
  State<ser> createState() => _serState();
}

class _serState extends State<ser> {
  @override
  Widget build(BuildContext context) {
        int value = widget.value;

    return Scaffold(
         backgroundColor: Colors.white,
      body: _buildServiceWidget(widget.value),);

      
  }
   Widget _buildServiceWidget(int id) {
    switch (id) {
      case 1:
        return TasgeelService(value: widget.value);
      case 2:
        return TashkeelService(value: widget.value);
      case 3:
        return Fahs_Sha5syService(value: widget.value);
      case 4:
        return Almajalaat_Aleilmia(value: widget.value);
      case 5:
        return AltarqiaService(value: widget.value);
      case 6:
        return Ahsan_Risalat_Eilmia(value: widget.value);
      case 7:
        return Taslem(value: widget.value);
      case 8:
        return bank_Almaerifa(value: widget.value);
      default:
        return Text('Wrong');
    }
}
}