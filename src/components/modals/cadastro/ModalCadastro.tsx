import {
  Modal,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Button,
  Spin,
  Radio,
  Row,
  Col,
} from "antd";
import { useState, useRef } from "react";
import { getAddressByCep } from "../../../services/apiExterna/viaCep";
import { maskCep } from "../../../services/Utils";
import "./ModalCadastro.scss";
import { cadastrarUsuario } from "../../../services/apiInterna/FluxoIdentificacao";

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
  const [tipoUsuario, setTipoUsuario] = useState<string>();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = (field: string, value: any) =>
    setForm((p: any) => ({ ...p, [field]: value }));

  // const handleSubmit = () => {
  //   if (!agree) return;
  //   onSubmit?.(form);
  //   onClose();
  // };

  // Busca CEP automaticamente ao digitar (com debounce)
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

  const handleSubmit = async () => {
    if (!agree) return;
    try {
      const response = await cadastrarUsuario({
        ...form,
        tipoUsuario,
      });
      console.log("Cadastro realizado:", response);
      onSubmit?.(form);
      onClose();
    } catch (err: any) {
      console.error("Erro ao cadastrar:", err.message);
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
          <Radio.Group value="paciente">
            <Radio value="paciente">Paciente</Radio>
            <Radio value="medico">Médico</Radio>
          </Radio.Group>
        </div>
      </div>

      {/* GRID Ant Design */}
      <Row gutter={[16, 16]}>
        {/* Nome / Sobrenome */}
        <Col xs={24} md={12}>
          <div className="cad-field">
            <label>
              Nome<span className="req">*</span>
            </label>
            <Input
              placeholder="Digite seu nome"
              onChange={(e) => update("nome", e.target.value)}
            />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="cad-field">
            <label>
              Sobrenome<span className="req">*</span>
            </label>
            <Input
              placeholder="Digite seu sobrenome"
              onChange={(e) => update("sobrenome", e.target.value)}
            />
          </div>
        </Col>

        {/* Data / Celular */}
        <Col xs={24} md={12}>
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
        </Col>
        <Col xs={24} md={12}>
          <div className="cad-field">
            <label>
              Celular<span className="req">*</span>
            </label>
            <Input
              placeholder="(DDD) 9 0000-0000"
              onChange={(e) => update("celular", e.target.value)}
            />
          </div>
        </Col>

        {/* E-mail / CPF / Gênero */}
        <Col xs={24} md={12}>
          <div className="cad-field">
            <label>
              E-mail<span className="req">*</span>
            </label>
            <Input
              placeholder="Digite seu e-mail"
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
        </Col>
        <Col xs={24} md={6}>
          <div className="cad-field">
            <label>
              CPF<span className="req">*</span>
            </label>
            <Input
              placeholder="Digite seu CPF"
              onChange={(e) => update("cpf", e.target.value)}
            />
          </div>
        </Col>
        <Col xs={24} md={6}>
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
              style={{ width: "100%" }}
            />
          </div>
        </Col>

        {/* Senha / Senha novamente */}
        <Col xs={24} md={12}>
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
        </Col>
        <Col xs={24} md={12}>
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
        </Col>

        {/* CEP / Logradouro */}
        <Col xs={24} md={8}>
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
        </Col>
        <Col xs={24} md={16}>
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
        </Col>

        {/* Complemento (linha inteira) */}
        <Col xs={24}>
          <div className="cad-field">
            <label>Complemento</label>
            <Input
              placeholder="Apartamento, bloco, etc."
              value={form.complemento || ""}
              onChange={(e) => update("complemento", e.target.value)}
            />
          </div>
        </Col>

        {/* Bairro / Número */}
        <Col xs={24} md={12}>
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
        </Col>
        <Col xs={24} md={12}>
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
        </Col>

        {/* Cidade / Estado */}
        <Col xs={24} md={18}>
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
        </Col>
        <Col xs={24} md={6}>
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
        </Col>
      </Row>

      {/* Observação */}
      <p className="cad-note" style={{ marginTop: 12 }}>
        <strong>Observação:</strong> Algumas informações de saúde são opcionais
        e podem ser preenchidas depois em seu perfil.
      </p>

      {/* Termos */}
      <div className="cad-terms" style={{ marginTop: 8 }}>
        <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)}>
          Declaro que li e aceito o <a href="#">Termo de uso</a> e a{" "}
          <a href="#">Política de privacidade</a>
        </Checkbox>
      </div>

      {/* Ações */}
      <Button
        type="primary"
        size="large"
        className="cad-submit"
        disabled={!agree}
        onClick={handleSubmit}
        style={{ marginTop: 16 }}
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
