import { useState } from "react";

//componentes antd
import {
  Layout,
  Menu,
  Input,
  Button,
  Dropdown,
  type MenuProps,
  Avatar,
} from "antd";

//icons
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

//rotas
import { Outlet, useLocation, useNavigate } from "react-router-dom";

//imagens
import logo from "../../assets/health-and-care.png";

//constants
import { items } from "../../utils/Constants";

import "./AppLayout.scss";

const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;

const SIDER_WIDTH = 220;

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const isLogged = Boolean(localStorage.getItem("token"));
  const userName = localStorage.getItem("primeiroNomeUsuario") || "Usuário";

  // FUNÇÃO PARA ABRIR MENU LATERAL NO CLICK E TIRAR A AÇÃO DE ABRIR/FECHAR AO CLICAR EM ALGUM ELEMENTO DO MENU
  const abrirMenuLateral = (e: any) => {
    const el = e.target as HTMLElement;
    const clickedInsideMenu = el.closest(".ant-menu");
    const clickedOnTrigger = el.closest(".ant-layout-sider-trigger");
    if (clickedInsideMenu || clickedOnTrigger) return;
    setCollapsed((c) => !c);
  };

  // FUNÇÃO PARA DESLOGAR E LIMPAR LOCALSTORAGE
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "perfil",
      label: "Meu perfil",
      icon: <UserOutlined />,
      onClick: () => navigate("/perfil"),
    },
    { key: "logout", label: "Sair", danger: true, onClick: handleLogout },
  ];

  const navigateToHome = () => {
    navigate("/home");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Sider
        theme="dark"
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={SIDER_WIDTH}
        collapsedWidth={60}
        breakpoint="sm"
        onBreakpoint={(broken) => setCollapsed(broken)}
        style={{
          position: "fixed",
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          zIndex: 200,
        }}
        onClick={abrirMenuLateral}
        // onMouseEnter={() => setCollapsed(false)}
        // onMouseLeave={() => setCollapsed(true)}
      >
        <div className="titulo-menu-lateral">
          {collapsed ? "ME" : "MedExame"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={items}
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key as string)}
        />
      </Sider>

      <Layout
        className={`second-layout ${collapsed ? "collapsed" : "expanded"}`}
      >
        <Header className="app-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button
              className="button-abrir-menu"
              type="text"
              onClick={() => setCollapsed((c) => !c)}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              style={{ fontSize: 18 }}
            />

            <img
              className="logo"
              src={logo}
              alt="logo"
              style={{ height: 28 }}
            />
            <div className="title-up-header">
              <span onClick={navigateToHome} className="primera-palavra-header">
                Med
              </span>
              <span onClick={navigateToHome} className="segunda-palavra-header">
                Exame
              </span>
            </div>
          </div>

          <div className="search-header">
            <Search
              placeholder="Buscar..."
              allowClear
              style={{ width: "60%" }}
            />
          </div>

          <div className="avatar-login">
            {isLogged ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button
                  type="text"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#0f172a",
                    fontWeight: 500,
                  }}
                >
                  <Avatar
                    size={32}
                    style={{
                      backgroundColor: "#2f4892",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                    icon={<UserOutlined />}
                  />
                  {`Olá,${userName}`}
                </Button>
              </Dropdown>
            ) : (
              <Button
                type="text"
                icon={<UserOutlined />}
                onClick={() => navigate("/")}
              >
                Login
              </Button>
            )}
          </div>
        </Header>

        <Content style={{ flex: 1, padding: "24px 24px 0" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer className="app-footer">
          MedExame ©{2024} • Todos os direitos reservados
        </Footer>
      </Layout>
    </Layout>
  );
}
