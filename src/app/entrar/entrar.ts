import { Component, computed, input } from '@angular/core';

// Motivos que a API manda na volta do login, em /entrar?erro=...
const MOTIVOS: Record<string, string> = {
  cancelado: 'Você cancelou a entrada pelo Google.',
  google: 'O Google não concluiu a entrada. Tente de novo.',
  'email-nao-verificado':
    'O Google não confirmou este e-mail. Confirme o e-mail na conta Google e tente de novo.',
  'outra-conta-google':
    'Este e-mail já está ligado a outra conta Google. Entre com a conta que você usou antes.',
};

@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.html',
  styleUrl: './entrar.css',
})
export class Entrar {
  readonly returnUrl = input<string>();
  readonly erro = input<string>();

  // Link, e não chamada do HttpClient: o login troca de página, vai ao Google e volta pela API.
  protected readonly linkDoGoogle = computed(
    () => `/api/auth/google?returnUrl=${encodeURIComponent(this.returnUrl() ?? '/')}`,
  );

  protected readonly motivo = computed(() => {
    const erro = this.erro();
    return erro ? (MOTIVOS[erro] ?? 'Não foi possível entrar. Tente de novo.') : undefined;
  });
}
