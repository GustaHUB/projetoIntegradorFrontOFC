import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";

//telas
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Perfil from "./pages/perfil/Perfil";
import AppLayout from "./components/layoutPadrao/AppLayout";
import PrivateRoute from "./utils/PrivateRoute";
import SeusExamesPage from "./pages/exames/seusExames/SeusExames";

//config data para português
import ptBR from "antd/es/locale/pt_BR";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import Medicos from "./pages/medicos/Medicos";
import Configuracoes from "./pages/configuracoes/Configuracoes";
import CadastrarExames from "./pages/exames/cadastrarExames/CadastrarExames";

dayjs.locale("pt-br");

function App() {
  return (
    <ConfigProvider locale={ptBR}>
      <Router>
        <Routes>
          {/* pública */}
          <Route path="/" element={<Login />} />

          {/* protegidas */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/exames/seusExames" element={<SeusExamesPage />} />
              <Route path="/exames/cadastrar" element={<CadastrarExames />} />
              <Route path="/medicos" element={<Medicos />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
