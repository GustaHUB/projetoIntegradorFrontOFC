import axios from "axios";
import type { ApiResponse, CadastroPayload } from "../interfaces/Interfaces";

export async function cadastrarUsuario(
  payload: CadastroPayload
): Promise<ApiResponse> {
  try {
    const { data } = await axios.post<ApiResponse>(
      "https://seu-backend.com/api/usuarios/cadastrar",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Erro ao cadastrar usuário.";
      throw new Error(message);
    }
    throw new Error("Erro inesperado no cadastro.");
  }
}
