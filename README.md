# 🚀 IbiapabaExpress

O **IbiapabaExpress** é uma plataforma móvel e web de logística inteligente, entregas rápidas e comércio local desenvolvida especificamente para a região da **Serra da Ibiapaba** (Ceará). O sistema conta com painéis de controlo avançados para administradores, gestão de parceiros (comércios, oficinas e lojas) e adaptação operacional em tempo real baseada em condições climáticas (modo chuva/neblina).

---

## 🌟 Funcionalidades Principais

- **Painel AdminControl Pro:** Torre de controlo centralizada para administradores gerirem a operação município a município na Serra da Ibiapaba.
- **Gatilho Operacional de Clima:** Modos dinâmicos para chuva e neblina que ajustam automaticamente parâmetros logísticos e tarifas de entrega.
- **Painel do Parceiro (Padrão iFood):** Registo simplificado e seguro de comércios utilizando **CPF, MEI ou CNPJ**.
- **Gestão de Catálogo:** Ferramenta para lojistas adicionarem fotos, preços e especificações detalhadas dos seus produtos para os clientes finais.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com uma arquitetura moderna e focada em performance mobile-first:

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend & Base de Dados:** Supabase (PostgreSQL, Row Level Security, Autenticação)
- **Deploy & CI/CD:** Vercel integrado com GitHub

---

## 📂 Estrutura do Projeto

```text
src/
├── components/
│   ├── AdminControlPro.tsx    # Painel de Controlo do Administrador Geral
│   └── PartnerDashboard.tsx   # Painel de Registo e Gestão de Produtos do Parceiro
├── lib/
│   └── supabase.ts            # Configuração de conexão com o Supabase
├── App.tsx                    # Componente principal de rotas e visualização
└── main.tsx                   # Ponto de entrada da aplicação
