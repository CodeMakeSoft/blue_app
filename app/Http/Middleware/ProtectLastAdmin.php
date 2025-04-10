<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class ProtectLastAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->route('user');
        
        if (!$user) {
            abort(404, 'Usuario no encontrado');
        }

        $adminRole = app('adminRole');

        if ($user->hasRole($adminRole->name)) {
            $adminUsersCount = $adminRole->users()->count();
            
            if ($adminUsersCount <= 1) {
                return redirect()->back()
                    ->with('error', 'No puedes eliminar al último administrador.');
            }
        }

        return $next($request);
    }
}
