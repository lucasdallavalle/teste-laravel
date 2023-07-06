# Teste Técnico Lucas Valle

Este projeto é um exemplo de aplicação desenvolvida utilizando Laravel e ReactJS, com objetivo de avaliação e demonstração de conhecimento.

## Requisitos do Sistema

- Versão do Laravel: ^10.10
- Versão do ReactJS: ^18.2.0
- Versão do Node: v20.3.1
- Versão do PHP: 8.1

## Configuração do Ambiente

Siga as etapas abaixo para configurar o ambiente necessário para executar o projeto.

### 1. Clonar o repositório

Clone este repositório usando o comando:

git clone https://github.com/lucasdallavalle/teste-laravel.git

### 2. Instalar as dependências

Navegue até o diretório raiz do projeto e instale as dependências do Laravel:

composer install

Em seguida, navegue até o diretório do frontend e instale as dependências do ReactJS:

cd frontend
npm install

### 3. Configurar o ambiente

- Crie uma cópia do arquivo `.env.example` e renomeie-o para `.env`. Este arquivo contém as configurações de ambiente necessárias para o Laravel.
- Abra o arquivo `.env` e configure as informações de banco de dados de acordo com as configurações do seu ambiente.

### 4. Gerar chave de criptografia

No diretório raiz do projeto, execute o seguinte comando para gerar uma chave de criptografia para o Laravel:

php artisan key:generate

### 5. Executar as migrações

Execute as migrações do banco de dados para criar as tabelas necessárias. No diretório raiz do projeto, execute o seguinte comando:

php artisan migrate

## Executando o Projeto

Após concluir as etapas de configuração, você pode executar o projeto utilizando os seguintes comandos.

### 1. Iniciar o servidor Laravel

No diretório raiz do projeto, execute o seguinte comando para iniciar o servidor do Laravel:

php artisan serve

O servidor será iniciado na URL `http://localhost:8000`.

### 2. Iniciar o servidor de desenvolvimento do ReactJS

Abra uma nova janela do terminal, execute este comando na raíz do projeto

npm run dev
