import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StatusApi } from './status-api';
import { StatusDaApi } from './status-da-api';

// Ambiente diferente do "Development" do dia a dia, para um valor fixo no template não passar por coincidência.
const RESPOSTA_OK: StatusDaApi = {
  aplicacao: 'Vi Agendamentos',
  ambiente: 'Staging',
  verificadoEm: '2026-09-29T18:00:00+00:00',
};

describe('StatusApi', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatusApi],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function renderizar() {
    const fixture = TestBed.createComponent(StatusApi);
    TestBed.tick();
    return fixture;
  }

  // Pega: componente que não chama /api/health, não mostra o resultado ou mostra um ambiente fixo.
  it('mostra "API no ar" com o ambiente quando a API responde', async () => {
    const fixture = renderizar();

    http.expectOne('/api/health').flush(RESPOSTA_OK);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('API no ar · ambiente Staging');
  });

  // Pega: erro 500 tratado como sucesso ou como carregamento eterno.
  it('mostra "API fora do ar" quando a API responde erro 500', async () => {
    const fixture = renderizar();

    http.expectOne('/api/health').flush('Falhou', { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('API fora do ar');
    expect(fixture.nativeElement.textContent).not.toContain('API no ar');
  });

  // Pega: só erro com status HTTP tratado, e a queda da rede passando despercebida.
  it('mostra "API fora do ar" quando a rede falha', async () => {
    const fixture = renderizar();

    http.expectOne('/api/health').error(new ProgressEvent('error'));
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('API fora do ar');
  });

  // Pega: botão "Tentar de novo" que não busca a API outra vez.
  it('"Tentar de novo" busca a API outra vez e mostra "API no ar"', async () => {
    const fixture = renderizar();
    http.expectOne('/api/health').flush('Falhou', { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    TestBed.tick();
    http.expectOne('/api/health').flush(RESPOSTA_OK);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('API no ar');
  });
});
