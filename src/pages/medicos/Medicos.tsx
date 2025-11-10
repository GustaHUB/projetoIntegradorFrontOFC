import { useEffect, useState } from "react";

//componentes antd
import { Card, Typography, Table, Button, Space } from "antd";

import type { ColumnsType } from "antd/es/table";

//data
import dayjs, { Dayjs } from "dayjs";

//api
import { buscarCategoria } from "../../services/apiInterna/Categorias";

//interface
import type { ExameRow } from "../../services/interfaces/Interfaces";

//componentes
import { showMessage } from "../../components/messageHelper/ShowMessage";

const { Title, Paragraph } = Typography;

export default function SeusExames() {
  const [loading, setLoading] = useState(false);

  // CARREGAR MEDICOS
  useEffect(() => {
    async function carregarMedicos() {
      try {
        setLoading(true);
        const categorias = await buscarCategoria();
      } catch (err: any) {
        showMessage("Erro ao carregar categorias.", "error");
      } finally {
        setLoading(false);
      }
    }
    carregarMedicos();
  }, []);

  const colunas: ColumnsType<ExameRow> = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    { title: "Especialidade", dataIndex: "categoria", key: "categoria" },
    { title: "CRM", dataIndex: "crm", key: "crm" },
    {
      title: "Autorizado em",
      dataIndex: "dataAutorizacao",
      key: "dataAutorizacao",
      sorter: (a, b) => dayjs(a.rawDate).valueOf() - dayjs(b.rawDate).valueOf(),
      defaultSortOrder: "ascend",
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Space>
          <Button
            danger
            size="small"
            onClick={() => console.log("deletar", record.key)}
          >
            Cancelar acesso
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
        ></div>

        <Table
          rowKey="key"
          columns={colunas}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
