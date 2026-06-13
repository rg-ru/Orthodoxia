class AuthFailure implements Exception {
  const AuthFailure(this.message, {this.cause});

  final String message;
  final Object? cause;

  @override
  String toString() => message;
}
