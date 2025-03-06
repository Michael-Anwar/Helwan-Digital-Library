import 'package:flutter/material.dart';

class custtextform extends StatelessWidget {
  final String? hint ;
  final String? Function(String?) valid ;
  final TextEditingController mycontroller ;
  final Widget? preicon ;
    final Widget? suficon ;
      final bool obstext;
      final TextInputType? texinp;
      final Function(String)? onChange ;
      final AutovalidateMode? autovalid ;


  const custtextform({super.key, this.hint, required this.mycontroller, required this.valid , this.preicon ,this.texinp , this.suficon
  , this.obstext = false,  this.onChange,  this.autovalid});

  @override
  Widget build(BuildContext context) {
    return Container(
      
      // margin: EdgeInsets.only(bottom: 10),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: TextFormField(
          validator: valid ,
          
          controller: mycontroller,
          onChanged: onChange ,
          obscureText: obstext,
          keyboardType:texinp ,
        autovalidateMode: autovalid,
          
          decoration: InputDecoration(
            prefixIcon: preicon ,
            suffixIcon:suficon ,
            
            // contentPadding: EdgeInsets.symmetric(vertical: 8 ,
            // horizontal: 10),
      
          hintText: hint ,
            border: OutlineInputBorder(
              borderRadius:BorderRadius.circular(10),
              borderSide: BorderSide(color: Colors.black ,
             width: 1
             )
            )
          ),
        ),
      ),
    );
  }
}