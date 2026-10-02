import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { appConfig } from '../app.config';
import { Entrar } from './entrar';

describe('Entrar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Entrar] });
  });

  function renderizar(entradas: { returnUrl?: string; erro?: string } = {}) {
    const fixture = TestBed.createComponent(Entrar);
    for (const [nome, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(nome, valor);
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('o link do Google leva o caminho de volta', () => {
    const tela = renderizar({ returnUrl: '/agenda?dia=2026-10-01' });

    expect(tela.querySelector('a')?.getAttribute('href')).toBe(
      '/api/auth/google?returnUrl=%2Fagenda%3Fdia%3D2026-10-01',
    );
  });

  it('sem caminho de volta, o link volta para o início', () => {
    const tela = renderizar();

    expect(tela.querySelector('a')?.getAttribute('href')).toBe('/api/auth/google?returnUrl=%2F');
  });

  it.each([
    ['cancelado', 'Você cancelou a entrada pelo Google.'],
    ['google', 'O Google não concluiu a entrada. Tente de novo.'],
    ['email-nao-verificado', 'O Google não confirmou este e-mail. Confirme o e-mail na conta Google e tente de novo.'],
    ['outra-conta-google', 'Este e-mail já está ligado a outra conta Google. Entre com a conta que você usou antes.'],
    ['motivo-que-a-tela-nao-conhece', 'Não foi possível entrar. Tente de novo.'],
  ])('com erro=%s, mostra o motivo', (erro, mensagem) => {
    const tela = renderizar({ erro });

    expect(tela.querySelector('[role=alert]')?.textContent?.trim()).toBe(mensagem);
  });

  it('sem erro, não mostra motivo', () => {
    expect(renderizar().querySelector('[role=alert]')).toBeNull();
  });
});

describe('Entrar pela rota', () => {
  it('lê o caminho de volta e o motivo da URL', async () => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/entrar?returnUrl=%2Fagenda&erro=cancelado', Entrar);

    const tela = harness.routeNativeElement!;
    expect(tela.querySelector('a')?.getAttribute('href')).toBe('/api/auth/google?returnUrl=%2Fagenda');
    expect(tela.querySelector('[role=alert]')?.textContent?.trim()).toBe('Você cancelou a entrada pelo Google.');
  });
});
