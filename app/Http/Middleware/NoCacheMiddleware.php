<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NoCacheMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Aplicar headers anti-caché agresivos
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');
        $response->headers->set('Last-Modified', gmdate('D, d M Y H:i:s') . ' GMT');
        $response->headers->set('ETag', '"' . md5(now()->timestamp . $request->url()) . '"');
        $response->headers->set('Vary', 'Accept-Encoding, User-Agent, X-Requested-With');
        
        // Headers específicos para Inertia.js
        if ($request->header('X-Inertia')) {
            $response->headers->set('X-Inertia-Location', $request->url());
        }

        return $response;
    }
}