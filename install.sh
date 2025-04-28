#!/bin/bash

# Script to install the UPP Store project
set -e

RED='\033[1;31m'    # Rojo claro
GREEN='\033[1;32m'  # Verde claro
YELLOW='\033[1;33m' # Amarillo claro
BLUE='\033[1;34m'   # Azul claro
NC='\033[0m'        # Sin color (reset)


response() {
    if [[ $1 =~ ^[Yy]$ ]]; then
        return 0
    elif [[ $1 =~ ^[Nn]$ ]]; then
        return 1
    else
        echo -e  "${RED}Entrada inválida. Por favor ingresa 'Y' o 'N'.${NC}"
        return 2
    fi
}
clear &&
echo -e  "${BLUE}Bienvenido a la instalación de UPP Store."
echo -e  "Para el proyecto, necesitas tener instalado PHP, Composer, Git y Node.js, npm y xampp."
echo -e  "Asegurate de tener encendido el servidor de xampp y que MySQL esté corriendo.${NC}"
echo -e  "${YELLOW}¿Tienes todo para continuar?${NC} ${GREEN}(Y/N)${NC}"
read -r answer

if ! response "$answer"; then
    echo -e  "${BLUE}Por favor instala las dependencias necesarias y vuelve a ejecutar el script.${NC}" && \
    sleep 3 && clear
    exit 1
else
    echo -e  "${YELLOW}Instalando proyecto...${NC}"
    mkdir P_UPPStore && cd P_UPPStore && \
    git clone https://github.com/CodeMakeSoft/blue_app.git && \
    cd blue_app && \
    git checkout main && \
    git branch --set-upstream-to=origin/main && \
cat <<EOF > .env
APP_NAME="UPP Store"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
# APP_MAINTENANCE_STORE=database

PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blue_app
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database
CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"

# Paypal Configuration
PAYPAL_SANDBOX_CLIENT_ID=AbJwYqtwd6Iwtb-UFqmtQtqMfJYrZbhbX_pTB-d7s4kWyGbW3RZe-q9i5bVN-UJ7QmeoHlfYn-wh15Ru
PAYPAL_SANDBOX_CLIENT_SECRET=EAOxbpYUDQj1cNNRhtgV3zG0A3-ajSEtaa9TM0rQU8Iq7qLDvYHTdiH3Qxgxe_mwSMEQjPYsREEqXAy3

PAYPAL_LIVE_CLIENT_ID=
PAYPAL_LIVE_CLIENT_SECRET=
PAYPAL_LIVE_APP_ID=

PAYPAL_MODE=sandbox
PAYPAL_PAYMENT_ACTION=Sale
PAYPAL_CURRENCY=MXN
PAYPAL_NOTIFY_URL=http://localhost:8000/paypal/webhook
PAYPAL_LOCALE=es_MX
PAYPAL_VALIDATE_SSL=true
EOF

    npm install && \
    npm install --save-dev vite laravel-vite-plugin @vitejs/plugin-vue && \
    composer clear-cache && \
    composer install --prefer-dist --no-plugins --no-scripts --ignore-platform-reqs && \
    php artisan key:generate && \
    php artisan storage:link && \
    php artisan migrate:fresh --seed && \

clear && \
echo -e  "${GREEN}======================================"
echo -e  "Proyecto instalado correctamente."
echo -e  "======================================"
echo -e  "Ahora puedes iniciar el servidor de desarrollo de Laravel con el siguiente comando:${NC}"
echo -e  "${YELLOW}\tphp artisan serve${NC}"
echo -e  "${GREEN}\nY puedes iniciar el servidor de desarrollo de Vite con el siguiente comando:${NC}"
echo -e  "${YELLOW}\tnpm run dev${NC}"
echo -e  "${GREEN}======================================"
echo -e  "Recuerda que debes tener instalado Node.js, npm y artisan para ejecutar el proyecto."
echo -e  "Finalizando la instalación..."
echo -e  "======================================" 
sleep 8 && clear
echo -e  "${YELLOW}Recuerda configurar tu archivo .env con los datos de tu base de datos y otros servicios necesarios.${NC}"
sleep 3 && clear
echo -e  "Si necesitas ayuda, consulta la documentación del proyecto.${NC}"
sleep 3 && clear
echo -e  "${GREEN}======================================" 
echo -e  "¡Gracias por instalar UPP Store!"
echo -e  "¡Hasta luego!"
echo -e  "Si tienes alguna pregunta, no dudes en preguntar al admin."
echo -e  "======================================${NC}" 
sleep 5 && clear
cd ../..

# Auto-remove the script
rm -- "$0"
fi


