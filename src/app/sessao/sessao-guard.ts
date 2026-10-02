import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

// Libera a rota só com sessão. O 401 da API leva para /entrar pelo sessaoInterceptor. Outro erro, como o banco
// fora do ar, leva para a tela de indisponível com a tela pedida: sem ela, a navegação parava em branco.
export const sessaoGuard: CanActivateFn = (_rota, estado) => {
  const router = inject(Router);
  return inject(HttpClient)
    .get('/api/auth/me')
    .pipe(
      map(() => true),
      catchError((erro: unknown) =>
        of(
          erro instanceof HttpErrorResponse && erro.status === HttpStatusCode.Unauthorized
            ? false
            : router.createUrlTree(['/indisponivel'], { queryParams: { returnUrl: estado.url } }),
        ),
      ),
    );
};
