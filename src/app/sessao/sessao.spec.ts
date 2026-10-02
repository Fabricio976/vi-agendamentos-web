import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { firstValueFrom, Observable } from 'rxjs';
import { appConfig } from '../app.config';
import { Entrar } from '../entrar/entrar';
import { Indisponivel } from '../indisponivel/indisponivel';
import { Inicio } from '../inicio/inicio';
import { sessaoGuard } from './sessao-guard';

// Na configuração do app, a navegação do sessaoInterceptor para /entrar substitui qualquer decisão do guard no
// 401, então só o guard sozinho mostra que ele não manda o 401 para outra tela.
describe('sessaoGuard sem o interceptor', () => {
  it('no 401 só segura a navegação', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
    const http = TestBed.inject(HttpTestingController);
    const decisao = firstValueFrom(
      TestBed.runInInjectionContext(() =>
        sessaoGuard({} as ActivatedRouteSnapshot, { url: '/' } as RouterStateSnapshot),
      ) as Observable<boolean | UrlTree>,
    );

    http.expectOne('/api/auth/me').flush(null, { status: 401, statusText: '401' });

    expect(await decisao).toBe(false);
    http.verify();
  });
});

describe('Sessão', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...appConfig.providers, provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  // O pedido nasce um pouco depois do navigateByUrl, quando a navegação chega ao guard.
  async function responder(url: string, corpo: object | null, status = 200) {
    const pedido = await vi.waitFor(() => http.expectOne(url));
    pedido.flush(corpo, { status, statusText: `${status}` });
  }

  it('sem sessão, a tela inicial leva para entrar com o caminho de volta', async () => {
    const harness = await RouterTestingHarness.create();
    const navegacao = harness.navigateByUrl('/?dia=2026-10-01', Entrar);

    await responder('/api/auth/me', null, 401);
    await navegacao;

    expect(TestBed.inject(Router).url).toBe('/entrar?returnUrl=%2F%3Fdia%3D2026-10-01');
  });

  it('com sessão, a tela inicial abre', async () => {
    const harness = await RouterTestingHarness.create();
    const navegacao = harness.navigateByUrl('/', Inicio);

    await responder('/api/auth/me', { nome: 'Vi', email: 'vi@teste.com' });
    await navegacao;
    await responder('/api/saloes', []);

    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('sessão vencida com a tela aberta leva para entrar com a tela atual', async () => {
    const harness = await RouterTestingHarness.create();
    const navegacao = harness.navigateByUrl('/?dia=2026-10-01', Inicio);
    await responder('/api/auth/me', { nome: 'Vi', email: 'vi@teste.com' });
    await navegacao;

    await responder('/api/saloes', null, 401);

    await vi.waitFor(() => expect(TestBed.inject(Router).url).toBe('/entrar?returnUrl=%2F%3Fdia%3D2026-10-01'));
  });

  it('com a API em erro, leva para a tela de indisponível com o caminho de volta', async () => {
    const harness = await RouterTestingHarness.create();
    const navegacao = harness.navigateByUrl('/?dia=2026-10-01', Indisponivel);

    await responder('/api/auth/me', null, 500);
    await navegacao;

    expect(TestBed.inject(Router).url).toBe('/indisponivel?returnUrl=%2F%3Fdia%3D2026-10-01');
    expect(harness.routeNativeElement?.querySelector('[role=alert]')?.textContent?.trim()).toBe(
      'Não foi possível conferir sua sessão.',
    );
  });

  it('POST leva o cabeçalho X-XSRF-TOKEN com o valor do cookie XSRF-TOKEN', () => {
    document.cookie = 'XSRF-TOKEN=token-da-api; path=/';

    TestBed.inject(HttpClient).post('/api/auth/logout', null).subscribe();

    const pedido = http.expectOne('/api/auth/logout');
    expect(pedido.request.headers.get('X-XSRF-TOKEN')).toBe('token-da-api');
    pedido.flush(null, { status: 204, statusText: 'No Content' });
  });
});
