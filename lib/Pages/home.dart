import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final String _githubUrl = "https://github.com/arindam-karmakar/insure-bot";

  _launchGitHub() async {
    if (!await launch(_githubUrl)) throw 'Could not launch $_githubUrl';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.tealAccent.shade400,
        title: const Text("InsureBot"),
        titleTextStyle: TextStyle(
          color: Colors.teal.shade900,
          fontSize: 16.0,
          fontWeight: FontWeight.bold,
        ),
        actions: [
          IconButton(
            onPressed: () => _launchGitHub(),
            icon: const ImageIcon(AssetImage('assets/icons/github.png')),
            color: Colors.teal.shade900,
          ),
          IconButton(
            onPressed: () => _launchGitHub(),
            icon: const Icon(Icons.info_rounded),
            color: Colors.teal.shade900,
          ),
        ],
      ),
      bottomNavigationBar: Container(
        width: double.maxFinite,
        height: 60.0,
        color: Colors.tealAccent.shade400,
        child: Row(
          children: [
            Expanded(
              flex: 6,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.teal.shade50,
                  borderRadius: BorderRadius.circular(100.0),
                ),
                margin: const EdgeInsets.symmetric(
                  horizontal: 20.0,
                  vertical: 10.0,
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 20.0,
                  vertical: 5.0,
                ),
                child: TextFormField(
                  decoration: const InputDecoration(
                    focusedBorder: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    errorBorder: InputBorder.none,
                  ),
                ),
              ),
            ),
            Expanded(
              child: Container(),
            ),
            Expanded(
              child: Container(),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        child: Column(),
      ),
    );
  }
}
