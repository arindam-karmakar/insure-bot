import 'package:flutter/material.dart';
import 'package:insure_bot/Pages/home.dart';

void main() {
  runApp(const InsureBot());
}

class InsureBot extends StatefulWidget {
  const InsureBot({Key? key}) : super(key: key);

  @override
  _InsureBotState createState() => _InsureBotState();
}

class _InsureBotState extends State<InsureBot> {
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}
