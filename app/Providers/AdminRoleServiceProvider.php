<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Exceptions\RoleDoesNotExist;

class AdminRoleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Singleton para el rol Admin
        $this->app->singleton('adminRole', function () {
            try {
                return Role::findByName('Admin'); 
            } catch (RoleDoesNotExist $e) {
                return Role::create(['name' => 'Admin']); 
            }
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Evita que se elimine el rol Admin
        Role::deleting(function ($role) {
            if ($role->name === 'Admin') { 
                throw new \Exception('El rol Admin es permanente.');
            }
        });
    }
}
