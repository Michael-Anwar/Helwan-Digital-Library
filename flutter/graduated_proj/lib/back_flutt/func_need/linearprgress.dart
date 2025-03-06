import 'package:flutter/material.dart';

Widget lin_prog({
  required double progressPercentage,
}) {
  return LinearProgressIndicator(
    value: progressPercentage / 100,
                                  minHeight: 8.0, // Height of the progress bar
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                      Colors.blue), // Color of the progress bar
                                  backgroundColor:
                                      Colors.grey[200], // Background color

                                  borderRadius: BorderRadius.circular(
                                      4.0), // Roun
  );
}
