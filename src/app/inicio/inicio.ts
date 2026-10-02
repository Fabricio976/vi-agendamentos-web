import { HttpClient, httpResource } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SalaoDaProfissional } from './salao-da-profissional';

const PAPEIS: Record<SalaoDaProfissional['role'], string> = { dona: 'Dona', funcionaria: 'Funcionária' };

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  protected readonly saloes = httpResource<SalaoDaProfissional[]>(() => '/api/saloes');
  protected readonly papeis = PAPEIS;
  protected readonly erroAoSair = signal(false);

  protected sair() {
    this.erroAoSair.set(false);
    this.http.post('/api/auth/logout', null).subscribe({
      next: () => void this.router.navigateByUrl('/entrar'),
      error: () => this.erroAoSair.set(true),
    });
  }
}
