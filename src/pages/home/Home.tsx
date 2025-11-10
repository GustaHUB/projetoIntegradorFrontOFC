import { Carousel, Card, Row, Col } from "antd";
import {
  FileAddOutlined,
  FileSearchOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import banner from "../../assets/banner.png";

export default function Home() {
  const navigate = useNavigate();

  const atalhos = [
    {
      key: "cadastrar-exame",
      title: "Cadastrar exame",
      description: "Envie novos exames em poucos cliques.",
      icon: <FileAddOutlined style={{ fontSize: 26 }} />,
      onClick: () => navigate("/exames/cadastrar"),
    },
    {
      key: "seus-exames",
      title: "Seus exames",
      description: "Consulte todos os exames já enviados.",
      icon: <FileSearchOutlined style={{ fontSize: 26 }} />,
      onClick: () => navigate("/exames/seusExames"),
    },
    {
      key: "medicos",
      title: "Médicos vinculados",
      description: "Gerencie médicos com acesso aos seus exames.",
      icon: <UserSwitchOutlined style={{ fontSize: 26 }} />,
      onClick: () => navigate("/medicos"),
    },
    {
      key: "perfil",
      title: "Perfil",
      description: "Atualize seus dados pessoais e de acesso.",
      icon: <UserOutlined style={{ fontSize: 26 }} />,
      onClick: () => navigate("/perfil"),
    },
    {
      key: "configuracoes",
      title: "Configurações",
      description: "Ajuste notificações, segurança e preferências.",
      icon: <SettingOutlined style={{ fontSize: 26 }} />,
      onClick: () => navigate("/configuracoes"),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Home</h1>
        <p style={{ margin: "4px 0 0", color: "#666" }}>
          Acesse rapidamente as principais funcionalidades.
        </p>
      </div>

      <Carousel autoplay arrows draggable={false} dotPosition="bottom" autoplaySpeed={5000} >
        <div>
          <img
            src={banner}
            alt="Banner MedExame"
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: 12,
            }}
          />
        </div>
        <div>
          <img
            src={banner}
            alt="Banner MedExame"
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: 12,
            }}
          />
        </div>
        <div>
          <img
            src={banner}
            alt="Banner MedExame"
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: 12,
            }}
          />
        </div>
      </Carousel>

      {/* Atalhos rápidos */}
      <div style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          {atalhos.map((item) => (
            <Col
              key={item.key}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              onClick={item.onClick}
            >
              <Card
                hoverable
                style={{ height: "100%", borderRadius: 12 }}
                bodyStyle={{ display: "flex", gap: 12, alignItems: "center" }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f5f5",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#777",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}
