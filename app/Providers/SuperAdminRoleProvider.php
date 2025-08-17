<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Singletons\SuperAdmin;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;

class SuperAdminRoleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Registrar el Singleton
        $this->app->singleton(SuperAdmin::class, function ($app) {
            return SuperAdmin::getInstance();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Asegurar que exista el rol 'superAdmin' al iniciar
        try {
            Role::findOrCreate('superAdmin');
        } catch (\Exception $e) {
            Log::error('Failed to ensure superAdmin role exists: '.$e->getMessage());
        }

        // Opcional: Verificar que solo haya un SuperAdmin (en producción)
        if ($this->app->environment('production')) {
            $this->ensureSingleSuperAdmin();
        }
    }

    /**
     * Ensure only one SuperAdmin exists in the system
     */
    protected function ensureSingleSuperAdmin(): void
    {
        try {
            $superAdmin = app(SuperAdmin::class);
            
            // Forzar limpieza de caché antes de verificar
            $superAdmin->clearCache();
            
            // Esto activará la verificación automática
            $superAdmin->getUser();
        } catch (\Exception $e) {
            Log::error('SuperAdmin singleton verification failed: '.$e->getMessage());
        }
    }
}