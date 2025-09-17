# Sistema de Controle e Monitoramento de Backup

Uma aplicação web moderna e interativa para monitoramento de políticas de backup, desenvolvida com React, Tailwind CSS e Recharts.

## 🚀 Características

- **Dashboard Interativo**: Visualização em tempo real com gráficos e estatísticas
- **Gráficos Dinâmicos**: Distribuição por localidade e tipos de backup
- **Interface Moderna**: Design clean e responsivo
- **Filtros Avançados**: Busca por políticas, localidades e tipos
- **Dados em Tempo Real**: Atualização automática do timestamp

## 📊 Funcionalidades

### Dashboard Principal
- Estatísticas rápidas (Total de Políticas, Localidades, Tipos de Backup, Clientes Ativos)
- Gráfico de barras: Distribuição por localidade
- Gráfico de pizza: Tipos de backup
- Indicador de status do sistema

### Lista de Políticas
- Visualização detalhada de todas as políticas de backup
- Filtros por localidade e tipo
- Busca por nome da política ou cliente
- Status visual dos jobs (ativo/inativo)

### Cronograma
- Seção preparada para visualização de horários de backup
- Interface pronta para expansão futura

## 🛠️ Tecnologias Utilizadas

- **React 18**: Framework JavaScript moderno
- **Tailwind CSS**: Framework CSS utilitário
- **Recharts**: Biblioteca de gráficos para React
- **Lucide React**: Ícones modernos
- **Vite**: Build tool rápido

## 📁 Estrutura do Projeto

```
backup-checklist/
├── src/
│   ├── assets/
│   │   └── backup_data.json    # Dados do checklist
│   ├── components/
│   │   └── ui/                 # Componentes UI (shadcn/ui)
│   ├── App.jsx                 # Componente principal
│   ├── App.css                 # Estilos globais
│   └── main.jsx               # Ponto de entrada
├── dist/                      # Build de produção
├── public/                    # Arquivos estáticos
└── package.json              # Dependências
```

## 🚀 Como Executar

### Desenvolvimento
```bash
cd backup-checklist
npm install
npm run dev
```

### Produção
```bash
npm run build
npm run preview
```

## 📈 Dados

A aplicação utiliza os dados do arquivo Excel original convertidos para JSON, incluindo:

- **119 políticas** de backup configuradas
- **4 localidades** monitoradas (Data Center, CD. Contagem, CD. Goiânia, CD. Viana)
- **9 tipos** diferentes de backup (MS-Windows, MS-SQL-Server, SAP, VMware, etc.)
- **23 clientes** ativos

## 🎨 Design

- **Cores**: Esquema moderno com gradientes
- **Layout**: Responsivo para desktop e mobile
- **Tipografia**: Hierarquia clara e legível
- **Interatividade**: Hover effects e transições suaves

## 🔧 Personalização

Para atualizar os dados:
1. Substitua o arquivo `src/assets/backup_data.json`
2. Mantenha a mesma estrutura de dados
3. A aplicação atualizará automaticamente

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deploy

A aplicação pode ser facilmente deployada em:
- Vercel
- Netlify
- GitHub Pages
- Qualquer servidor web estático

Basta fazer upload da pasta `dist/` após executar `npm run build`.

---

**Desenvolvido com ❤️ usando tecnologias modernas**

