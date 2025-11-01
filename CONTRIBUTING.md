# 🤝 Guia de Contribuição

Obrigado por seu interesse em contribuir com o Sistema de Voluntários! Este documento fornece diretrizes para contribuições efetivas.

## 📋 Código de Conduta

Ao participar deste projeto, você concorda em manter um ambiente respeitoso e inclusivo para todos.

## 🚀 Como Contribuir

### 1. Configuração do Ambiente

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU-USUARIO/sistema-voluntarios.git
cd sistema-voluntarios

# Configure o remote upstream
git remote add upstream https://github.com/DarlanCavalcante/sistema-voluntarios.git

# Instale um servidor local para testes
python3 -m http.server 8080
```

### 2. Fluxo de Trabalho (GitFlow)

```bash
# Sincronize com upstream
git checkout main
git pull upstream main
git push origin main

# Crie uma branch para sua contribuição
git checkout -b feature/nome-da-funcionalidade
# ou
git checkout -b fix/nome-do-bug
# ou  
git checkout -b docs/nome-da-documentacao
```

### 3. Padrões de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos permitidos:
feat:     # Nova funcionalidade
fix:      # Correção de bug
docs:     # Documentação
style:    # Formatação (não afeta funcionalidade)
refactor: # Refatoração de código
test:     # Testes
chore:    # Tarefas de manutenção

# Exemplos:
git commit -m "feat: adicionar validação de CNPJ no formulário"
git commit -m "fix: corrigir contraste de botões em modo escuro"
git commit -m "docs: atualizar guia de instalação"
```

### 4. Padrões de Código

#### HTML
- ✅ Usar tags semânticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- ✅ Incluir atributos de acessibilidade (`aria-label`, `role`, `tabindex`)
- ✅ Validar com [W3C Validator](https://validator.w3.org/)
- ✅ Otimizar imagens com `alt` descritivos

#### CSS
- ✅ Seguir metodologia BEM para classes
- ✅ Mobile-first com breakpoints responsivos
- ✅ Usar Custom Properties (CSS Variables)
- ✅ Garantir contraste mínimo WCAG AA (4.5:1)

```css
/* ✅ Bom */
.hero-section__title--highlighted {
    color: var(--primary-color);
    font-size: clamp(1.5rem, 4vw, 2.5rem);
}

/* ❌ Evitar */
.title.big.blue {
    color: #0066cc;
    font-size: 40px;
}
```

#### JavaScript
- ✅ Usar ES6+ (const, let, arrow functions, async/await)
- ✅ Código modular em arquivos separados
- ✅ Documentar funções complexas
- ✅ Tratar erros adequadamente

```javascript
// ✅ Bom
const fetchAddressByZip = async (zipCode) => {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
        if (!response.ok) throw new Error('CEP não encontrado');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        throw error;
    }
};

// ❌ Evitar
function getAddress(cep) {
    // código sem tratamento de erro
}
```

### 5. Checklist de Acessibilidade

Antes de enviar um PR, verifique:

- [ ] **Navegação por teclado** funciona em todos os elementos
- [ ] **Skip links** estão presentes e funcionais
- [ ] **Aria-labels** descrevem elementos adequadamente
- [ ] **Contraste** atende WCAG AA (mínimo 4.5:1)
- [ ] **Imagens** têm texto alternativo descritivo
- [ ] **Formulários** têm labels associados
- [ ] **Foco** é visível e lógico
- [ ] **Screen readers** anunciam conteúdo corretamente

### 6. Testes

#### Navegadores Suportados
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

#### Dispositivos de Teste
- Desktop (1920x1080, 1366x768)
- Tablet (768x1024, 1024x768)
- Mobile (375x667, 414x896)

#### Ferramentas de Teste
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)
- Screen readers (NVDA, JAWS, VoiceOver)

### 7. Pull Request

#### Template de PR

```markdown
## 📝 Descrição
Breve descrição das mudanças implementadas.

## 🎯 Tipo de Mudança
- [ ] Bug fix (correção de problema existente)
- [ ] New feature (nova funcionalidade)
- [ ] Breaking change (mudança incompatível)
- [ ] Documentation update (atualização de docs)

## ✅ Checklist
- [ ] Código testado em múltiplos navegadores
- [ ] Navegação por teclado funcional
- [ ] Contraste WCAG AA verificado
- [ ] Documentação atualizada (se necessário)
- [ ] Commit messages seguem padrão

## 📱 Screenshots
(Se aplicável, adicione screenshots das mudanças)

## 🧪 Como Testar
1. Passo a passo para testar as mudanças
2. Casos de teste específicos
3. Cenários de erro
```

### 8. Revisão de Código

Critérios avaliados:
- ✅ Funcionalidade correta
- ✅ Acessibilidade WCAG 2.1 AA
- ✅ Performance otimizada
- ✅ Código limpo e documentado
- ✅ Compatibilidade cross-browser
- ✅ Design responsivo

## 🐛 Reportando Bugs

Use o template de issue:

```markdown
## 🐛 Descrição do Bug
Descrição clara e concisa do problema.

## 🚶 Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## 💭 Comportamento Esperado
O que deveria acontecer.

## 📱 Ambiente
- OS: [Windows 10, macOS Big Sur, Ubuntu 20.04]
- Navegador: [Chrome 95, Firefox 94, Safari 15]
- Dispositivo: [Desktop, Mobile, Tablet]
- Leitor de Tela: [NVDA, JAWS, VoiceOver] (se aplicável)
```

## 💡 Sugerindo Funcionalidades

```markdown
## 🚀 Descrição da Funcionalidade
Descrição clara da funcionalidade proposta.

## 🎯 Problema que Resolve
Qual problema esta funcionalidade solucionaria?

## 💭 Solução Proposta
Como você imagina que funcionaria?

## 🔄 Alternativas Consideradas
Outras soluções que considerou?

## ♿ Considerações de Acessibilidade
Como esta funcionalidade impactaria a acessibilidade?
```

## 📚 Recursos Úteis

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM Resources](https://webaim.org/resources/)

## 🤝 Comunidade

- **Issues**: Para bugs e sugestões
- **Discussions**: Para perguntas e discussões
- **Wiki**: Para documentação técnica

---

**Obrigado por contribuir! Sua participação torna este projeto melhor para todos.** 🙏