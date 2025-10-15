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

export interface CadastroPayload {
  nome: string;
  sobrenome: string;
  nascimento: string | Date;
  celular: string;
  email: string;
  cpf: string;
  genero: string;
  senha: string;
  senha2?: string;
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  numero: string;
  cidade: string;
  estado: string;
  tipoUsuario: string; 
}

export interface ApiResponse {
  code: number;
  message: string;
  data?: any;
}
