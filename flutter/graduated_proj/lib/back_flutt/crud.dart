import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart' show MediaType;
import 'package:path/path.dart';

 String? tokenn ;

class crud {

  getreq(String url ) async {
    try {
      var response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        var resbody = jsonDecode(response.body);
        return resbody;
      } else {
        print("error ${response.statusCode}");
      }
    } catch (e) {
      print("error catch $e");
    }
  }

  postreq(String url, Map data) async {
    try {
      var response = await http.post(Uri.parse(url), body: data);
      var resbody = jsonDecode(response.body);
      return resbody;
    } catch (e) {
      print("error catch $e");
    }
  }

  putreq(String url, Map data) async {
    try {
      var response = await http.put(Uri.parse(url), body: data);

      var resbody = jsonDecode(response.body);
      return resbody;
    } catch (e) {
      print("error catch $e");
    }
  }
}

postreqwithfile(String url,String token1 ,  File file) async {
  try {
    var request = await http.MultipartRequest("put", Uri.parse(url));
request.headers['Content-Type']='multipart/form-data';
    request.headers['Authorization'] = 'Bearer ${token1}';

    var length = await file.length();
    var stream = http.ByteStream(file.openRead());

    var multipartfile = http.MultipartFile("file", stream, length,
        filename: basename(file.path));
    request.files.add(multipartfile);
    // data.forEach((key, value) {request.fields[key] = value ;});
    var myreq =await request.send();
    var response = await http.Response.fromStream(myreq);
    print(response.body);
      return jsonDecode(response.body);

    
  } catch (e) {
    print("error catch $e");
  }
}

Future<void> uploadImage(File imageFile) async {
    // emit(ProfileImageLoadingState());
    String apiUrl = "http://10.0.2.2:5001/user/updateuser"; // Replace with your API endpoint URL

    var request = http.MultipartRequest('put', Uri.parse(apiUrl));
    request.headers['Content-Type'] = 'multipart/form-data';

    var imageStream = http.ByteStream(imageFile.openRead());
    var imageLength = await imageFile.length();

    var multipartFile = http.MultipartFile(
      'files',
      imageStream,
      imageLength,
      filename: imageFile.path.split("/").last,
      contentType: MediaType('image', 'jpeg'), // Set the correct content type
    );

    request.files.add(multipartFile);

    try {
      var response = await request.send();
      response.stream.transform(utf8.decoder).listen((value) {
        print(value);
        // getClientData(id: userId);
        // emit(ProfileImageSuccessState());
      });
    } catch (error) {
      print('Error uploading image: $error');
      // emit(ProfileImageErrorState());
    }
  }