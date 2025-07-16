# 💇 CRM para Salões de Beleza

🚀 Um sistema completo de gestão para salões de beleza, desenvolvido com foco em automação, escalabilidade e uma experiência fluida para o usuário.

Este projeto surgiu da necessidade de simplificar o controle de agendamentos, relatórios financeiros e comunicação com clientes em um ambiente visual moderno e acessível.

## ✨ Funcionalidades

* 📊 **Relatórios em tempo real** (React Native)
* 💬 **Bot de mensagens automatizadas via WhatsApp** (Twilio)
* 📦 **Hospedagem escalável** com Docker + Render
* 🗃️ **Banco de dados robusto** com PostgreSQL
* 🔒 Arquitetura sólida e segura com **NestJS**

## 📱 Tecnologias Utilizadas

<div style="display: inline_block">
  <a href="https://reactnative.dev/">
    <img src="https://img.shields.io/badge/React_Native-%2361DAFB.svg?&style=for-the-badge&logo=react&logoColor=black" alt="React Native"/>
  </a>
  <a href="https://nestjs.com/">
    <img src="https://img.shields.io/badge/NestJS-%23E0234E.svg?&style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  </a>
  <a href="https://www.docker.com/">
    <img src="https://img.shields.io/badge/Docker-%230db7ed.svg?&style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  </a>
  <a href="https://www.postgresql.org/">
    <img src="https://img.shields.io/badge/PostgreSQL-%23336791.svg?&style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  </a>
  <a href="https://www.twilio.com/">
    <img src="https://img.shields.io/badge/Twilio-%23F22F46.svg?&style=for-the-badge&logo=twilio&logoColor=white" alt="Twilio"/>
  </a>
</div>

## ⚙️ Arquitetura

```bash
Frontend (mobile): React Native
Backend: NestJS (REST API)
Banco de Dados: PostgreSQL
Infraestrutura: Docker + Render
Comunicação: Twilio WhatsApp Bot
```

## 📦 Como Rodar o Projeto

> **Pré-requisitos:** Node.js, Docker, Yarn/NPM, PostgreSQL ou Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` com base no `.env.example`.

### 3. Suba os containers (backend + banco)

```bash
docker-compose up -d
```

### 4. Rode o app mobile (React Native)

```bash
cd app
yarn install
npx expo start
```

---

## 📈 Roadmap (Próximas funcionalidades)

* [ ] Integração com calendário para agendamentos
* [ ] Painel web para administradores
* [ ] Sistema de fidelidade por pontuação
* [ ] Dashboard financeiro com gráficos

---

## 🤝 Contribuições

Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

## 🔗 Links

* 🧑‍💻 Desenvolvedor: [Fabricio Bastos Cardoso](https://github.com/fabriciobast)
