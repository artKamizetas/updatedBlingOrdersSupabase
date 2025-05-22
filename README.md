# 📦 updatedBlingOrdersSupabase

**Sincronização automatizada de pedidos do Bling com Supabase via Edge Functions**

---

## 🧭 Visão Geral

Este projeto utiliza uma **Edge Function** do Supabase para integrar com a API do Bling utilizando autenticação OAuth 2.0.  
A função é executada periodicamente através de um **Cron Job** configurado no Supabase, buscando pedidos do dia no Bling e atualizando a base de dados no Supabase, especificamente na tabela `Bling`.

---

## 🚀 Tecnologias Utilizadas

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Deno](https://deno.land/)
- [Bling API](https://developer.bling.com.br/referencia#/)
- [Supabase Cron Jobs](https://supabase.com/docs/guides/cron)
- OAuth 2.0 para autenticação com o Bling

---

## 📁 Estrutura do Projeto

```
supabase/
├── functions/
│   └── updateBlingOrders/
│       ├── env/
│       │   └── index.ts            # Variáveis de ambiente utilizadas na função
|       ├── middleware/
│       │   └── auth-bling.ts
|       │   └── auth-supabase.ts
|       ├── service/
|       |   ├──api/
│       │   |  └── bling_service_api.ts
│       │   |  └── supabase_service_api.ts 
|       │   └── client_service.ts
|       │   └── item_service.ts
|       │   └── loja_service.ts
|       │   └── pedido_service.ts
|       │   └── produto_service.ts
|       │   └── status_vendas_service.ts
|       │   └── vendedor_service.ts
|       ├── types/
|       |   ├──bling/
|       |   ├──supabase/
|       ├── utils/
|       │   └── index.ts
│       ├── handler.ts              # Lógica principal da função
│       └── index.ts                # Ponto de entrada da função
|       └── .env                    # Variáveis de ambiente locais (não versionadas)
└── config.toml                     # Configurações do Supabase
```

---

## ⚙️ Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/artKamizetas/updatedBlingOrdersSupabase.git
cd updatedBlingOrdersSupabase
```

### 2. Instalar o Supabase CLI

```bash
npm install -g supabase
```

### 3. Autenticar no Supabase

```bash
supabase login
```

### 4. Vincular ao Projeto Supabase

```bash
supabase link --project-ref <seu-project-ref>
```

> Substitua `<seu-project-ref>` pelo identificador do seu projeto no Supabase.

### 5. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env

CLIENTID_BLING=seu_client_id
SECRET_KEY_BLING=seu_client_secret
MY_SUPABASE_KEY=seu_anon_key_supabase
MY_SUPABASE_URL=seu_url_supabase
MY_SUPABASE_PASSWORD=seu_user_password_supabase
MY_SUPABASE_EMAIL= seu_user_email_supabase

```

> **Importante:** Nunca suba este arquivo para o repositório. Mantenha `.env` no `.gitignore`.

---

## 🧪 Executando Localmente

```bash
supabase functions serve updateBlingOrders --env-file .env
```

---

## 🚀 Deploy da Função

```bash
supabase functions deploy updateBlingOrders
```

---

## ⏰ Agendamento com Cron Job

### 1. Acesse o painel do Supabase
- Vá até **"Edge Functions"** > **"Cron"**
- Na ação, selecione **"Invoke Edge Function"** e escolha `updateBlingOrders`.
---

## 🔐 Variáveis de Ambiente (Mapeadas)

As variáveis utilizadas  são:

- `MY_SUPABASE_EMAIL`
- `MY_SUPABASE_PASSWORD`
- `MY_SUPABASE_URL`
- `MY_SUPABASE_KEY`
- `CLIENTID_BLING`
- `SECRET_KEY_BLING`

Essas variáveis são responsáveis por:

- Autenticação com o Bling via OAuth 2.0
- Permissão de escrita segura no Supabase 

---

## 📊 Logs e Monitoramento

Os logs de execução da função podem ser acessados no painel do Supabase, dentro da seção **Edge Functions > updateBlingOrders**.  
Utilize os logs para acompanhar execuções, falhas e desempenho da sincronização.

---

## 🔐 Senhas e Tokens

Todas as credenciais utilizadas neste projeto estão documentadas e armazenadas de forma segura.  
Consulte a documentação interna da ArtKamizetas para mais detalhes sobre o local onde estão as senhas.

---

## 📝 Contribuindo

1. Faça um fork do projeto.
2. Crie uma branch para sua feature:  
   `git checkout -b minha-feature`
3. Commit suas alterações:  
   `git commit -m 'feat: minha feature'`
4. Push para a branch:  
   `git push origin minha-feature`
5. Abra um Pull Request

---


Desenvolvido com 💛 pela equipe **ArtKamizetas**
