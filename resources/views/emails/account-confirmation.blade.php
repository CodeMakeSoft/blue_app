<!-- resources/views/emails/account-confirmation.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Confirma tu cuenta</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            color: #333;
            padding: 0;
            margin: 0;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
        h1 {
            color: #4CAF50;
            text-align: center;
        }
        p {
            font-size: 15px;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            background-color: #4CAF50;
            color: white !important;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            font-size: 13px;
            color: #888;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>¡Bienvenido a {{ config('app.name') }}!</h1>
        <p>Hola {{ $user->name }},</p>
        <p>Gracias por registrarte. Para activar tu cuenta, por favor confirma tu dirección de correo electrónico haciendo clic en el botón de abajo:</p>
        
        <p style="text-align: center;">
            <a href="{{ $verificationUrl }}" class="btn">Confirmar mi cuenta</a>
        </p>

        <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }} - Todos los derechos reservados.
        </div>
    </div>
</body>
</html>
