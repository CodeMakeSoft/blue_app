{{-- resources/views/emails/welcome.blade.php --}}
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Bienvenida</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f7f7f7; margin:0; padding:30px; }
    .card { background:#fff; padding:20px; border-radius:8px; border:1px solid #eee; max-width:600px; margin:0 auto; }
    .btn { display:inline-block; padding:10px 16px; border-radius:6px; background:#2563eb; color:#fff; text-decoration:none; }
    .muted { color:#666; font-size:14px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>¡Bienvenido, {{ $user->name }}! 🎉</h2>
    <p>Gracias por registrarte en <strong>{{ config('app.name') }}</strong>.</p>
    <p class="muted">Tu cuenta fue creada correctamente. Por favor confirma tu correo desde el enlace que te enviamos en un mensaje aparte.</p>
    <p style="margin-top:18px">
      <a class="btn" href="{{ url('/') }}">Ir al sitio</a>
    </p>
    <p class="muted" style="margin-top:24px">Si no solicitaste esta cuenta, puedes ignorar este correo.</p>
  </div>
</body>
</html>
