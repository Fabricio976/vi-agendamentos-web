// Espelho escrito à mão do record SalaoDaProfissional da API: mudança lá precisa ser repetida aqui.
export interface SalaoDaProfissional {
  id: string;
  nome: string;
  slug: string;
  role: 'dona' | 'funcionaria';
}
