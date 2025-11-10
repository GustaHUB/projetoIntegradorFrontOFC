//CADASTRO

export interface ViaCepAddress {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

export interface CadastroResponse {
  code: number;
  message: string;
  data?: {
    token: string;
  };
}

//LOGIN

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  message?: string;
  data?: {
    token: string;
    firstname: string;
    lastname: string;
  };
  code?: number;
}

// SALVAR DADOS

// EXAME
export interface AdicionarExamePayload {
  nome_exame: string; 
  data_realizacao: string; 
  nome_lab: string; 
  categorias: string[]; 
  arquivo_exame: File; 
}


//CATEGORIAS

export interface Categoria {

}

export type ExameRow = {
  key: string;
  exame: string;
  categoria: string;
  dataRealizacao: string;
  local: string;
  url?: string;
  categoriaId: number;
  rawDate: string;
};
