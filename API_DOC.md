# Documentação da API - Seguro de Carros Backend

Esta documentação descreve as rotas, autenticação e funcionalidades principais da API do sistema de seguro de carros.

## Autenticação

A API utiliza autenticação JWT. Para acessar rotas protegidas, obtenha um token via login e envie no header `Authorization: Bearer <token>`.

### Login
- **POST** `/auth/login`
  - **Body:**
    ```json
    {
      "email": "usuario@exemplo.com",
      "senha": "suaSenha"
    }
    ```
  - **Resposta:**
    ```json
    {
      "access_token": "<jwt_token>"
    }
    ```

## Rotas Principais

### Clientes
- **GET** `/cliente` — Lista todos os clientes (protegido)
- **POST** `/cliente` — Cria um novo cliente (protegido)
- **GET** `/cliente/:id` — Busca cliente por ID (protegido)

### Veículos
- **GET** `/veiculo` — Lista todos os veículos (protegido)
- **POST** `/veiculo` — Cria um novo veículo (protegido)
- **GET** `/veiculo/:id` — Busca veículo por ID (protegido)

### Apólices
- **GET** `/apolice` — Lista todas as apólices (protegido)
- **POST** `/apolice` — Cria uma nova apólice (protegido)
  - **Body exemplo:**
    ```json
    {
      "cliente": { "id": 1 },
      "veiculo": { "id": 1 },
      "valor": 1000.0
    }
    ```
- **GET** `/apolice/:id` — Busca apólice por ID (protegido)
- **GET** `/apolice/numero/:numeroApolice` — Busca apólice pelo número (protegido)
- **PUT** `/apolice/:id` — Atualiza apólice (protegido)
- **DELETE** `/apolice/:id` — Remove apólice (protegido)

## Funcionalidade Específica: Cálculo do Valor da Apólice

Ao criar uma apólice, o valor pode ser ajustado automaticamente conforme o ano do veículo:
- Se o veículo tiver mais de 10 anos, o valor base informado será reduzido em 20%.
- Caso contrário, o valor permanece igual ao informado.

**Exemplo de cálculo:**
```typescript
const anoAtual = new Date().getFullYear();
const idadeVeiculo = anoAtual - veiculo.ano;
if (idadeVeiculo > 10) {
  return valorBase * 0.80;
}
return valorBase;
```

## Observações
- Todas as rotas (exceto login) exigem autenticação JWT.
- Utilize o token JWT no header para acessar as rotas protegidas.
- Os relacionamentos entre apólice, cliente e veículo são feitos via IDs.

---

Para dúvidas ou mais detalhes, consulte o backend ou entre em contato com o desenvolvedor responsável.