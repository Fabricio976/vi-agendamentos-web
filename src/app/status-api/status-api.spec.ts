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

  it('mostra "API no ar" com o ambiente quando a API responde', async () => {
    const fixture = renderizar();

    http.expectOne('/api/health').flush(RESPOSTA_OK);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('API no ar · ambiente Staging');
  });

  it('mostra "API fora do ar" quando a API responde erro 500', async () => {
    const fixture = renderizar();

    http.expectOne('/api/health').flush('Falhou', { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('API fora do ar');
    expect(fixture.nativeElement.textContent).not.toContain('API no ar');
  });

  it('mostra "API fora do ar" quando a rede falha', async () => {
    const fixture = renderizar();

    http.expectOne('/api/health').error(new ProgressEvent('error'));
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('API fora do ar');
  });

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
