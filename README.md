# ⛪ Portal Oficial & Sistema de Gestão Eclesiástica - Igreja O Brasil Para Cristo (Rio Largo - AL)

Sistema web moderno e responsivo para portal público institucional e painel administrativo integrado (Gabinete Pastoral, Secretaria, Tesouraria & CRM de Membros) da **Igreja Evangélica Pentecostal O Brasil Para Cristo** em Rio Largo - AL.

Desenvolvido por [maximosistemas.com](https://maximosistemas.com).

---

## 📌 Sumário
1. [Visão Geral e Funcionalidades](#-visão-geral-e-funcionalidades)
2. [Arquitetura & Stack Tecnológica](#-arquitetura--stack-tecnológica)
3. [Módulos do Sistema](#-módulos-do-sistema)
4. [Estrutura de Pastas](#-estrutura-de-pastas)
5. [Instalação e Execução Local](#-instalação-e-execução-local)
6. [Configuração de Variáveis de Ambiente](#-configuração-de-variáveis-de-ambiente)
7. [Banco de Dados & Supabase](#-banco-de-dados--supabase)
8. [Pipeline de CI/CD e Deploy Automático (GitHub Actions + Hostinger)](#-pipeline-de-cicd-e-deploy-automático)
9. [Segurança e Sigilo Pastoral](#-segurança-e-sigilo-pastoral)
10. [Documentação Técnica Completa](#-documentação-técnica-completa)

---

## 🚀 Visão Geral e Funcionalidades

### 🌐 Portal Público
- **Hero & Identidade Visual**: Logomarca oficial da OBPC com alta fidelidade, versículos diários e chamada para cultos.
- **Agenda de Cultos & Eventos**: Programação semanal, cultos departamentais (JUBRAC, UFEBRAC, MENBRAC, UCEBRAC) e inscrições em conferências.
- **Galeria Multimídia**: Álbuns de fotos e vídeos integrados ao canal oficial do YouTube e Instagram.
- **Gabinete de Oração Online**: Formulário público para envio de pedidos de oração (com opção de sigilo exclusivo pastoral).
- **Dízimos e Ofertas (PIX)**: Copia e cola de chave PIX, QR Code dinâmico e dados bancários institucionais.
- **História & Raízes**: Seção dedicada à fundação em 1956 pelo Missionário Manoel de Mello.
- **Localização & Contato**: Mapa, endereço oficial no Forene (Rio Largo - AL), WhatsApp pastoral e redes sociais.

### 🛡️ Painel Administrativo Pastoral (Backoffice)
- **Gabinete Eclesiástico**: Dashboard unificado com métricas de membros, cultos, eventos e pedidos de oração.
- **Gestão Financeira & Livro Caixa**: Controle de entradas (dízimos, ofertas, votos) e saídas (despesas operacionais, ajuda de custo, reformas), com geração de relatórios de assembleia e recibos.
- **CRM de Membros**: Cadastro de membros com código sigiloso gerado automaticamente (`MBR-YYYY-XXX`), histórico de contribuições e acompanhamento pastoral.
- **Modo Sigilo Pastoral**: Oculta nomes reais de dizimistas e substitui por códigos anônimos para proteção da privacidade dos fiéis.
- **Gestão de Mídia & Eventos**: Upload de links de fotos e vídeos, criação de pastas e gerenciamento de eventos com contagem regressiva.
- **Controle de Acesso & Auditoria**: Níveis de permissão por função (`pastor`, `tesoureiro`, `secretaria`, `lideranca`) e trilha de auditoria (*Audit Logs*) completa com data, IP simulado e ação executada.

---

## 🛠 Arquitetura & Stack Tecnológica

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) com design system personalizado (Dark Slate, Deep Navy `#040f33`, Gold Accent `#f59e0b`, Green Hope `#70b83b`)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Animações**: [Motion](https://motion.dev/) e CSS Transitions
- **Banco de Dados & Backend**: [Supabase](https://supabase.com/) (PostgreSQL gerenciado, Realtime WebSockets, Row Level Security)
- **Armazenamento de Estado Local**: LocalStorage sincronizado (*Local-First Architecture*) com fallback offline automático
- **CI/CD**: GitHub Actions com deploy automatizado via FTP seguro (`basic-ftp`) para a Hostinger

---

## 📂 Estrutura de Pastas

```text
IgrejaObpc/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline de build e deploy automático para Hostinger
├── public/
│   ├── .htaccess               # Configuração Apache para roteamento SPA e segurança
│   ├── favicon.svg             # Favicon oficial de alto contraste da OBPC
│   ├── obpc-logo.svg           # Logo colorida oficial
│   ├── obpc-logo-white.svg     # Logo branca para fundos escuros
│   ├── obpc-symbol.svg         # Brasão vetorial da OBPC
│   └── pastor-manoel-de-mello.jpg # Foto histórica do fundador
├── src/
│   ├── components/             # Componentes da interface pública
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── DailyVerse.tsx
│   │   ├── SchedulesSection.tsx
│   │   ├── EventsSection.tsx
│   │   ├── MediaSection.tsx
│   │   ├── TithesSection.tsx
│   │   ├── PrayerSection.tsx
│   │   ├── HistorySection.tsx
│   │   ├── ChurchLocationSection.tsx
│   │   ├── Footer.tsx
│   │   └── admin/              # Componentes do Painel Administrativo
│   │       ├── AdminLayout.tsx
│   │       ├── AdminOverview.tsx
│   │       ├── AdminFinancialCRM.tsx
│   │       ├── AdminSchedules.tsx
│   │       ├── AdminEvents.tsx
│   │       ├── AdminMediaManager.tsx
│   │       ├── AdminPrayers.tsx
│   │       ├── AdminUsersManager.tsx
│   │       ├── AdminAuditLogs.tsx
│   │       ├── AdminSupabaseSettings.tsx
│   │       ├── AdminLoginModal.tsx
│   │       └── AssemblyReportModal.tsx
│   ├── context/
│   │   └── ChurchContext.tsx   # Provedor global de estado, cache e sincronização
│   ├── data/
│   │   └── seedData.ts         # Dados iniciais limpos e tipagens fundamentais
│   ├── lib/
│   │   └── supabase.ts         # Cliente Supabase, conector SQL e schemas do banco
│   ├── types/
│   │   └── index.ts            # Definições TypeScript globais
│   ├── App.tsx                 # Raiz da aplicação e chaveamento público/admin
│   ├── index.css               # Estilos globais e tokens Tailwind
│   └── main.tsx                # Bootstrap da aplicação React
├── deploy-ftp.js               # Script Node.js de deploy seguro via FTP
├── index.html                  # HTML base com meta tags, OpenGraph e fontes
├── package.json                # Dependências e scripts npm
├── tsconfig.json               # Configuração do compilador TypeScript
└── vite.config.ts              # Configuração do Vite e plugins
```

---

## 💻 Instalação e Execução Local

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- [Git](https://git-scm.com/)

### 1. Clonar o Repositório
```bash
git clone https://github.com/SidneyMaximo/igrejaobpcriolargo.git
cd IgrejaObpc
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base):
```env
VITE_SUPABASE_URL=https://sua-instancia.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-publica
```

### 4. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse no navegador: `http://localhost:3000`

---

## 🗄️ Banco de Dados & Supabase

O sistema utiliza PostgreSQL no Supabase com suporte a Realtime. As 12 tabelas oficiais são:

| Tabela | Descrição |
| :--- | :--- |
| `church_info` | Dados institucionais, endereço, pastor titular e chaves PIX |
| `weekly_schedules` | Horários e detalhes da programação semanal de cultos |
| `church_events` | Eventos, conferências, congressos e programações especiais |
| `event_registrations` | Inscrições de fiéis nos eventos e conferências da igreja |
| `church_departments` | Gestão de Departamentos & Ministérios (JUBRAC, UFEBRAC, MENBRAC, UCEBRAC, ADOBRAC, Louvor) |
| `media_folders` | Pastas de categorização de álbuns de fotos e vídeos |
| `media_items` | Links e fotos/vídeos da galeria da igreja |
| `prayer_requests` | Pedidos de oração públicos e confidenciais |
| `church_members` | Ficha cadastral e código sigiloso dos membros |
| `financial_transactions`| Livro Caixa: Dízimos, ofertas, entradas e despesas |
| `system_users` | Usuários administrativos e níveis de permissão |
| `audit_logs` | Trilha de auditoria e registro de operações críticas |

O script SQL completo para criação das 12 tabelas e políticas RLS pode ser consultado diretamente em [src/lib/supabase.ts](src/lib/supabase.ts) ou na aba **Configurações & Banco** dentro do painel administrativo.

---

## 🚀 Pipeline de CI/CD e Deploy Automático

O projeto conta com automação contínua via **GitHub Actions** (`.github/workflows/deploy.yml`). A cada `git push` na branch `main`:

1. É iniciado um ambiente Ubuntu no GitHub Actions.
2. As dependências são instaladas de forma reproduzível (`npm ci`).
3. O build de produção é gerado (`npm run build`), injetando automaticamente as variáveis de ambiente do Supabase a partir dos **Secrets** do GitHub.
4. O script `deploy-ftp.js` realiza o upload incremental para a pasta raiz `./` do servidor da Hostinger.

### Secrets Necessários no GitHub:
Configure em: `Repositório > Settings > Secrets and variables > Actions`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `FTP_SERVER` (ou `FTP_HOST`)
- `FTP_USERNAME` (ou `FTP_USER`)
- `FTP_PASSWORD` (ou `FTP_PASS`)

---

## 🔒 Segurança e Sigilo Pastoral

- **Proteção do Livro Caixa**: Acesso restrito a usuários com privilégios de `pastor` e `tesoureiro`.
- **Anonimização de Doações**: Modo Sigilo Pastoral que oculta o nome de membros na visualização rápida e relatórios de assembleia.
- **Log de Auditoria Imutável**: Todas as alterações críticas (edição de dados institucionais, lançamentos financeiros, exclusões) geram registros automáticos na tabela de auditoria.

---

## 📖 Documentação Técnica Completa

Para detalhes aprofundados sobre arquitetura, fluxogramas, modelos de dados e guias de manutenção, consulte o arquivo [DOCUMENTACAO_TECNICA.md](DOCUMENTACAO_TECNICA.md).

---

## 👨‍💻 Créditos
- **Igreja**: Igreja Evangélica Pentecostal O Brasil Para Cristo - Rio Largo/AL
- **Desenvolvimento**: [Maximo Sistemas](https://maximosistemas.com)
