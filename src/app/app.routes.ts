import { Routes } from '@angular/router';
import { Entrar } from './entrar/entrar';
import { Indisponivel } from './indisponivel/indisponivel';
import { Inicio } from './inicio/inicio';
import { sessaoGuard } from './sessao/sessao-guard';

export const routes: Routes = [
  { path: '', component: Inicio, canActivate: [sessaoGuard] },
  { path: 'entrar', component: Entrar },
  { path: 'indisponivel', component: Indisponivel },
];
