# 🚀 Comandos Git para Deploy

## Primeiro Deploy (apenas uma vez)

### 1. Inicializar repositório local (se ainda não foi feito)
```bash
git init
git add .
git commit -m "🎉 Primeira versão do sistema de voluntários"
```

### 2. Conectar com repositório remoto
```bash
git remote add origin https://github.com/SEU_USUARIO/sistema-voluntarios.git
git branch -M main
git push -u origin main
```

## Atualizações Futuras

### Para cada atualização:
```bash
git add .
git commit -m "📝 Descrição da atualização"
git push
```

## Comandos Úteis

### Ver status dos arquivos
```bash
git status
```

### Ver histórico de commits
```bash
git log --oneline
```

### Desfazer último commit (mantém arquivos)
```bash
git reset --soft HEAD~1
```

### Baixar atualizações do remoto
```bash
git pull
```

## Exemplo de Mensagens de Commit

- `🎉 Primeira versão do sistema`
- `✨ Nova funcionalidade de relatórios`
- `🐛 Correção de bug no formulário`
- `📱 Melhorias na versão mobile`
- `🔧 Configuração do GitHub Pages`
- `📊 Atualização do dashboard`
- `🔐 Melhorias na segurança`