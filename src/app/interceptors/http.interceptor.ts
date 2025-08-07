import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { switchMap } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  return inject(AuthService)
    .getAccessTokenSilently()
    .pipe(
      switchMap((token) => {
        if (req.url.includes('supabase')) {
          const request = req.clone({
            headers: req.headers
              .set('apikey', process.env['ENV_SUPABASE_API_KEY'] ?? '')
              .set('Access-Control-Allow-Origin', '*')
              .set(
                'Access-Control-Allow-Headers',
                'authorization, x-client-info, apikey, content-type'
              )
              .set('Prefer', 'return=representation')
              .set('Content-Type', 'application/json')
              .set('Authorization', `Bearer ${token}`),
          });
          return next(request);
        }
        return next(req);
      })
    );
};
