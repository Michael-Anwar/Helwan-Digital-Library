import 'package:flutter/material.dart';

class SlidePageRoute extends PageRouteBuilder {
  final Widget page;
  final Duration animationDuration;
  final bool slideFromTop;

  SlidePageRoute({
    required this.page,
    required this.animationDuration,
    this.slideFromTop = true,
  }) : super(
          pageBuilder: (
            BuildContext context,
            Animation<double> animation,
            Animation<double> secondaryAnimation,
          ) {
            return page;
          },
          transitionDuration: animationDuration,
          transitionsBuilder: (
            BuildContext context,
            Animation<double> animation,
            Animation<double> secondaryAnimation,
            Widget child,
          ) {
            Offset beginOffset;
            Offset endOffset;

            if (slideFromTop) {
              beginOffset = Offset(0.0, -1.0);
              endOffset = Offset.zero;
            } else {
              beginOffset = Offset(0.0, 1.0);
              endOffset = Offset.zero;
            }

            final curve = CurvedAnimation(
              parent: animation,
              curve: Interval(0.0, 1.0, curve: Curves.easeInOut),
            );

            return SlideTransition(
              position: Tween<Offset>(
                begin: beginOffset,
                end: endOffset,
              ).animate(curve),
              child: child,
            );
          },
        );
}
