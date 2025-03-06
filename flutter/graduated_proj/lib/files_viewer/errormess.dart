import 'package:awesome_dialog/awesome_dialog.dart';
import 'package:flutter/material.dart';

class ErrorDialog {
  static void showErrorDialog(BuildContext context, String errorMessage) {
    AwesomeDialog(
      context: context,
      dialogType: DialogType.warning,
      showCloseIcon: true,
      title: "عذرا",
      desc: errorMessage,
      descTextStyle: TextStyle(fontSize: 20), // تحديد حجم النص هنا
      buttonsTextStyle: TextStyle(color: Colors.transparent), // جعل النص شفافًا
    ).show();
  }
}