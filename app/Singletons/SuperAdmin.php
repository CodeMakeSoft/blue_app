<?php

namespace App\Singletons;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;

class SuperAdmin
{
    private static $instance = null;
    private $superAdminUser = null;

    private function __construct()
    {
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getUser(): ?User
    {
        if ($this->superAdminUser === null) {
            $this->superAdminUser = User::role('SuperAdmin')->first();
            
            if (!$this->superAdminUser) {
                Log::warning('No SuperAdmin user found in database');
            }
        }
        return $this->superAdminUser;
    }

    // Verificar si un usuario es el SuperAdmin
    public function isSuperAdmin(User $user): bool
    {
        $superAdmin = $this->getUser();
        return $superAdmin && $superAdmin->id === $user->id;
    }

    public function assignTo(User $user): void
    {
        $role = Role::firstOrCreate(['name' => 'superAdmin']);
    
        // Eliminar el rol de cualquier otro usuario
        $role->users()->sync([]);
        
        // Asignar solo al nuevo usuario
        $user->assignRole($role);
        
        $this->superAdminUser = $user;
    }

    // Prevenir clonación y deserialización
    private function __clone() {}
    public function __wakeup()
    {
        throw new \Exception("Cannot unserialize singleton");
    }

    // En app/Singletons/SuperAdmin.php
    public function clearCache(): void
    {
        $this->superAdminUser = null;
    }
}