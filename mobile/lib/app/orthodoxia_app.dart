import 'package:flutter/material.dart';

import '../features/auth/data/auth_repository.dart';
import '../features/auth/presentation/auth_gate.dart';
import 'app_theme.dart';

class OrthodoxiaApp extends StatelessWidget {
  const OrthodoxiaApp({required this.authRepository, super.key});

  final AuthRepository authRepository;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Orthodoxia',
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      home: AuthGate(authRepository: authRepository),
    );
  }
}
