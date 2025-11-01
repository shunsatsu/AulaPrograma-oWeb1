# Sistema de Voluntários

Sistema completo de cadastro para voluntários - Site responsivo para organizações não governamentais com arquitetura modular e formulários complexos.

## 📁 Estrutura do Projeto

```
sistema-voluntarios/
├── css/
│   └── style.css              # Estilos principais do site
├── js/
│   ├── animations.js          # Módulo de animações e efeitos visuais
│   ├── forms.js              # Módulo de formulários e validação
│   ├── main.js               # Arquivo principal de inicialização
│   ├── navigation.js         # Módulo de navegação e menu mobile
│   └── projects.js           # Módulo de filtros e modal de projetos
├── images/
│   ├── cadeirante.jpg
│   ├── doaçaocomida.jpg
│   ├── doaçãoroupas.jpg
│   ├── voluntario.jpg
│   ├── voluntarios.jpg
│   └── ...                   # Demais imagens do projeto
├── index.html                # Página inicial
├── cadastro.html             # Página de cadastro com formulário complexo
├── projeto.html              # Página de projetos sociais
├── admin.html                # Página administrativa
└── README.md                 # Documentação do projeto
```

## 🚀 Funcionalidades Implementadas

### ✅ Estrutura HTML5 Semântica Completa
- Tags semânticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Hierarquia de títulos lógica e consistente
- Uso adequado de imagens em todas as páginas
- 3+ páginas HTML organizadas

### ✅ Formulários Complexos e Interativos
- **Campos HTML5 implementados:**
  - Nome Completo (text + pattern)
  - E-mail (email)
  - CPF (text + máscara + validação)
  - Telefone (tel + máscara)
  - Data de Nascimento (date + limites)
  - Endereço completo (text)
  - CEP (text + máscara + API ViaCEP)
  - Cidade e Estado (text + select)

- **Validação HTML5 nativa:**
  - `required`, `pattern`, `minlength`, `maxlength`
  - `min`, `max`, `type`, `title`
  - Mensagens de erro personalizadas em português

- **Agrupamento lógico com fieldsets:**
  - Dados Pessoais
  - Informações de Contato
  - Endereço
  - Informações de Voluntariado
  - Confirmação

- **Máscaras de input:**
  - CPF: `000.000.000-00`
  - Telefone: `(00) 00000-0000`
  - CEP: `00000-000`

### ✅ Código JavaScript Modular

#### **Módulos por Funcionalidade:**

1. **`navigation.js`** - Navegação e Menu Mobile
   - Menu hamburger responsivo
   - Botão "Voltar ao Topo" com scroll suave
   - Navegação suave entre seções

2. **`forms.js`** - Formulários e Validação
   - Máscaras de input automáticas
   - Validação em tempo real
   - Integração com API ViaCEP
   - Mensagens de erro personalizadas

3. **`animations.js`** - Animações e Efeitos
   - Animação de estatísticas
   - Efeitos de scroll
   - Animações de fade-in
   - Efeitos de hover nos cards

4. **`projects.js`** - Funcionalidades de Projetos
   - Sistema de filtros por categoria
   - Modal de inscrição em projetos
   - Interações específicas da página de projetos

5. **`main.js`** - Arquivo Principal
   - Coordenação de todos os módulos
   - Inicialização da aplicação
   - Funções utilitárias globais

### ✅ Design Responsivo Completo
- **Mobile First** - Funciona perfeitamente em smartphones
- **Tablet Optimized** - Layout adaptado para tablets
- **Desktop Enhanced** - Experiência completa em desktop
- **Menu Hamburger** - Navegação mobile intuitiva

### ✅ Funcionalidades Avançadas
- **API Integration** - Busca automática de endereço por CEP
- **Local Storage** - Armazenamento de dados dos voluntários
- **Scroll Animations** - Efeitos visuais ao rolar a página
- **Form Validation** - Validação completa em tempo real
- **Success Feedback** - Mensagens de confirmação animadas

## 🎯 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica moderna
- **CSS3** - Estilos avançados com Grid, Flexbox e Animations
- **JavaScript ES6+** - Código modular e organizado
- **API ViaCEP** - Integração para busca de endereços
- **Responsive Design** - Mobile, Tablet e Desktop
- **Local Storage** - Persistência de dados no navegador

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (últimas versões)
- ✅ iOS Safari e Chrome Mobile
- ✅ Android Chrome e Samsung Internet
- ✅ Tablets (iPad, Android)
- ✅ Desktops (Windows, macOS, Linux)

## 🔧 Como Executar

1. Clone o repositório
2. Abra `index.html` em um navegador moderno
3. Ou inicie um servidor local:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (com http-server)
   npx http-server
   ```

## 📋 Páginas do Sistema

1. **`index.html`** - Página inicial com informações da organização e contato
2. **`cadastro.html`** - Formulário completo de cadastro de voluntários
3. **`projeto.html`** - Projetos sociais com sistema de filtros
4. **`admin.html`** - Área administrativa (funcionalidade básica)

---

**Desenvolvido com ❤️ para organizações que transformam vidas através do voluntariado.**

## 🚀 Funcionalidades

### Frontend Público
- ✅ Página inicial com apresentação
- ✅ Formulário de cadastro de voluntários
- ✅ Sistema de projetos com inscrições
- ✅ Design responsivo e moderno

### Painel Administrativo
- ✅ Login seguro com múltiplos usuários
- ✅ Dashboard com estatísticas em tempo real
- ✅ Gestão completa de voluntários
- ✅ Controle de inscrições em projetos
- ✅ Relatórios e exportação de dados
- ✅ Log de atividades e auditoria
- ✅ Sistema de backup e restore

## 🔐 Acesso Administrativo

Para acessar o painel administrativo:

1. Clique no ícone ⚙️ no rodapé
2. Ou acesse diretamente: `admin.html`

**Credenciais:**
- Usuário: `darlan` | Senha: `34461011`
- Usuário: `coordenador` | Senha: `coord456`
- Usuário: `gestor` | Senha: `gestor789`

## 🛠️ Tecnologias

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript ES6+
- LocalStorage para persistência
- Canvas para gráficos

## 📱 Compatibilidade

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS, Android)
- ✅ Tablet (iPad, Android)

## 🌐 Hospedagem

Este projeto funciona em qualquer servidor de arquivos estáticos:

- GitHub Pages (Recomendado)
- Netlify
- Vercel
- Firebase Hosting
- Qualquer servidor web tradicional

## 📊 Dados Armazenados

O sistema armazena localmente:
- Cadastros de voluntários
- Inscrições em projetos
- Log de atividades administrativas
- Configurações do sistema

## 🔄 Backup e Restore

O painel administrativo inclui:
- Backup automático dos dados
- Exportação em JSON/CSV
- Importação de dados
- Limpeza segura do sistema

## 👥 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ para transformar comunidades através do voluntariado**