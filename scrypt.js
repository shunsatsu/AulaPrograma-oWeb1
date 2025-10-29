
src="https://unpkg.com/vue@3/dist/vue.global.prod.js">

<script>
document.addEventListener('DOMContentLoaded', () => {
  /* -----------------------------
     MENU RESPONSIVO
  ----------------------------- */
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      menu.classList.toggle('active');
      hamburger.classList.toggle('open');
    });
  }

  /* -----------------------------
     TEMA CLARO / ESCURO
  ----------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  // Define o tema inicial
  document.body.dataset.theme = savedTheme;

  // Ajusta a cor de fundo inicial
  document.body.style.backgroundColor =
    savedTheme === 'light' ? '#fafafa' : 'var(--color-neutral-dark)';

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.dataset.theme;
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      document.body.dataset.theme = newTheme;
      document.body.style.backgroundColor =
        newTheme === 'light' ? '#fafafa' : 'var(--color-neutral-dark)';

      localStorage.setItem('theme', newTheme);
    });
  }

  /* -----------------------------
     APP VUE.JS
  ----------------------------- */
  const app = Vue.createApp({
    data() {
      return {
        novoProjeto: '',
        projetos: JSON.parse(localStorage.getItem('projetos')) || [
          { nome: 'Projeto Arborização', status: 'Urgente', descricao: 'Plantio de árvores em áreas degradadas.' },
          { nome: 'Campanha de Reciclagem', status: 'Em Andamento', descricao: 'Educação ambiental e coleta seletiva.' },
          { nome: 'Educação Ambiental', status: 'Novo', descricao: 'Workshops e palestras em escolas.' }
        ]
      };
    },
    methods: {
      adicionarProjeto() {
        const nome = this.novoProjeto.trim();
        if (!nome) {
          alert('Digite o nome do projeto!');
          return;
        }
        this.projetos.push({
          nome,
          status: 'Novo',
          descricao: 'Novo projeto adicionado pela comunidade.'
        });
        this.novoProjeto = '';
        this.salvarProjetos();
      },
      removerProjeto(i) {
        this.projetos.splice(i, 1);
        this.salvarProjetos();
      },
      limparProjetos() {
        if (confirm('Deseja realmente apagar todos os projetos?')) {
          this.projetos = [];
          localStorage.removeItem('projetos');
        }
      },
      salvarProjetos() {
        localStorage.setItem('projetos', JSON.stringify(this.projetos));
      }
    },
    watch: {
      projetos: {
        handler() {
          this.salvarProjetos();
        },
        deep: true
      }
    }
  });

  // Monta o app Vue somente se existir o elemento #app
  const appEl = document.getElementById('app');
  if (appEl) app.mount('#app');
});
