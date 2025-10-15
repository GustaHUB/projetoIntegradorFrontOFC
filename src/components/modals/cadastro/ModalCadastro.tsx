import { Modal, Input, Select, DatePicker, Checkbox, Button, Spin } from "antd";
import { useState, useRef } from "react";
import { getAddressByCep } from "../../../services/apiExterna/viaCep";
import { maskCep } from "../../../services/Utils";
import "./ModalCadastro.scss";

type CadastroModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
};

export default function CadastroModal({
  open,
  onClose,
  onSubmit,
}: CadastroModalProps) {
  const [form, setForm] = useState<any>({});
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string>();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = (field: string, value: any) =>
    setForm((p: any) => ({ ...p, [field]: value }));

  const handleSubmit = () => {
    if (!agree) return;
    onSubmit?.(form);
    onClose();
  };

  // 🔍 Busca CEP automaticamente ao digitar (com debounce)
  const handleCepChange = (value: string) => {
    const masked = maskCep(value);
    update("cep", masked);
    setCepError(undefined);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const numeric = masked.replace(/\D/g, "");
    if (numeric.length === 8) {
      debounceRef.current = setTimeout(async () => {
        setLoadingCep(true);
        try {
          const data = await getAddressByCep(numeric);
          setForm((prev: any) => ({
            ...prev,
            cep: maskCep(data.cep),
            logradouro: data.logradouro || prev.logradouro,
            complemento: prev.complemento,
            bairro: data.bairro || prev.bairro,
            cidade: data.localidade || prev.cidade,
            estado: data.uf || prev.estado,
          }));
        } catch (err: any) {
          setCepError(err.message || "Erro ao consultar CEP");
        } finally {
          setLoadingCep(false);
        }
      }, 800);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={890}
      title={null}
      rootClassName="cadastro-modal"
      styles={{ content: { borderRadius: 14, padding: 24 } }}
      maskClosable={false}
    >
      {/* Cabeçalho */}
      <div className="cad-header">
        <h2>Cadastro</h2>
        <div className="cad-toggle">
          <label className="cad-radio">
            <input type="radio" name="tp" defaultChecked /> Paciente
          </label>
          <label className="cad-radio">
            <input type="radio" name="tp" /> Médico
          </label>
        </div>
      </div>

      {/* GRID 2 colunas */}
      <div className="cad-grid">
        {/* Nome / Sobrenome */}
        <div className="cad-field">
          <label>
            Nome<span className="req">*</span>
          </label>
          <Input
            placeholder="Digite seu nome"
            onChange={(e) => update("nome", e.target.value)}
          />
        </div>
        <div className="cad-field">
          <label>
            Sobrenome<span className="req">*</span>
          </label>
          <Input
            placeholder="Digite seu sobrenome"
            onChange={(e) => update("sobrenome", e.target.value)}
          />
        </div>

        {/* Data / Celular */}
        <div className="cad-field">
          <label>
            Data de nascimento<span className="req">*</span>
          </label>
          <DatePicker
            placeholder="Data de nascimento"
            style={{ width: "100%" }}
            onChange={(d) => update("nascimento", d)}
          />
        </div>
        <div className="cad-field">
          <label>
            Celular<span className="req">*</span>
          </label>
          <Input
            placeholder="(DDD) 9 0000-0000"
            onChange={(e) => update("celular", e.target.value)}
          />
        </div>

        {/* E-mail / CPF / Gênero */}
        <div className="cad-field">
          <label>
            E-mail<span className="req">*</span>
          </label>
          <Input
            placeholder="Digite seu e-mail"
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="cad-field">
          <label>
            CPF<span className="req">*</span>
          </label>
          <Input
            placeholder="Digite seu CPF"
            onChange={(e) => update("cpf", e.target.value)}
          />
        </div>
        <div className="cad-field">
          <label>
            Gênero<span className="req">*</span>
          </label>
          <Select
            placeholder="Selecione"
            options={[
              { value: "m", label: "Masculino" },
              { value: "f", label: "Feminino" },
              { value: "o", label: "Outro" },
              { value: "n", label: "Prefiro não dizer" },
            ]}
            onChange={(v) => update("genero", v)}
          />
        </div>

        {/* Senha / Senha novamente */}
        <div className="cad-field">
          <label>
            Senha<span className="req">*</span>
          </label>
          <Input.Password
            placeholder="Digite a senha"
            visibilityToggle={{
              visible: showPass,
              onVisibleChange: setShowPass,
            }}
            onChange={(e) => update("senha", e.target.value)}
          />
        </div>
        <div className="cad-field">
          <label>
            Senha novamente<span className="req">*</span>
          </label>
          <Input.Password
            placeholder="Repita a senha"
            visibilityToggle={{
              visible: showPass2,
              onVisibleChange: setShowPass2,
            }}
            onChange={(e) => update("senha2", e.target.value)}
          />
        </div>

        {/* CEP / Logradouro */}
        <div className="cad-field">
          <label>
            CEP<span className="req">*</span>
          </label>
          <Input
            placeholder="00000-000"
            value={form.cep || ""}
            onChange={(e) => handleCepChange(e.target.value)}
            maxLength={9}
            suffix={loadingCep ? <Spin size="small" /> : undefined}
            status={cepError ? "error" : ""}
          />
          {cepError && (
            <div style={{ color: "#ff4d4f", fontSize: 12 }}>{cepError}</div>
          )}
        </div>
        <div className="cad-field">
          <label>
            Logradouro<span className="req">*</span>
          </label>
          <Input
            placeholder="Rua, Avenida..."
            value={form.logradouro || ""}
            onChange={(e) => update("logradouro", e.target.value)}
          />
        </div>

        {/* Complemento */}
        <div className="cad-field cad-span-2">
          <label>Complemento</label>
          <Input
            placeholder="Apartamento, bloco, etc."
            value={form.complemento || ""}
            onChange={(e) => update("complemento", e.target.value)}
          />
        </div>

        {/* Bairro / Número */}
        <div className="cad-field">
          <label>
            Bairro<span className="req">*</span>
          </label>
          <Input
            placeholder="Digite seu bairro"
            value={form.bairro || ""}
            onChange={(e) => update("bairro", e.target.value)}
          />
        </div>
        <div className="cad-field">
          <label>
            Número<span className="req">*</span>
          </label>
          <Input
            placeholder="Digite o número"
            value={form.numero || ""}
            onChange={(e) => update("numero", e.target.value)}
          />
        </div>

        {/* Cidade / Estado */}
        <div className="cad-field">
          <label>
            Cidade<span className="req">*</span>
          </label>
          <Input
            placeholder="Cidade"
            value={form.cidade || ""}
            onChange={(e) => update("cidade", e.target.value)}
          />
        </div>
        <div className="cad-field">
          <label>
            Estado<span className="req">*</span>
          </label>
          <Input
            placeholder="UF"
            value={form.estado || ""}
            onChange={(e) => update("estado", e.target.value)}
          />
        </div>
      </div>

      {/* Observação */}
      <p className="cad-note">
        <strong>Observação:</strong> Algumas informações de saúde são opcionais
        e podem ser preenchidas depois em seu perfil.
      </p>

      {/* Termos */}
      <div className="cad-terms">
        <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)}>
          Declaro que li e aceito o <a href="#">Termo de uso</a> e a{" "}
          <a href="#">Política de privacidade</a>
        </Checkbox>
      </div>

      {/* Ações */}
      <Button
        type="primary"
        size="large"
        block
        className="cad-submit"
        disabled={!agree}
        onClick={handleSubmit}
      >
        Cadastrar
      </Button>

      <div className="cad-footer">
        Já tem conta?{" "}
        <button type="button" className="cad-link" onClick={onClose}>
          Entrar
        </button>
      </div>
    </Modal>
  );
}
