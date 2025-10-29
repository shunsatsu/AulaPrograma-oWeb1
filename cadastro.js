 // Menu hamburger
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    hamburger.addEventListener('click', () => { menu.classList.toggle('active'); });

    // Máscaras de input
    const cpf = document.getElementById('cpf');
    cpf.addEventListener('input', () => {
      let v = cpf.value.replace(/\D/g, '');
      v = v.replace(/(\d{3})(\d)/,'$1.$2');
      v = v.replace(/(\d{3})(\d)/,'$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/,'$1-$2');
      cpf.value = v;
    });

    const telefone = document.getElementById('telefone');
    telefone.addEventListener('input', () => {
      let v = telefone.value.replace(/\D/g, '');
      v = v.replace(/(\d{2})(\d)/,'($1) $2');
      v = v.replace(/(\d{5})(\d)/,'$1-$2');
      telefone.value = v;
    });

    const cep = document.getElementById('cep');
    cep.addEventListener('input', () => {
      let v = cep.value.replace(/\D/g, '');
      v = v.replace(/(\d{5})(\d)/,'$1-$2');
      cep.value = v;
    });

    // Aplicação dinâmica de cadastro
    (function(){
      const form = document.querySelector('form');
      const storageKey = 'greenDayColaboradores';
      const main = document.querySelector('main');
      const listContainer = document.createElement('div');
      listContainer.id = 'colaboradoresList';
      listContainer.style.marginTop = '32px';
      main.appendChild(listContainer);

      const generateId = () => 'c_' + (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2,9));
      const saveToStorage = data => localStorage.setItem(storageKey, JSON.stringify(data));
      const loadFromStorage = () => JSON.parse(localStorage.getItem(storageKey) || '[]');

      function renderList(){
        const colaboradores = loadFromStorage();
        listContainer.innerHTML = '';
        if(colaboradores.length===0){
          listContainer.innerHTML = '<p style="text-align:center;color:#aaa;">Nenhum colaborador cadastrado.</p>';
          return;
        }

        colaboradores.forEach(col=>{
          const card = document.createElement('div');
          card.style.background = '#1b1b1b';
          card.style.padding = '16px';
          card.style.marginBottom = '12px';
          card.style.borderRadius = '8px';
          card.style.boxShadow = '0 0 5px rgba(0,170,68,0.2)';
          card.dataset.id = col.id;

          card.innerHTML = `
            <strong>${col.nome}</strong> (${col.email})<br>
            CPF: ${col.cpf} | Telefone: ${col.telefone}<br>
            Nascimento: ${col.nascimento}<br>
            ${col.endereco}, ${col.cidade} - ${col.estado} | CEP: ${col.cep}<br>
            <button data-action="edit" style="margin-top:8px;margin-right:4px;">Editar</button>
            <button data-action="delete" style="margin-top:8px;">Remover</button>
          `;
          listContainer.appendChild(card);
        });
      }

      const resetForm = () => { form.reset(); delete form.dataset.editingId; };

      form.addEventListener('submit', e => {
        e.preventDefault();

        const data = {
          id: form.dataset.editingId || generateId(),
          nome: form.nome.value.trim(),
          email: form.email.value.trim(),
          cpf: form.cpf.value.trim(),
          telefone: form.telefone.value.trim(),
          nascimento: form.nascimento.value,
          endereco: form.endereco.value.trim(),
          cep: form.cep.value.trim(),
          cidade: form.cidade.value.trim(),
          estado: form.estado.value
        };

        if(!data.nome || !data.email || !data.cpf) return alert('Preencha os campos obrigatórios!');

        let colaboradores = loadFromStorage();
        if(form.dataset.editingId){
          colaboradores = colaboradores.map(c => c.id === data.id ? data : c);
        } else {
          colaboradores.push(data);
        }

        saveToStorage(colaboradores);
        resetForm();
        renderList();
      });

      listContainer.addEventListener('click', e => {
        const btn = e.target.closest('button');
        if(!btn) return;
        const card = btn.closest('div');
        const id = card.dataset.id;
        let colaboradores = loadFromStorage();

        if(btn.dataset.action === 'delete'){
          if(confirm('Remover colaborador?')){
            colaboradores = colaboradores.filter(c => c.id !== id);
            saveToStorage(colaboradores);
            renderList();
          }
        } else if(btn.dataset.action === 'edit'){
          const col = colaboradores.find(c => c.id === id);
          if(!col) return;
          form.nome.value = col.nome;
          form.email.value = col.email;
          form.cpf.value = col.cpf;
          form.telefone.value = col.telefone;
          form.nascimento.value = col.nascimento;
          form.endereco.value = col.endereco;
          form.cep.value = col.cep;
          form.cidade.value = col.cidade;
          form.estado.value = col.estado;
          form.dataset.editingId = col.id;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });

      renderList();
    })();