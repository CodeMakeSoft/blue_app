<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureSingleSuperAdmin
{
    const SUPER_ADMIN = 'SuperAdmin';

    public function handle(Request $request, Closure $next): Response
    {
        try {
            $superAdminRole = Role::findByName(self::SUPER_ADMIN);
            
            if (!$superAdminRole) {
                return $next($request);
            }

            // Verificar si se está intentando asignar el rol SuperAdmin
            if ($this->isAssigningSuperAdmin($request, $superAdminRole->id)) {
                $currentSuperAdmin = User::role(self::SUPER_ADMIN)->first();
                $targetUserId = $request->route('user') ?? $request->input('user_id');

                if ($currentSuperAdmin && $currentSuperAdmin->id != $targetUserId) {
                    Log::warning('SuperAdmin assignment attempt blocked', [
                        'attempt_by' => $request->user()->id,
                        'existing_superadmin' => $currentSuperAdmin->id,
                        'target_user' => $targetUserId
                    ]);

                    // Retornar una respuesta HTTP válida
                    return redirect()->back()
                        ->with('error', 'Ya existe un SuperAdmin en el sistema. Solo puede haber uno.')
                        ->withInput();
                }
            }

            return $next($request);

        } catch (\Exception $e) {
            Log::error('Error en middleware EnsureSingleSuperAdmin: '.$e->getMessage());
            return $next($request);
        }
    }

    protected function isAssigningSuperAdmin(Request $request, int $superAdminRoleId): bool
    {
        if ($request->has('roles')) {
            return in_array($superAdminRoleId, (array)$request->input('roles'));
        }

        if ($request->has('role_id')) {
            return $request->input('role_id') == $superAdminRoleId;
        }

        return false;
    }
}