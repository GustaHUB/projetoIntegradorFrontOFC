import { useEffect, useMemo, useState } from "react";

//componentes antd
import {
  Card,
  Typography,
  Table,
  Button,
  Space,
  Select,
  DatePicker,
  Tabs,
  type TabsProps,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

//data
import dayjs, { Dayjs } from "dayjs";

//api
import {
  buscarExames,
  deletarExame,
} from "../../../services/apiInterna/Exames";
import { api } from "../../../services/api";
import { buscarCategoria } from "../../../services/apiInterna/Categorias";

//interface
import type { ExameRow } from "../../../services/interfaces/Interfaces";

//componentes
import { showMessage } from "../../../components/messageHelper/ShowMessage";

//modals
import CadatrarCategoria from "../../../components/modals/cadastrarCategoria/CadastrarCategoria";
import AvisoExclusaoModal from "../../../components/modals/avisoExclusão/AvisoExclusao";

import "./SeusExames.scss";

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

export default function SeusExames() {
  const [loading, setLoading] = useState(false);
  const [openModalAvisoExclusao, setOpenModalAvisoExclusao] = useState(false);
  const [rows, setRows] = useState<ExameRow[]>([]);
  const [tab, setTab] = useState<string>("Todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | undefined>();
  const [exameSelecionadoId, setExameSelecionadoId] = useState<string | null>(
    null
  );
  const [periodo, setPeriodo] = useState<[Dayjs, Dayjs] | null>(null);
  const [cat, setCat] = useState<{ value: string; label: string }[]>([]);
  const [openModalCadastrarCategoria, setModalCadastrarCategoria] =
    useState(false);

  const closeModalCadastrarCat = () => {
    setModalCadastrarCategoria(false);
  };

  const closeModalAvisoExclusao = () => {
    setOpenModalAvisoExclusao(false);
  };

  // AO CLICAR EM VER EXAME
  async function verExame(record: ExameRow) {
    try {
      if (!record.url) return;

      const urlAbsoluta = record.url;

      const resp = await api.get(urlAbsoluta, {
        responseType: "blob",
      });

      const contentType =
        resp.headers["content-type"] || "application/octet-stream";
      const blob = new Blob([resp.data], { type: contentType });
      const fileURL = URL.createObjectURL(blob);

      window.open(fileURL, "_blank", "noopener,noreferrer");

      setTimeout(() => URL.revokeObjectURL(fileURL), 60_000);
    } catch (e) {
      showMessage(
        "Não foi possível abrir o exame. Verifique seu login e tente novamente.",
        "error"
      );
    }
  }

  // FUNÇÃO PARA DELETAR EXAME
  async function excluirExameSelecionado() {
    if (!exameSelecionadoId) return;

    try {
      const payload = {
        exame_id: exameSelecionadoId,
      };

      await deletarExame(payload);

      showMessage("Exame deletado com sucesso.", "success");

      setRows((prev) => prev.filter((r) => r.key !== exameSelecionadoId));

      setOpenModalAvisoExclusao(false);
      setExameSelecionadoId(null);
    } catch (err: any) {
      showMessage("Erro ao deletar exame.", "error");
    }
  }

  // FILTROS
  const dataFiltrada = useMemo(() => {
    let arr = [...rows];

    if (tab !== "Todos") {
      const id = parseInt(tab, 10);
      if (!Number.isNaN(id)) {
        arr = arr.filter((r) => r.categoriaId === id);
      }
    }

    if (categoriaFiltro) {
      const id = parseInt(categoriaFiltro, 10);
      if (!Number.isNaN(id)) {
        arr = arr.filter((r) => r.categoriaId === id);
      }
    }

    if (periodo) {
      const [ini, fim] = periodo;
      arr = arr.filter((r) => {
        const d = dayjs(r.rawDate);
        return (
          d.isValid() &&
          d.isAfter(ini.startOf("day")) &&
          d.isBefore(fim.endOf("day"))
        );
      });
    }

    return arr;
  }, [rows, tab, categoriaFiltro, periodo]);

  // ARRAY PARA OS TABS ITENS
  const tabItems: TabsProps["items"] = useMemo(
    () => [
      { key: "Todos", label: "Todos" },
      ...cat.map((c) => ({ key: c.value, label: c.label })),
    ],
    [cat]
  );

  useEffect(() => {
    async function carregarExames() {
      try {
        setLoading(true);
        const resp = await buscarExames();
        const data = resp.data || [];
        const mapped: ExameRow[] = data.map((it: any) => {
          const catNome = it.nome;
          const url = it.arquivo_exame;
          const d = dayjs(it.data_realizacao);
          return {
            key: String(it.exame_id),
            exame: it.nome_exame || it.nome,
            categoria: catNome,
            dataRealizacao: d.isValid()
              ? d.format("DD/MM/YYYY")
              : it.data_realizacao,
            local: it.nome_lab,
            url,
            categoriaId: it.categoria_id,
            rawDate: it.data_realizacao,
          };
        });
        setRows(mapped);
      } finally {
        setLoading(false);
      }
    }
    carregarExames();
  }, []);

  // CARREGAR CATEGORIAS
  useEffect(() => {
    async function carregarCategorias() {
      console.log(tab);
      try {
        setLoading(true);
        const categorias = await buscarCategoria();
        setCat(
          categorias.data.map((e: any) => ({
            value: String(e.id ?? e.categoria_id),
            label: e.nome ?? e.nome_categoria,
          }))
        );
      } catch (err: any) {
        showMessage("Erro ao carregar categorias.", "error");
      } finally {
        setLoading(false);
      }
    }
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      setLoading(true);
      const categorias = await buscarCategoria();
      setCat(
        categorias.data.map((e: any) => ({
          value: String(e.id ?? e.categoria_id),
          label: e.nome ?? e.nome_categoria,
        }))
      );
    } catch (err: any) {
      showMessage("Erro ao carregar categorias.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  const colunas: ColumnsType<ExameRow> = [
    {
      title: "Exame",
      dataIndex: "exame",
      key: "exame",
      sorter: (a, b) => dayjs(a.rawDate).valueOf() - dayjs(b.rawDate).valueOf(),
      defaultSortOrder: "ascend",
    },
    { title: "Categoria", dataIndex: "categoria", key: "categoria" },
    {
      title: "Data realização",
      dataIndex: "dataRealizacao",
      key: "dataRealizacao",
      sorter: (a, b) => dayjs(a.rawDate).valueOf() - dayjs(b.rawDate).valueOf(),
      defaultSortOrder: "ascend",
    },
    { title: "Local", dataIndex: "local", key: "local" },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Space>
          <Button
            danger
            style={{ borderColor: "#ef4444", color: "#ef4444" }}
            onClick={() => {
              setExameSelecionadoId(String(record.key));
              setOpenModalAvisoExclusao(true);
            }}
          >
            Deletar
          </Button>
          <Button
            className="button-ver-exame"
            type="primary"
            onClick={() => verExame(record)}
            disabled={!record.url}
          >
            Ver exame
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Title>Seus Exames</Title>
        <Paragraph>
          Use as categorias acima da tabela para filtrar os resultados. Você
          pode buscar por nome, status e período.
        </Paragraph>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div className="container-categoria">
            <Tabs
              defaultActiveKey="Todos"
              items={tabItems}
              onChange={(k) => setTab(k)}
            />
            <PlusCircleOutlined
              onClick={() => setModalCadastrarCategoria(true)}
            />
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Select
              placeholder="Categoria"
              style={{ width: 200 }}
              options={cat}
              onChange={(v) => setCategoriaFiltro(v)}
              allowClear
            />
            <RangePicker
              placeholder={["Data inicial", "Data final"]}
              onChange={(v) => setPeriodo(v as any)}
              format="DD/MM/YYYY"
            />
          </div>
        </div>

        <Table
          rowKey="key"
          columns={colunas}
          dataSource={dataFiltrada}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <CadatrarCategoria
        open={openModalCadastrarCategoria}
        onClose={() => closeModalCadastrarCat()}
        onSuccess={carregarCategorias}
      />

      <AvisoExclusaoModal
        onClose={closeModalAvisoExclusao}
        open={openModalAvisoExclusao}
        onSubmit={excluirExameSelecionado}
      />
    </div>
  );
}
