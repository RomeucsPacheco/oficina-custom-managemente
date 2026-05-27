Markdown
# ⚙️ Oficina Custom - Management System

Um sistema de gerenciamento ponta a ponta (End-to-End) desenvolvido para oficinas de customização automotiva, focado em performance, estética e projetos de som de alta velocidade. O sistema conta com uma API REST robusta, banco de dados relacional e duas interfaces de usuário: um site institucional público e um painel administrativo completo com operações de CRUD.

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
🗄️ Modelo de Dados (Relacionamentos)
O banco de dados relacional oficina_db foi modelado para garantir integridade referencial:

Cliente (1 : N) Veículo: Um cliente pode ter vários veículos cadastrados, mas um veículo pertence a apenas um cliente.

Veículo (1 : N) Agendamento: Um veículo pode ter várias ordens de serviço/agendamentos históricos.

Serviço (1 : N) Agendamento: Um serviço do catálogo pode ser vinculado a múltiplos agendamentos diferentes.

🚀 Como Executar o Projeto Localmente
Pré-requisitos
Java 21 instalado.

MySQL Server ativo no computador.

MySQL Workbench (ou ferramenta equivalente).

1. Configurando o Banco de Dados
Abra o seu terminal do MySQL ou Workbench e certifique-se de criar o esquema do banco:

SQL
CREATE DATABASE oficina_db;
2. Configurando o Backend
Abra o arquivo src/main/resources/application.properties e ajuste as credenciais de acesso ao seu MySQL local:

Properties
spring.datasource.url=jdbc:mysql://localhost:3306/oficina_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=SUA_SENHA_AQUI
3. Executando a API Spring Boot
Na pasta raiz do projeto, execute o comando abaixo no terminal para compilar e subir o servidor:

Bash
./mvnw spring-boot:run
O backend estará rodando e escutando requisições na porta 8080 (http://localhost:8080). O Hibernate criará todas as tabelas automaticamente no primeiro início.

4. Executando o Frontend
Não é necessário instalar servidores de páginas.

Navegue até a pasta frontend/.

Dê um duplo clique no arquivo index.html para abrir o site público no seu navegador de preferência.

Utilize o menu de navegação superior para acessar e gerenciar as telas do Painel Administrativo.

📈 Funcionalidades Prontas
Site Institucional: Home page contendo 4 seções estratégicas detalhando as especialidades da oficina, portfólio de projetos concluídos e localização.

CRUD Completo (4 Entidades): Telas interativas para Cadastrar, Listar, Editar e Excluir dados de:

Clientes (Nome, Telefone, E-mail).

Veículos (Marca, Modelo, Ano, Placa e Vínculo com o Dono).

Catálogo de Serviços (Nome do Serviço, Categoria, Preço Base e Horas Estimadas).

Agendamentos / Ordens de Serviço (Vínculo de Carro, Serviço Escolhido, Data, Observações do Projeto e Status em tempo real).

Persistência Reativa: Operações efetuadas na interface refletem instantaneamente no banco de dados através de chamadas assíncronas assinaladas pelo JavaScript.

Desenvolvido como projeto prático avaliativo aplicado à disciplina de desenvolvimento de sistemas acadêmicos.
