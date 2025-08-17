<?php

namespace App\Observers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UserObserver
{
    const SUPER_ADMIN = 'SuperAdmin';
    
    /**
     * Se ejecuta después de crear un usuario
     */
    public function created(User $user)
    {
        $this->validateSuperAdminUniqueness($user, 'created');
    }
    
    /**
     * Se ejecuta después de actualizar un usuario
     */
    public function updated(User $user)
    {
        $this->validateSuperAdminUniqueness($user, 'updated');
    }
    
    /**
     * Validar que solo haya un SuperAdmin
     */
    private function validateSuperAdminUniqueness(User $user, string $action)
    {
        try {
            $superAdminRole = Role::findByName(self::SUPER_ADMIN);
            
            if (!$superAdminRole) {
                return;
            }
            
            // Si el usuario tiene el rol SuperAdmin
            if ($user->hasRole(self::SUPER_ADMIN)) {
                $superAdmins = User::role(self::SUPER_ADMIN)->where('id', '!=', $user->id)->get();
                
                if ($superAdmins->count() > 0) {
                    Log::error('Múltiples SuperAdmins detectados después de ' . $action, [
                        'new_superadmin' => $user->id,
                        'existing_superadmins' => $superAdmins->pluck('id')->toArray(),
                        'action_by' => Auth::id()
                    ]);
                    
                    // Remover el rol SuperAdmin del usuario recién asignado
                    $user->removeRole(self::SUPER_ADMIN);
                    
                    throw new \Exception('Error: Se detectó un intento de crear múltiples SuperAdmins. El rol ha sido removido automáticamente.');
                }
            }
            
        } catch (\Exception $e) {
            Log::error('Error en validación de SuperAdmin único', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}