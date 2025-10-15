import { Modal, Input, Button } from "antd";
import { useState } from "react";

import './RecuperarSenha.scss'

type RecuperarSenhaProps = {
  open: boolean;
  onClose: () => void;
  onSend?: (email: string) => void;
  onBackToLogin?: () => void; // opcional: para clicar no link
};

export default function RecuperarSenha({
  open,
  onClose,
  onSend,
  onBackToLogin,
}: RecuperarSenhaProps) {
  const [emailRecuperarSenha, setEmailRecuperarSenha] = useState("");

  const handleEnviar = () => {
    onSend?.(emailRecuperarSenha);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={620}
      maskClosable={false}
      title={null} // vamos customizar o cabeçalho
      rootClassName="recuperar-senha-modal"
      styles={{
        content: {
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,.25)",
        },
      }}
    >
      {/* Cabeçalho customizado */}
      <div className="rs-header">
        <h2>Recuperar senha</h2>
        <p>Recupere sua senha informando o seu e-mail cadastrado</p>
      </div>

      {/* Campo */}
      <label className="rs-field">
        <span className="rs-label">E-mail</span>
        <Input
          type="email"
          value={emailRecuperarSenha}
          onChange={(e) => setEmailRecuperarSenha(e.target.value)}
          required
          inputMode="email"
          placeholder="Ex: exemplo.teste@email.com"
          size="large"
        />
      </label>

      {/* Botão enviar */}
      <Button
        type="primary"
        size="large"
        className="rs-submit"
        onClick={handleEnviar}
        block
      >
        Enviar
      </Button>

      {/* Link voltar */}
      <button
        type="button"
        className="rs-back-link"
        onClick={onBackToLogin ?? onClose}
      >
        Voltar para o login
      </button>
    </Modal>
  );
}
