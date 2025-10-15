# MedExame — Guia de Execução do Projeto (Frontend)

Este repositório contém o frontend do **MedExame**, criado com **React + TypeScript** e empacotado com **Vite**.

## Requisitos de ambiente

- **Node.js**: **>= 18** (recomendado **Node 20 LTS**)
- **npm**: **>= 9** (vem com o Node LTS)
- Sistema operacional: Windows, macOS ou Linux

Gerenciador de pacotes: **npm** 

## Como rodar o projeto

### 1- Clonar e entrar na pasta
```bash
git clone <URL_DO_REPOSITORIO>
cd ProjetoIntegrador/medExame
```

### 2- (Opcional) Selecionar a versão do Node com nvm
```bash
nvm install 20
nvm use 20
```

### 3- Instalar as dependências
```bash
npm install
```

### 4- Rodar em modo desenvolvimento (HMR)
```bash
npm run dev
```
- O Vite exibirá uma URL local (ex.: `http://localhost:5173`). Acesse no navegador.

## Variáveis de ambiente

- Por enquanto não tem


## Solução de problemas (FAQ)

- **Erro de versão do Node/Vite**: atualize para **Node >= 18** (recomendado 20 LTS).
- **Porta em uso**: rode `npm run dev -- --port 5174` (ou outra porta livre).
- **Estilos/Sass não aplicando**: garanta que `sass` está instalado (já está no `package.json`) e que os imports `*.scss` estão corretos.
- **Imports absolutos/paths**: confira opções em `tsconfig*.json` caso deseje alias de paths.

