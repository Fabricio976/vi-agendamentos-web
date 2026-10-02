import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Sessão ausente ou vencida: leva para /entrar com a tela de volta. Durante uma navegação, como a que o
// sessaoGuard segura, a tela de volta é o destino dela; fora de navegação, é a tela aberta.
export const sessaoInterceptor: HttpInterceptorFn = (pedido, proximo) => {
  const router = inject(Router);
  return proximo(pedido).pipe(
    catchError((erro: unknown) => {
      if (erro instanceof HttpErrorResponse && erro.status === HttpStatusCode.Unauthorized) {
        const returnUrl = router.currentNavigation()?.extractedUrl.toString() ?? router.url;
        void router.navigate(['/entrar'], { queryParams: { returnUrl } });
      }
      return throwError(() => erro);
    }),
  );
};
