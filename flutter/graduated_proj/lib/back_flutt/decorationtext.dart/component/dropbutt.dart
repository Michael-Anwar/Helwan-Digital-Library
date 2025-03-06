import 'package:flutter/material.dart';

class CustomDropdown extends StatefulWidget {
  final String? selectedValue;
  final ValueChanged<String?> onChanged; // Adjust the type to accept nullable string

  CustomDropdown({
    required this.selectedValue,
    required this.onChanged,
  });

  @override
  _CustomDropdownState createState() => _CustomDropdownState();
}

class _CustomDropdownState extends State<CustomDropdown> {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(top: 10),
      decoration: BoxDecoration(
        color: Color.fromARGB(255, 255, 255, 255),
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: DropdownButtonFormField<String>(
        decoration: InputDecoration(
          filled: true,
          fillColor: Colors.transparent,
        ),
        isExpanded: true,
        icon: Icon(Icons.arrow_drop_down, color: Colors.black),
        iconSize: 20,
        elevation: 8,
        style: TextStyle(color: Colors.black, fontSize: 17),
        dropdownColor: Color.fromARGB(255, 255, 255, 255),
        value: widget.selectedValue,
        onChanged: widget.onChanged,
        items: [
          'ماجستير',
          'دكتوراه',
        ].map<DropdownMenuItem<String>>((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Align(
              alignment: Alignment.centerRight,
              child: Text(value),
            ),
          );
        }).toList(),
        hint: Text(
          'المرحلة العلمية',
          style: TextStyle(
            fontSize: 17,
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}