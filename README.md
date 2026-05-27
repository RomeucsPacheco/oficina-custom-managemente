# ⚙️ Oficina Custom - Management System

Um sistema de gerenciamento ponta a ponta (End-to-End) desenvolvido para oficinas de customização automotiva, focado em performance, estética e projetos de som de alta fidelidade. O sistema conta com uma API REST robusta, banco de dados relacional e duas interfaces de usuário: um site institucional público e um painel administrativo completo com operações de CRUD.

---

## 🛠️ Tecnologias Utilizadas

### Backend (API REST)
* **Java 21**
* **Spring Boot 4.x / 3.x**
* **Spring Data JPA** (Persistência e mapeamento objeto-relacional)
* **Spring Web** (Criação de endpoints REST)
* **Driver MySQL Connector/J**

### Frontend (Web)
* **HTML5** (Estruturação semântica)
* **CSS3** (Estilização moderna com tema Dark, layout responsivo e Flexbox/Grid)
* **JavaScript (ES6+)** (Consumo assíncrono de APIs utilizando `Async/Await` e `Fetch API`)

### Banco de Dados
* **MySQL 8.0** (Banco de dados relacional local)

---

## 📐 Estrutura de Arquivos do Projeto

A arquitetura do projeto divide de forma limpa as responsabilidades de Backend e Frontend:

```text
demo/
├── frontend/                  # Camada de Visão (Frontend)
│   ├── js/
│   │   ├── clientes.js        # Lógica de integração da API de Clientes
│   │   ├── veiculos.js        # Lógica de integração da API de Veículos
│   │   ├── servicos.js        # Lógica de integração da API de Serviços
│   │   └── agendamentos.js    # Lógica de integração da API de Agendamentos
│   ├── index.html             # Site Público Institutional (4 Seções)
│   ├── clientes.html          # Painel de Controle: Clientes
│   ├── veiculos.html          # Painel de Controle: Veículos
│   ├── servicos.html          # Painel de Controle: Serviços
│   ├── agendamentos.html      # Painel de Controle: Ordens de Serviço
│   └── style.css              # Identidade visual unificada (Tema Dark)
├── src/                       # Camada de Negócio (Backend Java)
│   └── main/java/com/example/demo/
│       ├── controller/        # Endpoints expostos (@RestController)
│       ├── model/             # Entidades mapeadas pelo Hibernate (@Entity)
│       └── repository/        # Interfaces de persistência (JpaRepository)
├── mvnw                       # Maven Wrapper
└── pom.xml                    # Gerenciador de dependências do ecossistema Maven
