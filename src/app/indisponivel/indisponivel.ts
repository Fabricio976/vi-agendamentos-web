import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-indisponivel',
  templateUrl: './indisponivel.html',
  styles: `[role='alert'] { color: var(--cor-erro); }`,
})
export class Indisponivel {
  private readonly router = inject(Router);

  readonly returnUrl = input<string>();

  protected tentarDeNovo() {
    void this.router.navigateByUrl(this.returnUrl() ?? '/');
  }
}
