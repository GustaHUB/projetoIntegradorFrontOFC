import RecuperarSenha from "../../components/modals/recuperarSenha/RecuperarSenha";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "antd/dist/reset.css";
import "./Login.scss";
import CadastroModal from "../../components/modals/cadastro/ModalCadastro";

function Login() {
  const [userLogin, setUserLogin] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [isRecuperarOpen, setIsRecuperarOpen] = useState(false);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      console.log("Login:", userLogin, userPassword);
      navigate("/home");
    } catch (error: unknown) {
      console.log("Erro ao logar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="container-title-up-login">
          <div className="title-up-login">
            <span className="primera-palavra">Med</span>
            <span className="segunda-palavra">Exame</span>
          </div>
          <div>
            <p className="frase-title-up-login">
              Cuidando da sua saúde com praticidade
            </p>
          </div>
        </div>

        <div className="container-login">
          <h1>Login</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              <span className="label-title">Login</span>
              <input
                type="email"
                value={userLogin}
                onChange={(e) => setUserLogin(e.target.value)}
                required
                inputMode="email"
                placeholder="Ex: exemplo@email.com"
              />
            </label>

            <label>
              <span className="label-title">Senha</span>
              <input
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
                placeholder="Digite sua senha"
              />
            </label>

            {erro && (
              <p className="login-error" aria-live="polite">
                {erro}
              </p>
            )}

            <button className="login-button" disabled={loading} type="submit">
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <button
              className="criar-conta-button"
              disabled={loading}
              onClick={() => setIsCadastroOpen(true)}
              type="button"
            >
              Criar conta
            </button>
            <CadastroModal
              open={isCadastroOpen}
              onClose={() => setIsCadastroOpen(false)}
              onSubmit={(dados) => console.log("Cadastro:", dados)}
            />
            <div className="container-esqueceu-senha">
              <p>Esqueceu a senha?</p>
              <button
                className="esqueceu-senha-button"
                type="button"
                onClick={() => setIsRecuperarOpen(true)}
              >
                Clique aqui
              </button>
            </div>
            <RecuperarSenha
              open={isRecuperarOpen}
              onClose={() => setIsRecuperarOpen(false)}
              onSend={(email: any) =>
                console.log("Enviar recuperação para:", email)
              }
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
