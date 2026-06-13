import 'package:flutter/material.dart';

import '../../../app/app_theme.dart';
import '../../auth/data/auth_repository.dart';
import '../../auth/domain/auth_failure.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({required this.authRepository, super.key});

  final AuthRepository authRepository;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isSigningOut = false;
  String _errorMessage = '';

  Future<void> _signOut() async {
    setState(() {
      _isSigningOut = true;
      _errorMessage = '';
    });

    try {
      await widget.authRepository.signOut();
    } on AuthFailure catch (error) {
      if (!mounted) {
        return;
      }

      setState(() {
        _errorMessage = error.message;
      });
    } finally {
      if (mounted) {
        setState(() {
          _isSigningOut = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = widget.authRepository.currentUser;
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Orthodoxia'),
        actions: [
          IconButton(
            tooltip: 'Sign out',
            onPressed: _isSigningOut ? null : _signOut,
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Home', style: textTheme.headlineLarge),
                    const SizedBox(height: 12),
                    Text(
                      'Signed in and ready for prayer, reading, and learning.',
                      style: textTheme.bodyLarge?.copyWith(
                        color: AppTheme.secondaryText,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      user?.email ?? 'Authenticated session restored',
                      style: textTheme.bodyMedium,
                    ),
                    if (_errorMessage.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      Text(
                        _errorMessage,
                        style: textTheme.bodySmall?.copyWith(
                          color: Theme.of(context).colorScheme.error,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
