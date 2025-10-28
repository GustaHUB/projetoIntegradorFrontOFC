import { useEffect, useRef, useState } from "react";

//componentes antd
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  Upload,
} from "antd";
import { CameraOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

//api
import {
  dadosUsuario,
  editarUsuario,
} from "../../services/apiInterna/FluxoIdentificacao";

//utils
import {
  maskAltura,
  maskCEP,
  maskCPF,
  maskPhoneBR,
  onlyDigits,
} from "../../utils/Masks";

import "./Perfil.scss";
import { showMessage } from "../../components/messageHelper/ShowMessage";
import { getAddressByCep } from "../../services/apiExterna/viaCep";
import {
  isValidCEP,
  isValidCPF,
  isValidPhoneBR,
  parseMaybeJsonArray,
} from "../../utils/utlidades";
import DesativarContaModal from "../../components/modals/desativarConta/DesativarConta";

export default function Perfil() {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [openModalDesativarConta, setOpenModalDesativarConta] = useState(false);

  const primeiroNomeUsuario = localStorage.getItem("primeiroNomeUsuario");
  const ultimoNomeUsuario = localStorage.getItem("ultimoNomeUsuario");

  const { Title, Paragraph } = Typography;
  const { TextArea } = Input;

  const generos = [
    { label: "Masculino", value: 1 },
    { label: "Feminino", value: 2 },
    { label: "Outro", value: 3 },
    { label: "Prefiro não informar", value: 4 },
  ];

  const tiposSanguineos = [
    "O+",
    "O-",
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
  ].map((t) => ({ label: t, value: t }));

  const SUG_DOENCAS = [
    "Hipertensão arterial",
    "Diabetes mellitus tipo 2",
    "Asma",
    "DPOC (doença pulmonar obstrutiva crônica)",
    "Doença cardíaca isquêmica",
    "Insuficiência cardíaca",
    "Dislipidemia (colesterol alto)",
    "Hipotireoidismo",
    "Artrite/Artrose (osteoartrite)",
    "Enxaqueca",
    "Doença renal crônica",
    "Depressão",
    "Transtorno de ansiedade",
    "Apneia do sono",
  ];

  const SUG_ALERGIAS = [
    "Penicilina",
    "Amoxicilina",
    "Cefalosporinas",
    "Dipirona (metamizol)",
    "AAS (aspirina)",
    "Ibuprofeno",
    "AINEs (anti-inflamatórios)",
    "Iodo / contraste iodado",
    "Látex",
    "Frutos do mar / mariscos",
    "Amendoim",
    "Proteína do leite",
    "Ovo",
    "Picada de inseto",
  ];

  const SUG_MEDICACAO = [
    "Losartana 50 mg",
    "Enalapril 10 mg",
    "Hidroclorotiazida 25 mg",
    "Metformina 850 mg",
    "Insulina NPH",
    "Atorvastatina 20 mg",
    "Sinvastatina 20 mg",
    "Levotiroxina 50 mcg",
    "Omeprazol 20 mg",
    "Sertralina 50 mg",
    "Fluoxetina 20 mg",
    "Paracetamol 750 mg",
    "Dipirona 500 mg",
    "Ibuprofeno 400 mg",
    "Loratadina 10 mg",
    "Cetirizina 10 mg",
    "Salbutamol (spray)",
    "Budesonida (inalatório)",
  ];

  const toOptions = (arr: string[]) => arr.map((v) => ({ label: v, value: v }));

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const endereco = {
        cep: values.cep ?? "",
        rua: values.logradouro ?? "",
        numero: values.numero ?? "",
        complemento: values.complemento ?? "",
        bairro: values.bairro ?? "",
        cidade: values.cidade ?? "",
        estado: values.estado ?? "",
      };

      const payload = {
        tipo_usuario: "paciente",
        primeiro_nome: values.nome?.trim() ?? null,
        ultimo_nome: values.sobrenome?.trim() ?? null,
        data_nascimento: values.nascimento
          ? dayjs(values.nascimento).format("YYYY-MM-DD")
          : null,
        telefone: onlyDigits(values.celular) ?? null,
        email: values.email ?? null,
        cpf: onlyDigits(values.cpf) ?? null,
        genero: values.genero != null ? Number(values.genero) : null,
        tipo_sanguineo: values.tipoSanguineo ?? values.tipo_sanguineo ?? null,
        doencas_diagnosticadas:
          values.doencas ?? values.doencas_diagnosticadas ?? [],
        alergias: values.alergias ?? [],
        medicacao: values.medicacao ?? [],
        altura: values.altura
          ? parseFloat(String(values.altura).replace(",", "."))
          : null,
        peso: values.peso
          ? parseFloat(String(values.peso).replace(",", "."))
          : null,
        desc_deficiencia:
          values.deficiencias ?? values.desc_deficiencia ?? null,
        endereco,
      };

      await editarUsuario(payload);
      showMessage("Dados salvos com sucesso!", "success");
    } catch (err: any) {
      showMessage("Erro ao salvar dados pessoais.", "error");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    showMessage("Preencha os campos obrigatórios destacados.", "warning");
    form.scrollToField(
      form.getFieldsError().find((f) => f.errors.length)?.name ?? [],
      {
        block: "center",
      }
    );
  };

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const response = await dadosUsuario();
        const user = response.data;
        form.setFieldsValue({
          nome: user.primeiro_nome,
          sobrenome: user.ultimo_nome,
          nascimento: user.data_nascimento ? dayjs(user.data_nascimento) : null,
          celular: maskPhoneBR(user.telefone),
          email: user.email,
          cpf: maskCPF(user.cpf),
          genero: user.genero != null ? Number(user.genero) : undefined,
          tipoSanguineo: user.tipo_sanguineo,
          doencas: parseMaybeJsonArray(user.doencas_diagnosticadas),
          alergias: parseMaybeJsonArray(user.alergias),
          medicacao: parseMaybeJsonArray(user.medicacao),
          cep: user.cep,
          logradouro: user.rua,
          complemento: user.complemento,
          bairro: user.bairro,
          numero: user.numero,
          cidade: user.cidade,
          estado: user.estado,
          peso: user.peso,
          altura: user.altura,
          deficiencias: user.desc_deficiencia,
        });
      } catch (err: any) {
        showMessage("Erro ao carregar dados pessoais.", "error");
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const handleCepChange = (raw: string) => {
    const masked = maskCEP(raw);
    form.setFieldsValue({ cep: masked });
    setCepError(undefined);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    const numeric = masked.replace(/\D/g, "");
    if (numeric.length === 8) {
      debounceRef.current = setTimeout(async () => {
        setLoadingCep(true);
        try {
          const data = await getAddressByCep(numeric);
          form.setFieldsValue({
            cep: maskCEP(data.cep),
            logradouro: data.logradouro || form.getFieldValue("logradouro"),
            bairro: data.bairro || form.getFieldValue("bairro"),
            cidade: data.localidade || form.getFieldValue("cidade"),
            estado: data.uf || form.getFieldValue("estado"),
          });
        } catch (err: any) {
          setCepError(err?.message || "Erro ao consultar CEP");
        } finally {
          setLoadingCep(false);
        }
      }, 800);
    }
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      {/* Cabeçalho do perfil */}
      <Card styles={{ body: { padding: 20 } }}>
        <Flex align="center" gap={30} wrap="wrap">
          <div style={{ position: "relative", width: 96, height: 96 }}>
            <Avatar
              src={avatarUrl}
              size={96}
              style={{ backgroundColor: "#e6f4ff", color: "#1677ff" }}
            >
              {avatarUrl
                ? null
                : `${primeiroNomeUsuario?.[0]?.toUpperCase() ?? ""}${
                    ultimoNomeUsuario?.[0]?.toUpperCase() ?? ""
                  }`}
            </Avatar>

            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => false}
              customRequest={() => {}}
            >
              <Button
                type="default"
                shape="circle"
                icon={<CameraOutlined />}
                style={{
                  position: "absolute",
                  right: -6,
                  bottom: -6,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                }}
              />
            </Upload>
          </div>

          <div>
            <Title level={3} style={{ marginBottom: 2 }}>
              Meu Perfil
            </Title>
            <Paragraph type="secondary" style={{ margin: 0 }}>
              Aqui você pode visualizar e editar seus dados pessoais e
              opcionais.
            </Paragraph>
          </div>
        </Flex>
      </Card>

      {/* Formulário */}
      <Card
        styles={{ body: { padding: 20, overflow: "hidden" } }}
        style={{ borderRadius: 12 }}
      >
        <DesativarContaModal
          open={openModalDesativarConta}
          onClose={() => setOpenModalDesativarConta(false)}
        />

        <Form
          layout="vertical"
          labelWrap
          form={form}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={[24, 24]}>
            {/* DADOS PESSOAIS */}
            <Col xs={24} lg={14}>
              <Title level={4} style={{ marginBottom: 12 }}>
                Dados básicos
              </Title>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Nome"
                    name="nome"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Ex.: João" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Sobrenome"
                    name="sobrenome"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Ex.: Silva" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Data de nascimento"
                    name="nascimento"
                    rules={[{ required: true }]}
                  >
                    <DatePicker
                      placeholder="DD/MM/YYYY"
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      disabledDate={(current) =>
                        current &&
                        (current > dayjs().endOf("day") ||
                          current < dayjs("1900-01-01"))
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Celular"
                    name="celular"
                    normalize={maskPhoneBR}
                    validateTrigger={["onBlur", "onSubmit"]}
                    rules={[
                      { required: true, message: "Informe o celular" },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          if (!isValidPhoneBR(value)) {
                            return Promise.reject("Celular inválido.");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input placeholder="(45) 99967-9998" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[{ type: "email", required: true }]}
                  >
                    <Input placeholder="email@exemplo.com" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    label="CPF"
                    name="cpf"
                    normalize={maskCPF}
                    validateTrigger={["onBlur", "onSubmit"]}
                    rules={[
                      { required: true, message: "Informe o CPF" },
                      {
                        validator: (_, value) => {
                          const digits = onlyDigits(value || "");
                          if (!digits) return Promise.resolve();
                          if (digits.length !== 11) {
                            return Promise.reject(
                              "CPF deve conter 11 dígitos."
                            );
                          }
                          if (!isValidCPF(digits)) {
                            return Promise.reject("CPF inválido.");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input placeholder="000.000.000-00" maxLength={14} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Gênero" name="genero">
                    <Select options={generos} />
                  </Form.Item>
                </Col>

                {/* ENDEREÇO */}
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    label="CEP"
                    name="cep"
                    validateStatus={cepError ? "error" : ""}
                    help={cepError}
                    rules={[{ required: true, message: "Informe o CEP" }]}
                  >
                    <Input
                      placeholder="00000-000"
                      maxLength={9}
                      onChange={(e) => handleCepChange(e.target.value)}
                      suffix={loadingCep ? <Spin size="small" /> : undefined}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Logradouro" name="logradouro">
                    <Input placeholder="Ex.: Rua das Flores" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label="Complemento" name="complemento">
                    <Input placeholder="Apto, bloco, ref." />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item label="Bairro" name="bairro">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Form.Item label="Número" name="numero">
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label="Cidade" name="cidade">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Form.Item label="Estado" name="estado">
                    <Select
                      options={[
                        "AC",
                        "AL",
                        "AP",
                        "AM",
                        "BA",
                        "CE",
                        "DF",
                        "ES",
                        "GO",
                        "MA",
                        "MT",
                        "MS",
                        "MG",
                        "PA",
                        "PB",
                        "PR",
                        "PE",
                        "PI",
                        "RJ",
                        "RN",
                        "RS",
                        "RO",
                        "RR",
                        "SC",
                        "SP",
                        "SE",
                        "TO",
                      ].map((uf) => ({ label: uf, value: uf }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* DADOS OPCIONAIS */}
            <Col xs={24} lg={10}>
              <Title level={4} style={{ marginBottom: 12 }}>
                Dados opcionais
              </Title>

              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    label="Doenças já diagnosticadas"
                    name="doencas"
                    normalize={(arr) =>
                      Array.from(new Set((arr ?? []).map((s: any) => s.trim())))
                    }
                  >
                    <Select
                      mode="tags"
                      placeholder="Ex: Diabetes tipo 2, Hipertensão"
                      tokenSeparators={[","]}
                      showSearch
                      optionFilterProp="label"
                      options={toOptions(SUG_DOENCAS)}
                      filterOption={(input, option) =>
                        (option?.label as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      maxTagCount="responsive"
                      allowClear
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Alergias"
                    name="alergias"
                    normalize={(arr) =>
                      Array.from(new Set((arr ?? []).map((s: any) => s.trim())))
                    }
                  >
                    <Select
                      mode="tags"
                      placeholder="Ex: Amendoim, Dipirona"
                      tokenSeparators={[","]}
                      showSearch
                      optionFilterProp="label"
                      options={toOptions(SUG_ALERGIAS)}
                      filterOption={(input, option) =>
                        (option?.label as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      maxTagCount="responsive"
                      allowClear
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Medicação"
                    name="medicacao"
                    normalize={(arr) =>
                      Array.from(new Set((arr ?? []).map((s: any) => s.trim())))
                    }
                  >
                    <Select
                      mode="tags"
                      placeholder="Ex: Losartana 50mg, uso contínuo"
                      tokenSeparators={[","]}
                      showSearch
                      optionFilterProp="label"
                      options={toOptions(SUG_MEDICACAO)}
                      filterOption={(input, option) =>
                        (option?.label as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      maxTagCount="responsive"
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Altura (m)"
                    name="altura"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          const num = parseFloat(value);
                          if (num < 0.5 || num > 2.5)
                            return Promise.reject(
                              "Informe uma altura entre 0.50 e 2.50 m"
                            );
                          return Promise.resolve();
                        },
                      },
                    ]}
                    getValueFromEvent={(e) => maskAltura(e.target.value)}
                  >
                    <Input placeholder="Ex.: 1.75" inputMode="numeric" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item label="Peso (kg)" name="peso">
                    <Input placeholder="Ex.: 70" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item label="Tipo sanguíneo" name="tipoSanguineo">
                    <Select options={tiposSanguineos} placeholder="Ex.: O+" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Descrição de deficiências"
                    name="deficiencias"
                  >
                    <TextArea
                      placeholder="Ex: Deficiência visual parcial, mobilidade reduzida"
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="container-button-perfil">
            <div className="container-salvar-alterar">
              <Button
                className="salvar-dados-button"
                type="primary"
                loading={loading}
                htmlType="submit"
              >
                Salvar dados
              </Button>

              <Button
                className="alterar-senha-button"
                type="default"
                htmlType="button"
              >
                Alterar senha
              </Button>
            </div>
            <div>
              <Button
                className="desativar-conta-senha-button"
                type="primary"
                htmlType="button"
                onClick={() => setOpenModalDesativarConta(true)}
              >
                Desativar conta
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </Space>
  );
}
