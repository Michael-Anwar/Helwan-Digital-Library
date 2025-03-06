import 'package:flutter/material.dart';

Widget custtextform({
  required FormFieldValidator<String>? valid,
  required String hint,
  required TextEditingController mycontroller,
}) {
  return TextFormField(
    controller: mycontroller,
    validator: valid,
    decoration: InputDecoration(
      hintText: hint,
      
    ),
  );
}