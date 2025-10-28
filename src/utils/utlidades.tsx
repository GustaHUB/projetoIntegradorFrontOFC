export const parseMaybeJsonArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === "string") {
    const s = v.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        return JSON.parse(s);
      } catch {
        return [];
      }
    }
  }
  return [];
};

export function isValidCPF(cpfRaw: string): boolean {
  if (!cpfRaw) return false;
  const cpf = cpfRaw.replace(/\D/g, "");

  // 11 dígitos e não pode ser sequência repetida (000..., 111..., etc.)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  // cálculo do 1º dígito
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i], 10) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9], 10)) return false;

  // cálculo do 2º dígito
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i], 10) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10], 10)) return false;

  return true;
}

export function isValidPhoneBR(phoneRaw: string): boolean {
  if (!phoneRaw) return false;

  const phone = phoneRaw.replace(/\D/g, "");

  // Mínimo 10 / Máximo 11 (DDD + número)
  if (phone.length < 10 || phone.length > 11) return false;

  // Não pode ser sequência repetida (000..., 111...)
  if (/^(\d)\1+$/.test(phone)) return false;

  return true;
}

export function isValidCEP(cepRaw: string): boolean {
  if (!cepRaw) return false;
  const cep = cepRaw.replace(/\D/g, "");
  if (cep.length !== 8) return false;
  // rejeita sequências óbvias inválidas (00000000, 11111111, etc.)
  if (/^(\d)\1{7}$/.test(cep)) return false;
  return true;
}
