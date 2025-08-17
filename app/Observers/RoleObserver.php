<?php

namespace App\Observers;

use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class RoleObserver
{
    const SUPER_ADMIN = 'SuperAdmin';
    
    /**
     * Previene la eliminación del rol SuperAdmin
     */
    public function deleting(Role $role)
    {
        if ($role->name === self::SUPER_ADMIN) {
            Log::warning('Intento de eliminar rol SuperAdmin bloqueado', [
                'user_id' => Auth::id(),
                'role_id' => $role->id,
                'ip' => request()->ip()
            ]);
            
            // Lanzar excepción para mostrar mensaje al usuario
            throw new \Exception('No se puede eliminar el rol SuperAdmin. Es un rol del sistema.');
        }
    }
    
    /**
     * Previene cambios en el nombre del rol SuperAdmin
     */
    public function updating(Role $role)
    {
        // Previene cambios en el nombre del rol SuperAdmin
        if ($role->getOriginal('name') === self::SUPER_ADMIN && 
            $role->name !== self::SUPER_ADMIN) {
            Log::warning('Intento de cambiar nombre de rol SuperAdmin bloqueado', [
                'user_id' => Auth::id(),
                'role_id' => $role->id,
                'old_name' => $role->getOriginal('name'),
                'new_name' => $role->name,
                'ip' => request()->ip()
            ]);
            
            throw new \Exception('No se puede modificar el nombre del rol SuperAdmin.');
        }
    }
}