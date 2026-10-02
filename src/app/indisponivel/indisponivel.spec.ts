import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Indisponivel } from './indisponivel';

describe('Indisponivel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Indisponivel],
      providers: [provideRouter([{ path: '**', children: [] }])],
    });
  });

  async function tentarDeNovo(entradas: { returnUrl?: string } = {}) {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/indisponivel');
    const fixture = TestBed.createComponent(Indisponivel);
    for (const [nome, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(nome, valor);
    }
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();
    await fixture.whenStable();
    return router.url;
  }

  it('Tentar de novo volta para a tela pedida', async () => {
    expect(await tentarDeNovo({ returnUrl: '/agenda?dia=2026-10-01' })).toBe('/agenda?dia=2026-10-01');
  });

  it('sem caminho de volta, tenta de novo o início', async () => {
    expect(await tentarDeNovo()).toBe('/');
  });
});
