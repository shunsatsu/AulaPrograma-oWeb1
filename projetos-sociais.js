(function(){
      'use strict';

      /**
       * Simple helper: query selectors
       */
      const $ = sel => document.querySelector(sel);
      const $$ = sel => Array.from(document.querySelectorAll(sel));

      /**
       * Simula uma requisição "fetch" assíncrona para exemplificar integração com APIs.
       * Aqui retorna um conjunto inicial de projetos após 400ms.
       */
      function fakeFetchInitialProjects(){
        const initial = [
          { id: cryptoRandomId(), nome: 'Projeto Arborização', status:'Urgente', descricao:'Plantio de árvores em áreas degradadas e parques urbanos.', local:'São Paulo - SP', contato:'(11) 3456-7890' },
          { id: cryptoRandomId(), nome: 'Campanha de Reciclagem', status:'Em Andamento', descricao:'Coleta seletiva e educação ambiental em escolas.', local:'Campinas - SP', contato:'recicla@greenday.org' },
          { id: cryptoRandomId(), nome: 'Educação Ambiental', status:'Novo', descricao:'Workshops e palestras para escolas e comunidades.', local:'Salvador - BA', contato:'(71) 91234-0000' },
          { id: cryptoRandomId(), nome: 'Proteção da Fauna e Flora', status:'Ativo', descricao:'Monitoramento e preservação de espécies locais.', local:'Manaus - AM', contato:'fauna@greenday.org' }
        ];
        return new Promise(resolve => setTimeout(()=>resolve(initial), 400));
      }

      /** gera id simples com crypto */
      function cryptoRandomId(){ return 'p_' + (crypto?.randomUUID?.() || Math.random().toString(36).slice(2,9)); }

      /**
       * ProjectManager: encapsula estado, persistência e render
       */
      class ProjectManager {
        constructor(storageKey='gd_projetos_v1'){
          this.storageKey = storageKey;
          this.projetos = [];
          this.filtered = [];
          this.sortMode = 'default';
          this.filterStatus = 'all';
          this.searchTerm = '';
          this.dragSrcId = null;

          // DOM
          this.grid = $('#grid');
          this.empty = $('#empty');
          this.overlay = $('#overlay');
          this.modalTitle = $('#modalTitle');
          this.modalAlert = $('#modalAlert');
          this.form = $('#projectForm');
          this.inputs = {
            name: $('#projName'),
            status: $('#projStatus'),
            desc: $('#projDesc'),
            local: $('#projLocation'),
            contato: $('#projContact')
          };

          // bind events
          this.bindUI();
        }

        async init(){
          // tenta carregar do localStorage
          const saved = localStorage.getItem(this.storageKey);
          if(saved){
            try{
              this.projetos = JSON.parse(saved);
            }catch(e){
              console.warn('Erro ao parsear storage, resetando', e);
              localStorage.removeItem(this.storageKey);
              this.projetos = [];
            }
          }

          // se não tem nada, buscar "inicial" de forma assíncrona
          if(!this.projetos || this.projetos.length === 0){
            const fetched = await fakeFetchInitialProjects();
            this.projetos = fetched;
            this.persist();
          }

          this.applyFiltersAndRender();
        }

        bindUI(){
          // controls
          $('#openAdd').addEventListener('click', ()=>this.openModalForNew());
          $('#search').addEventListener('input', (e)=>{ this.searchTerm = e.target.value; this.applyFiltersAndRender(); });
          $('#filterStatus').addEventListener('change', (e)=>{ this.filterStatus = e.target.value; this.applyFiltersAndRender(); });
          $('#sortBy').addEventListener('change', (e)=>{ this.sortMode = e.target.value; this.applyFiltersAndRender(); });
          $('#resetAll').addEventListener('click', ()=>{ if(confirm('Resetar todos os dados locais e recarregar?')){ localStorage.removeItem(this.storageKey); location.reload(); } });

          // hamburger mobile (se existir no markup original)
          const h = document.getElementById('hamburger');
          const menu = document.getElementById('menu');
          if(h && menu) h.addEventListener('click', ()=> menu.classList.toggle('active'));

          // modal controls
          $('#cancelBtn').addEventListener('click', ()=> this.closeModal());
          this.form.addEventListener('submit', (e)=>{ e.preventDefault(); this.saveFromModal(); });

          // delegation for card buttons
          this.grid.addEventListener('click', (e)=> this.onGridClick(e));

          // drag & drop
          this.grid.addEventListener('dragstart', (e)=> this.onDragStart(e));
          this.grid.addEventListener('dragover', (e)=> this.onDragOver(e));
          this.grid.addEventListener('drop', (e)=> this.onDrop(e));
          this.grid.addEventListener('dragend', (e)=> this.onDragEnd(e));

          // keyboard escape to close modal
          document.addEventListener('keydown', (e)=> {
            if(e.key === 'Escape' && this.overlay.classList.contains('show')) this.closeModal();
          });
        }

        persist(){
          localStorage.setItem(this.storageKey, JSON.stringify(this.projetos));
        }

        applyFiltersAndRender(){
          // filter
          const term = this.searchTerm.trim().toLowerCase();
          this.filtered = this.projetos.filter(p=>{
            const matchTerm = !term || (p.nome + ' ' + p.descricao + ' ' + (p.local||'')).toLowerCase().includes(term);
            const matchStatus = this.filterStatus === 'all' ? true : p.status === this.filterStatus;
            return matchTerm && matchStatus;
          });

          // sort
          if(this.sortMode === 'name-asc') this.filtered.sort((a,b)=> a.nome.localeCompare(b.nome));
          else if(this.sortMode === 'name-desc') this.filtered.sort((a,b)=> b.nome.localeCompare(a.nome));
          else if(this.sortMode === 'status') this.filtered.sort((a,b)=> a.status.localeCompare(b.status));

          this.renderGrid();
        }

        renderGrid(){
          this.grid.innerHTML = '';
          if(this.filtered.length === 0){
            this.empty.style.display = 'block';
          } else {
            this.empty.style.display = 'none';
          }

          this.filtered.forEach(p => {
            const card = document.createElement('article');
            card.className = 'card';
            card.setAttribute('draggable','true');
            card.dataset.id = p.id;

            // accessible name and description
            card.innerHTML = `
              <h3>${escapeHtml(p.nome)}</h3>
              <div class="meta">
                <span class="badge">${escapeHtml(p.status)}</span>
                <span class="hint">${escapeHtml(p.local || '')}</span>
              </div>
              <p>${escapeHtml(p.descricao || '')}</p>
              <div class="actions" aria-hidden="false">
                <button class="small btn" data-action="view">Saiba Mais</button>
                <button class="small btn ghost" data-action="edit">Editar</button>
                <button class="small btn ghost" data-action="dup">Duplicar</button>
                <button class="small btn" data-action="delete">Remover</button>
              </div>
            `;

            // keyboard/aria friendly
            card.tabIndex = 0;
            card.addEventListener('keydown', (e)=>{
              if(e.key === 'Enter') this.openDetailModal(p.id);
            });

            this.grid.appendChild(card);
          });
        }

        onGridClick(e){
          const btn = e.target.closest('button[data-action]');
          if(!btn) return;
          const action = btn.dataset.action;
          const card = btn.closest('.card');
          const id = card?.dataset?.id;
          if(!id) return;

          if(action === 'view') this.openDetailModal(id);
          else if(action === 'edit') this.openModalForEdit(id);
          else if(action === 'delete') {
            if(confirm('Remover este projeto?')) {
              this.removeProject(id);
            }
          } else if(action === 'dup') {
            this.duplicateProject(id);
          }
        }

        openModalForNew(){
          this.currentEditingId = null;
          this.modalTitle.textContent = 'Criar novo projeto';
          this.clearModalFields();
          this.showModal();
        }

        openModalForEdit(id){
          const p = this.projetos.find(x=>x.id===id);
          if(!p) return alert('Projeto não encontrado');
          this.currentEditingId = id;
          this.modalTitle.textContent = 'Editar projeto';
          this.inputs.name.value = p.nome || '';
          this.inputs.status.value = p.status || 'Novo';
          this.inputs.desc.value = p.descricao || '';
          this.inputs.local.value = p.local || '';
          this.inputs.contato.value = p.contato || '';
          this.showModal();
        }

        openDetailModal(id){
          const p = this.projetos.find(x=>x.id===id);
          if(!p) return;
          // Reuse same modal but fill content and disable editing for view
          this.currentEditingId = id;
          this.modalTitle.textContent = 'Detalhes do projeto';
          this.inputs.name.value = p.nome || '';
          this.inputs.status.value = p.status || '';
          this.inputs.desc.value = p.descricao || '';
          this.inputs.local.value = p.local || '';
          this.inputs.contato.value = p.contato || '';
          // disable inputs for view
          Object.values(this.inputs).forEach(i => i.disabled = true);
          $('#saveBtn').style.display = 'none';
          this.showModal();
        }

        showModal(){
          this.modalAlert.style.display = 'none';
          this.overlay.classList.add('show');
          this.overlay.setAttribute('aria-hidden','false');
          // focus first field
          setTimeout(()=> this.inputs.name.focus(), 120);
        }

        closeModal(){
          this.overlay.classList.remove('show');
          this.overlay.setAttribute('aria-hidden','true');
          // enable inputs in case they were disabled
          Object.values(this.inputs).forEach(i => i.disabled = false);
          $('#saveBtn').style.display = '';
        }

        clearModalFields(){
          this.form.reset();
          this.inputs.status.value = 'Novo';
          this.modalAlert.style.display = 'none';
        }

        saveFromModal(){
          const name = this.inputs.name.value.trim();
          const status = this.inputs.status.value.trim();
          const desc = this.inputs.desc.value.trim();
          const local = this.inputs.local.value.trim();
          const contato = this.inputs.contato.value.trim();

          if(!name){
            this.showModalAlert('Nome é obrigatório','error');
            this.inputs.name.focus();
            return;
          }

          // create or update
          if(this.currentEditingId){
            const idx = this.projetos.findIndex(p=>p.id===this.currentEditingId);
            if(idx >= 0){
              this.projetos[idx] = Object.assign({}, this.projetos[idx], { nome:name, status, descricao:desc, local, contato });
              this.persist();
              this.applyFiltersAndRender();
              this.closeModal();
              this.showToast('Projeto atualizado');
            } else {
              this.showModalAlert('Projeto não localizado para edição','error');
            }
          } else {
            const novo = { id: cryptoRandomId(), nome:name, status, descricao:desc, local, contato };
            this.projetos.unshift(novo); // adiciona no topo
            this.persist();
            this.applyFiltersAndRender();
            this.closeModal();
            this.showToast('Projeto criado');
          }
        }

        showModalAlert(msg, type='error'){
          this.modalAlert.textContent = msg;
          this.modalAlert.className = 'alert ' + (type==='error' ? 'error' : '');
          this.modalAlert.style.display = 'block';
        }

        showToast(msg){
          // toast simples (rápido e sem biblioteca)
          const t = document.createElement('div');
          t.textContent = msg;
          t.style.position = 'fixed';
          t.style.right = '18px';
          t.style.bottom = '78px';
          t.style.background = 'rgba(0,0,0,0.7)';
          t.style.padding = '10px 14px';
          t.style.borderRadius = '8px';
          t.style.zIndex = 9999;
          document.body.appendChild(t);
          setTimeout(()=> t.style.opacity = '0', 1800);
          setTimeout(()=> t.remove(), 2200);
        }

        removeProject(id){
          const idx = this.projetos.findIndex(p=>p.id===id);
          if(idx === -1) return;
          this.projetos.splice(idx,1);
          this.persist();
          this.applyFiltersAndRender();
          this.showToast('Projeto removido');
        }

        duplicateProject(id){
          const p = this.projetos.find(x=>x.id===id);
          if(!p) return;
          const copy = Object.assign({}, p, { id: cryptoRandomId(), nome: p.nome + ' (Cópia)' });
          this.projetos.unshift(copy);
          this.persist();
          this.applyFiltersAndRender();
          this.showToast('Projeto duplicado');
        }

        /* Drag & drop handlers — reordena this.projetos conforme drag */
        onDragStart(e){
          const card = e.target.closest('.card');
          if(!card) return;
          e.dataTransfer.effectAllowed = 'move';
          this.dragSrcId = card.dataset.id;
          card.classList.add('dragging');
        }

        onDragOver(e){
          e.preventDefault();
          const over = e.target.closest('.card');
          const dragging = this.grid.querySelector('.card.dragging');
          if(!over || !dragging || over === dragging) return;
          // visual feedback: insert before or after
          const rect = over.getBoundingClientRect();
          const after = (e.clientY - rect.top) > (rect.height / 2);
          if(after) over.style.borderBottom = '2px solid rgba(255,255,255,0.08)';
          else over.style.borderTop = '2px solid rgba(255,255,255,0.08)';
          // cleanup on leave handled in dragend/drop
        }

        onDrop(e){
          e.preventDefault();
          const over = e.target.closest('.card');
          const dragging = this.grid.querySelector('.card.dragging');
          if(!over || !dragging || over === dragging) {
            this.clearDropStyles();
            return;
          }
          const rect = over.getBoundingClientRect();
          const after = (e.clientY - rect.top) > (rect.height / 2);

          // compute new order in projetos array based on dataset ids
          const srcId = dragging.dataset.id;
          const dstId = over.dataset.id;
          const srcIndex = this.projetos.findIndex(p=>p.id===srcId);
          const dstIndex = this.projetos.findIndex(p=>p.id===dstId);
          if(srcIndex === -1 || dstIndex === -1) { this.clearDropStyles(); return; }

          // remove src
          const [moved] = this.projetos.splice(srcIndex,1);
          // compute insertion index after removal
          let insertAt = dstIndex;
          if(srcIndex < dstIndex) {
            // after removing one before dst, dstIndex decreased by 1
            insertAt = dstIndex;
          }
          if(after) insertAt = insertAt + 1;
          this.projetos.splice(insertAt, 0, moved);
          this.persist();
          this.applyFiltersAndRender();
          this.clearDropStyles();
          this.showToast('Ordem atualizada');
        }

        onDragEnd(e){
          const dragging = this.grid.querySelector('.card.dragging');
          if(dragging) dragging.classList.remove('dragging');
          this.clearDropStyles();
        }

        clearDropStyles(){
          $$('.card').forEach(c=>{ c.style.borderTop=''; c.style.borderBottom=''; });
        }
      } // end ProjectManager

      // escape HTML helper
      function escapeHtml(s){ if(!s) return ''; return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

      // Inicializa a aplicação
      const pm = new ProjectManager();
      pm.init();

      // expose for debugging (não necessário em produção)
      window.ProjectManager = ProjectManager;
      window.pm = pm;
    })();