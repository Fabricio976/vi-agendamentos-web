import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Inicio } from './inicio';
import { SalaoDaProfissional } from './salao-da-profissional';

describe('Inicio', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [provideRouter([{ path: 'entrar', children: [] }]), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  async function renderizarCom(saloes: SalaoDaProfissional[]) {
    const fixture = TestBed.createComponent(Inicio);
    TestBed.tick();
    http.expectOne('/api/saloes').flush(saloes);
    await fixture.whenStable();
    return fixture;
  }

  function botao(fixture: ComponentFixture<Inicio>, texto: string) {
    const botoes = [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')];
    return botoes.find((b) => b.textContent?.trim() === texto)!;
  }

  it('mostra cada salão da profissional com o papel', async () => {
    const fixture = await renderizarCom([
      { id: 'a', nome: 'Salão da Vi', slug: 'salao-da-vi', role: 'dona' },
      { id: 'b', nome: 'Studio Lu', slug: 'studio-lu', role: 'funcionaria' },
    ]);

    const saloes = [...(fixture.nativeElement as HTMLElement).querySelectorAll('.salao')].map((s) =>
      [...s.children].map((parte) => parte.textContent?.trim()).join(' '),
    );
    expect(saloes).toEqual(['Salão da Vi Dona', 'Studio Lu Funcionária']);
  });

  it('sem salão, avisa que o login não está ligado a nenhum salão', async () => {
    const fixture = await renderizarCom([]);

    expect(fixture.nativeElement.textContent).toContain('Seu login ainda não está ligado a nenhum salão.');
  });

  it('com a API em erro, mostra o erro, e não "nenhum salão"', async () => {
    const fixture = TestBed.createComponent(Inicio);
    TestBed.tick();
    http.expectOne('/api/saloes').flush('Falhou', { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Não foi possível carregar seus salões.');
    expect(fixture.nativeElement.textContent).not.toContain('nenhum salão');
  });

  it('Sair encerra a sessão e leva para entrar', async () => {
    const fixture = await renderizarCom([]);

    botao(fixture, 'Sair').click();
    http.expectOne({ method: 'POST', url: '/api/auth/logout' }).flush(null, { status: 204, statusText: 'No Content' });
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/entrar');
  });

  it('se sair falhar, avisa e continua na tela', async () => {
    const fixture = await renderizarCom([]);

    botao(fixture, 'Sair').click();
    http.expectOne({ method: 'POST', url: '/api/auth/logout' }).flush('Falhou', { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[role=alert]')?.textContent?.trim()).toBe(
      'Não foi possível sair. Tente de novo.',
    );
    expect(TestBed.inject(Router).url).toBe('/');
  });
});
