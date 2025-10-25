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
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/exames/seusExames" element={<SeusExamesPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
