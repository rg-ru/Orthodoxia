import 'dart:async';

import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../home/presentation/home_screen.dart';
import '../data/auth_repository.dart';
import '../domain/auth_status.dart';
import 'login_screen.dart';

class AuthGate extends StatefulWidget {
  const AuthGate({required this.authRepository, super.key});

  final AuthRepository authRepository;

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  late AuthStatus _status;
  StreamSubscription<AuthState>? _subscription;

  @override
  void initState() {
    super.initState();
    _status = widget.authRepository.currentSession == null
        ? AuthStatus.signedOut
        : AuthStatus.signedIn;
    _subscription = widget.authRepository.authStateChanges.listen((event) {
      if (!mounted) {
        return;
      }

      setState(() {
        _status = event.session == null
            ? AuthStatus.signedOut
            : AuthStatus.signedIn;
      });
    });
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return switch (_status) {
      AuthStatus.restoring => const _RestoreScreen(),
      AuthStatus.signedIn => HomeScreen(
          authRepository: widget.authRepository,
        ),
      AuthStatus.signedOut => LoginScreen(
          authRepository: widget.authRepository,
        ),
    };
  }
}

class _RestoreScreen extends StatelessWidget {
  const _RestoreScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}
