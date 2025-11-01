// Módulo de Formulários
// Responsável por validação, máscaras e envio de formulários

// Configuração das máscaras de input
function setupInputMasks() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }

    // Máscara para Telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    // Máscara para CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });

        // Busca automática de endereço por CEP
        cepInput.addEventListener('blur', function(e) {
            const cep = e.target.value.replace(/\D/g, '');
            if (cep.length === 8) {
                buscarEnderecoPorCEP(cep);
            }
        });
    }

    // Validação de checkbox de interesses
    const interessesCheckboxes = document.querySelectorAll('input[name="interesses"]');
    interessesCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('input[name="interesses"]:checked');
            interessesCheckboxes.forEach(cb => {
                if (checkedBoxes.length > 0) {
                    cb.setCustomValidity('');
                } else {
                    cb.setCustomValidity('Selecione pelo menos uma área de interesse');
                }
            });
        });
    });
}

// Buscar endereço por CEP usando API ViaCEP
function buscarEnderecoPorCEP(cep) {
    const cidadeInput = document.getElementById('cidade');
    const enderecoInput = document.getElementById('endereco');
    const estadoSelect = document.getElementById('estado');

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                if (cidadeInput) cidadeInput.value = data.localidade;
                if (enderecoInput && data.logradouro) {
                    enderecoInput.value = data.logradouro;
                }
                if (estadoSelect) estadoSelect.value = data.uf;
            }
        })
        .catch(error => {
            console.log('Erro ao buscar CEP:', error);
        });
}

// Configuração dos formulários
function setupForms() {
    // Formulário de cadastro de voluntários
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', handleVolunteerSubmit);
        
        // Validação em tempo real
        const inputs = volunteerForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrorOnInput);
        });
    }
    
    // Formulário de inscrição em projetos
    const projectForm = document.getElementById('projectSignupForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSignup);
    }
}

// Validação individual de campos
function validateField(event) {
    const field = event.target;
    const errorElement = document.getElementById(field.id + '-error');
    
    if (errorElement) {
        if (field.validity.valid) {
            errorElement.textContent = '';
            field.classList.remove('invalid');
            field.classList.add('valid');
        } else {
            errorElement.textContent = getErrorMessage(field);
            field.classList.add('invalid');
            field.classList.remove('valid');
        }
    }
}

// Limpar erro ao digitar
function clearErrorOnInput(event) {
    const field = event.target;
    const errorElement = document.getElementById(field.id + '-error');
    
    if (errorElement && field.validity.valid) {
        errorElement.textContent = '';
        field.classList.remove('invalid');
        field.classList.add('valid');
    }
}

// Mensagens de erro personalizadas
function getErrorMessage(field) {
    if (field.validity.valueMissing) {
        return 'Este campo é obrigatório.';
    }
    if (field.validity.typeMismatch) {
        if (field.type === 'email') return 'Digite um e-mail válido.';
        if (field.type === 'tel') return 'Digite um telefone válido.';
        if (field.type === 'date') return 'Digite uma data válida.';
    }
    if (field.validity.patternMismatch) {
        if (field.id === 'cpf') return 'Digite um CPF válido no formato 000.000.000-00';
        if (field.id === 'telefone') return 'Digite um telefone válido no formato (00) 00000-0000';
        if (field.id === 'cep') return 'Digite um CEP válido no formato 00000-000';
        if (field.id === 'nome') return 'Nome deve conter apenas letras (mínimo 3 caracteres)';
        if (field.id === 'cidade') return 'Cidade deve conter apenas letras';
    }
    if (field.validity.tooShort) {
        return `Mínimo de ${field.minLength} caracteres.`;
    }
    if (field.validity.tooLong) {
        return `Máximo de ${field.maxLength} caracteres.`;
    }
    if (field.validity.rangeUnderflow || field.validity.rangeOverflow) {
        if (field.type === 'date') return 'Você deve ter entre 18 e 100 anos.';
        return 'Valor fora do intervalo permitido.';
    }
    if (field.validity.customError) {
        return field.validationMessage;
    }
    return 'Campo inválido.';
}

// Processar envio do formulário de voluntário
function handleVolunteerSubmit(event) {
    event.preventDefault();
    
    // Validar formulário completo
    const form = event.target;
    if (!form.checkValidity()) {
        // Mostrar erros de validação
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            const errorElement = document.getElementById(input.id + '-error');
            if (errorElement && !input.validity.valid) {
                errorElement.textContent = getErrorMessage(input);
                input.classList.add('invalid');
            }
        });
        
        // Focar no primeiro campo inválido
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    const formData = new FormData(event.target);
    const volunteerData = {
        id: Date.now(),
        nome: formData.get('nome'),
        cpf: formData.get('cpf'),
        dataNascimento: formData.get('dataNascimento'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        cep: formData.get('cep'),
        endereco: formData.get('endereco'),
        cidade: formData.get('cidade'),
        estado: formData.get('estado'),
        disponibilidade: formData.get('disponibilidade'),
        interesses: formData.getAll('interesses'),
        experiencia: formData.get('experiencia'),
        motivacao: formData.get('motivacao'),
        dataRegistro: new Date().toLocaleDateString('pt-BR')
    };
    
    // Salvar no localStorage
    const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    volunteers.push(volunteerData);
    localStorage.setItem('volunteers', JSON.stringify(volunteers));
    
    // Feedback para o usuário
    showSuccessMessage('Cadastro realizado com sucesso! Obrigado por se voluntariar!');
    event.target.reset();
    
    // Limpar classes de validação
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.classList.remove('valid', 'invalid');
        const errorElement = document.getElementById(input.id + '-error');
        if (errorElement) errorElement.textContent = '';
    });
    
    // Redirecionar para página inicial
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// Mostrar mensagem de sucesso
function showSuccessMessage(message) {
    // Criar elemento de sucesso
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 20px rgba(39, 174, 96, 0.3);
        z-index: 10000;
        animation: slideInFromRight 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    // Remover após 3 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Processar inscrição em projetos (função existente mantida para compatibilidade)
function handleProjectSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const signupData = {
        id: Date.now(),
        project: formData.get('project'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        availability: formData.get('availability'),
        dataRegistro: new Date().toLocaleDateString('pt-BR')
    };
    
    const projectSignups = JSON.parse(localStorage.getItem('projectSignups')) || [];
    projectSignups.push(signupData);
    localStorage.setItem('projectSignups', JSON.stringify(projectSignups));
    
    showSuccessMessage('Inscrição realizada com sucesso! Entraremos em contato em breve.');
    event.target.reset();
    
    // Fechar modal se existir
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Exportar funções para uso global
window.FormsModule = {
    setupInputMasks,
    setupForms,
    validateField,
    clearErrorOnInput,
    getErrorMessage,
    handleVolunteerSubmit,
    handleProjectSignup,
    showSuccessMessage,
    buscarEnderecoPorCEP
};