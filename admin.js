// Sistema de Administração - Voluntários
// Credenciais de acesso (em produção, usar sistema mais seguro)
const ADMIN_CREDENTIALS = {
    'darlan': '34461011',
    'admin': 'admin',
    'gestor': 'gestor789'
};

// Variáveis globais
let currentUser = '';
let activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    // Verificar se já está logado
    const savedUser = sessionStorage.getItem('adminUser');
    if (savedUser && ADMIN_CREDENTIALS[savedUser]) {
        currentUser = savedUser;
        showDashboard();
    } else {
        showLogin();
    }
    
    // Configurar formulário de login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Carregar dados iniciais
    loadDashboardData();
    loadVolunteersTable();
    loadProjectsTable();
    updateActivityLog();
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (ADMIN_CREDENTIALS[username] && ADMIN_CREDENTIALS[username] === password) {
        currentUser = username;
        sessionStorage.setItem('adminUser', username);
        
        // Log da atividade
        addActivityLog(`Login realizado por ${username}`, 'success');
        
        showDashboard();
    } else {
        document.getElementById('loginError').style.display = 'block';
        setTimeout(() => {
            document.getElementById('loginError').style.display = 'none';
        }, 3000);
    }
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    document.getElementById('adminUser').textContent = `Logado como: ${currentUser}`;
    
    // Carregar dados
    loadDashboardData();
}

function logout() {
    addActivityLog(`Logout realizado por ${currentUser}`, 'info');
    currentUser = '';
    sessionStorage.removeItem('adminUser');
    showLogin();
    
    // Limpar formulário
    document.getElementById('loginForm').reset();
}

// Navegação entre tabs
function showTab(tabName) {
    // Remover classe active de todas as tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.admin-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Ativar tab atual
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Carregar dados específicos da tab
    switch(tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'volunteers':
            loadVolunteersTable();
            break;
        case 'projects':
            loadProjectsTable();
            break;
        case 'reports':
            loadReportsData();
            break;
        case 'activity':
            updateActivityLog();
            break;
    }
    
    addActivityLog(`Acessou aba: ${tabName}`, 'info');
}

// Carregamento dos dados do dashboard
function loadDashboardData() {
    const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    const projectSignups = JSON.parse(localStorage.getItem('projectSignups')) || [];
    
    // Atualizar estatísticas
    document.getElementById('totalVolunteers').textContent = volunteers.length;
    document.getElementById('totalSignups').textContent = projectSignups.length;
    
    // Calcular crescimento mensal
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const thisMonthVolunteers = volunteers.filter(v => {
        const date = new Date(v.dataCadastro.split('/').reverse().join('-'));
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length;
    
    const lastMonthVolunteers = volunteers.filter(v => {
        const date = new Date(v.dataCadastro.split('/').reverse().join('-'));
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    }).length;
    
    const growth = lastMonthVolunteers > 0 ? 
        Math.round(((thisMonthVolunteers - lastMonthVolunteers) / lastMonthVolunteers) * 100) : 
        (thisMonthVolunteers > 0 ? 100 : 0);
    
    document.getElementById('monthlyGrowth').textContent = `${growth}%`;
    
    // Gerar gráfico de cadastros por mês
    generateRegistrationChart(volunteers);
    
    // Gerar gráfico de áreas de interesse
    generateInterestChart(volunteers);
}

function generateRegistrationChart(volunteers) {
    const chartContainer = document.getElementById('registrationChart');
    const ctx = chartContainer.getContext('2d');
    
    // Preparar dados dos últimos 6 meses
    const months = [];
    const counts = [];
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
        months.push(monthName);
        
        const count = volunteers.filter(v => {
            const vDate = new Date(v.dataCadastro.split('/').reverse().join('-'));
            return vDate.getMonth() === date.getMonth() && vDate.getFullYear() === date.getFullYear();
        }).length;
        
        counts.push(count);
    }
    
    // Limpar canvas
    ctx.clearRect(0, 0, chartContainer.width, chartContainer.height);
    
    // Desenhar gráfico simples
    const maxCount = Math.max(...counts, 1);
    const barWidth = chartContainer.width / months.length;
    const barMaxHeight = chartContainer.height - 40;
    
    ctx.fillStyle = '#667eea';
    
    counts.forEach((count, index) => {
        const barHeight = (count / maxCount) * barMaxHeight;
        const x = index * barWidth + 10;
        const y = chartContainer.height - barHeight - 20;
        
        ctx.fillRect(x, y, barWidth - 20, barHeight);
        
        // Labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(months[index], x + (barWidth - 20) / 2, chartContainer.height - 5);
        ctx.fillText(count, x + (barWidth - 20) / 2, y - 5);
        
        ctx.fillStyle = '#667eea';
    });
}

function generateInterestChart(volunteers) {
    const interestCounts = {};
    
    volunteers.forEach(volunteer => {
        if (volunteer.interesses) {
            volunteer.interesses.forEach(interest => {
                interestCounts[interest] = (interestCounts[interest] || 0) + 1;
            });
        }
    });
    
    const chartHtml = Object.entries(interestCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([interest, count]) => {
            const percentage = volunteers.length > 0 ? Math.round((count / volunteers.length) * 100) : 0;
            return `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>${interest}</span>
                        <span>${count} (${percentage}%)</span>
                    </div>
                    <div style="background: #e1e5e9; height: 20px; border-radius: 10px; overflow: hidden;">
                        <div style="background: #667eea; height: 100%; width: ${percentage}%; transition: width 0.3s ease;"></div>
                    </div>
                </div>
            `;
        }).join('');
    
    document.getElementById('interestChart').innerHTML = chartHtml || '<p>Nenhum dado disponível</p>';
}

// Carregamento da tabela de voluntários
function loadVolunteersTable() {
    const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    const tbody = document.getElementById('volunteersTableBody');
    
    tbody.innerHTML = volunteers.map(volunteer => `
        <tr>
            <td>${volunteer.nome}</td>
            <td>${volunteer.email}</td>
            <td>${volunteer.telefone}</td>
            <td>${volunteer.cidade}</td>
            <td>${volunteer.disponibilidade}</td>
            <td>${volunteer.dataCadastro}</td>
            <td class="action-buttons">
                <button class="btn-small btn-view" onclick="viewVolunteer(${volunteer.id})">Ver</button>
                <button class="btn-small btn-edit" onclick="editVolunteer(${volunteer.id})">Editar</button>
                <button class="btn-small btn-delete" onclick="deleteVolunteer(${volunteer.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

// Carregamento da tabela de projetos
function loadProjectsTable() {
    const projectSignups = JSON.parse(localStorage.getItem('projectSignups')) || [];
    const tbody = document.getElementById('projectsTableBody');
    
    const projectNames = {
        'alimenta': 'Alimenta Solidário',
        'vestir': 'Vestir Esperança',
        'acessivel': 'Caminhos Acessíveis',
        'cesta': 'Cesta Básica Solidária',
        'educacao': 'Saber Compartilhado',
        'saude': 'Saúde Para Todos'
    };
    
    tbody.innerHTML = projectSignups.map(signup => `
        <tr>
            <td>${signup.name}</td>
            <td>${signup.email}</td>
            <td>${signup.phone}</td>
            <td>${projectNames[signup.project] || signup.project}</td>
            <td>${signup.availability}</td>
            <td>${signup.signupDate}</td>
            <td><span class="status-badge status-pending">Pendente</span></td>
            <td class="action-buttons">
                <button class="btn-small btn-view" onclick="viewProjectSignup(${signup.id})">Ver</button>
                <button class="btn-small btn-edit" onclick="approveSignup(${signup.id})">Aprovar</button>
                <button class="btn-small btn-delete" onclick="deleteSignup(${signup.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

// Funções de busca
function searchVolunteers(searchTerm) {
    const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    const filteredVolunteers = volunteers.filter(volunteer =>
        volunteer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.cidade.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const tbody = document.getElementById('volunteersTableBody');
    tbody.innerHTML = filteredVolunteers.map(volunteer => `
        <tr>
            <td>${volunteer.nome}</td>
            <td>${volunteer.email}</td>
            <td>${volunteer.telefone}</td>
            <td>${volunteer.cidade}</td>
            <td>${volunteer.disponibilidade}</td>
            <td>${volunteer.dataCadastro}</td>
            <td class="action-buttons">
                <button class="btn-small btn-view" onclick="viewVolunteer(${volunteer.id})">Ver</button>
                <button class="btn-small btn-edit" onclick="editVolunteer(${volunteer.id})">Editar</button>
                <button class="btn-small btn-delete" onclick="deleteVolunteer(${volunteer.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
    
    addActivityLog(`Busca realizada por voluntários: "${searchTerm}"`, 'info');
}

function searchProjectSignups(searchTerm) {
    const projectSignups = JSON.parse(localStorage.getItem('projectSignups')) || [];
    const projectNames = {
        'alimenta': 'Alimenta Solidário',
        'vestir': 'Vestir Esperança',
        'acessivel': 'Caminhos Acessíveis',
        'cesta': 'Cesta Básica Solidária',
        'educacao': 'Saber Compartilhado',
        'saude': 'Saúde Para Todos'
    };
    
    const filteredSignups = projectSignups.filter(signup =>
        signup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (projectNames[signup.project] || signup.project).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const tbody = document.getElementById('projectsTableBody');
    tbody.innerHTML = filteredSignups.map(signup => `
        <tr>
            <td>${signup.name}</td>
            <td>${signup.email}</td>
            <td>${signup.phone}</td>
            <td>${projectNames[signup.project] || signup.project}</td>
            <td>${signup.availability}</td>
            <td>${signup.signupDate}</td>
            <td><span class="status-badge status-pending">Pendente</span></td>
            <td class="action-buttons">
                <button class="btn-small btn-view" onclick="viewProjectSignup(${signup.id})">Ver</button>
                <button class="btn-small btn-edit" onclick="approveSignup(${signup.id})">Aprovar</button>
                <button class="btn-small btn-delete" onclick="deleteSignup(${signup.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
    
    addActivityLog(`Busca realizada por inscrições: "${searchTerm}"`, 'info');
}

// Ações com voluntários
function viewVolunteer(id) {
    const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    const volunteer = volunteers.find(v => v.id === id);
    
    if (volunteer) {
        const details = `
            Nome: ${volunteer.nome}
            Email: ${volunteer.email}
            Telefone: ${volunteer.telefone}
            Idade: ${volunteer.idade}
            Cidade: ${volunteer.cidade}
            Disponibilidade: ${volunteer.disponibilidade}
            Áreas de Interesse: ${volunteer.interesses?.join(', ') || 'Nenhuma'}
            Experiência: ${volunteer.experiencia || 'Não informada'}
            Motivação: ${volunteer.motivacao}
            Data de Cadastro: ${volunteer.dataCadastro}
        `;
        
        alert(details);
        addActivityLog(`Visualizou dados do voluntário: ${volunteer.nome}`, 'info');
    }
}

function editVolunteer(id) {
    const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    const volunteer = volunteers.find(v => v.id === id);
    
    if (volunteer) {
        const newName = prompt('Nome:', volunteer.nome);
        const newEmail = prompt('Email:', volunteer.email);
        const newPhone = prompt('Telefone:', volunteer.telefone);
        const newCity = prompt('Cidade:', volunteer.cidade);
        
        if (newName && newEmail && newPhone && newCity) {
            volunteer.nome = newName;
            volunteer.email = newEmail;
            volunteer.telefone = newPhone;
            volunteer.cidade = newCity;
            
            localStorage.setItem('volunteers', JSON.stringify(volunteers));
            loadVolunteersTable();
            
            addActivityLog(`Editou dados do voluntário: ${volunteer.nome}`, 'warning');
        }
    }
}

function deleteVolunteer(id) {
    if (confirm('Tem certeza que deseja excluir este voluntário?')) {
        const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
        const volunteer = volunteers.find(v => v.id === id);
        const volunteerName = volunteer ? volunteer.nome : 'Desconhecido';
        
        const updatedVolunteers = volunteers.filter(v => v.id !== id);
        localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
        
        loadVolunteersTable();
        loadDashboardData();
        
        addActivityLog(`Excluiu voluntário: ${volunteerName}`, 'danger');
    }
}

// Ações com projetos
function viewProjectSignup(id) {
    const projectSignups = JSON.parse(localStorage.getItem('projectSignups')) || [];
    const signup = projectSignups.find(s => s.id === id);
    
    if (signup) {
        const projectNames = {
            'alimenta': 'Alimenta Solidário',
            'vestir': 'Vestir Esperança',
            'acessivel': 'Caminhos Acessíveis',
            'cesta': 'Cesta Básica Solidária',
            'educacao': 'Saber Compartilhado',
            'saude': 'Saúde Para Todos'
        };
        
        const details = `
            Nome: ${signup.name}
            Email: ${signup.email}
            Telefone: ${signup.phone}
            Projeto: ${projectNames[signup.project] || signup.project}
            Disponibilidade: ${signup.availability}
            Data de Inscrição: ${signup.signupDate}
        `;
        
        alert(details);
        addActivityLog(`Visualizou inscrição no projeto: ${projectNames[signup.project] || signup.project}`, 'info');
    }
}

function approveSignup(id) {
    if (confirm('Aprovar esta inscrição?')) {
        addActivityLog(`Aprovou inscrição ID: ${id}`, 'success');
        alert('Inscrição aprovada! (Em um sistema real, seria enviado um email de confirmação)');
    }
}

function deleteSignup(id) {
    if (confirm('Tem certeza que deseja excluir esta inscrição?')) {
        const projectSignups = JSON.parse(localStorage.getItem('projectSignups')) || [];
        const updatedSignups = projectSignups.filter(s => s.id !== id);
        localStorage.setItem('projectSignups', JSON.stringify(updatedSignups));
        
        loadProjectsTable();
        loadDashboardData();
        
        addActivityLog(`Excluiu inscrição ID: ${id}`, 'danger');
    }
}

// Funções de exportação
function exportVolunteers() {
    const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    const csvContent = generateCSV(volunteers, [
        'nome', 'email', 'telefone', 'idade', 'cidade', 'disponibilidade', 'dataCadastro'
    ]);
    
    downloadFile(csvContent, 'voluntarios.csv', 'text/csv');
    addActivityLog('Exportou dados de voluntários (CSV)', 'info');
}

function exportVolunteersJSON() {
    const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    const jsonContent = JSON.stringify(volunteers, null, 2);
    
    downloadFile(jsonContent, 'voluntarios.json', 'application/json');
    addActivityLog('Exportou dados de voluntários (JSON)', 'info');
}

function exportProjectSignups() {
    const projectSignups = JSON.parse(localStorage.getItem('projectSignups')) || [];
    const csvContent = generateCSV(projectSignups, [
        'name', 'email', 'phone', 'project', 'availability', 'signupDate'
    ]);
    
    downloadFile(csvContent, 'inscricoes-projetos.csv', 'text/csv');
    addActivityLog('Exportou dados de inscrições em projetos (CSV)', 'info');
}

function generateCSV(data, fields) {
    const headers = fields.join(',');
    const rows = data.map(item => 
        fields.map(field => `"${(item[field] || '').toString().replace(/"/g, '""')}"`).join(',')
    );
    
    return headers + '\n' + rows.join('\n');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function printVolunteers() {
    const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    
    const printContent = `
        <html>
            <head>
                <title>Lista de Voluntários</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    h1 { text-align: center; }
                </style>
            </head>
            <body>
                <h1>Lista de Voluntários</h1>
                <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
                <table>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Cidade</th>
                        <th>Disponibilidade</th>
                        <th>Data Cadastro</th>
                    </tr>
                    ${volunteers.map(v => `
                        <tr>
                            <td>${v.nome}</td>
                            <td>${v.email}</td>
                            <td>${v.telefone}</td>
                            <td>${v.cidade}</td>
                            <td>${v.disponibilidade}</td>
                            <td>${v.dataCadastro}</td>
                        </tr>
                    `).join('')}
                </table>
            </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    
    addActivityLog('Imprimiu lista de voluntários', 'info');
}

// Relatórios
function loadReportsData() {
    const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    const projectSignups = JSON.parse(localStorage.getItem('projectSignups')) || [];
    
    // Atualizar estatísticas de relatórios
    document.getElementById('reportTotalVolunteers').textContent = volunteers.length;
    
    // Inscrições deste mês
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthlySignups = projectSignups.filter(s => {
        const date = new Date(s.signupDate.split('/').reverse().join('-'));
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length;
    
    document.getElementById('reportMonthlySignups').textContent = monthlySignups;
    
    // Idade média
    const ages = volunteers.filter(v => v.idade).map(v => parseInt(v.idade));
    const avgAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;
    document.getElementById('reportAvgAge').textContent = avgAge;
    
    // Relatório por cidade
    generateCityReport(volunteers);
    
    // Relatório de disponibilidade
    generateAvailabilityReport(volunteers);
}

function generateCityReport(volunteers) {
    const cityCounts = {};
    volunteers.forEach(volunteer => {
        const city = volunteer.cidade || 'Não informado';
        cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    
    const chartHtml = Object.entries(cityCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([city, count]) => {
            const percentage = volunteers.length > 0 ? Math.round((count / volunteers.length) * 100) : 0;
            return `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>${city}</span>
                        <span>${count} voluntários (${percentage}%)</span>
                    </div>
                    <div style="background: #e1e5e9; height: 20px; border-radius: 10px; overflow: hidden;">
                        <div style="background: #28a745; height: 100%; width: ${percentage}%; transition: width 0.3s ease;"></div>
                    </div>
                </div>
            `;
        }).join('');
    
    document.getElementById('cityReport').innerHTML = chartHtml || '<p>Nenhum dado disponível</p>';
}

function generateAvailabilityReport(volunteers) {
    const availabilityCounts = {};
    volunteers.forEach(volunteer => {
        const availability = volunteer.disponibilidade || 'Não informado';
        availabilityCounts[availability] = (availabilityCounts[availability] || 0) + 1;
    });
    
    const chartHtml = Object.entries(availabilityCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([availability, count]) => {
            const percentage = volunteers.length > 0 ? Math.round((count / volunteers.length) * 100) : 0;
            return `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>${availability}</span>
                        <span>${count} voluntários (${percentage}%)</span>
                    </div>
                    <div style="background: #e1e5e9; height: 20px; border-radius: 10px; overflow: hidden;">
                        <div style="background: #ffc107; height: 100%; width: ${percentage}%; transition: width 0.3s ease;"></div>
                    </div>
                </div>
            `;
        }).join('');
    
    document.getElementById('availabilityReport').innerHTML = chartHtml || '<p>Nenhum dado disponível</p>';
}

function generateFullReport() {
    const volunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    const projectSignups = JSON.parse(localStorage.getItem('projectSignups')) || [];
    
    const reportData = {
        dataGeracao: new Date().toLocaleString('pt-BR'),
        totalVoluntarios: volunteers.length,
        totalInscricoes: projectSignups.length,
        voluntarios: volunteers,
        inscricoesProjetos: projectSignups,
        estatisticas: {
            cidadesMaisComuns: getCityStats(volunteers),
            disponibilidadeMaisComum: getAvailabilityStats(volunteers),
            idadeMedia: getAverageAge(volunteers),
            areasInteresseMaisPopulares: getInterestStats(volunteers)
        }
    };
    
    const reportContent = JSON.stringify(reportData, null, 2);
    downloadFile(reportContent, `relatorio-completo-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    
    addActivityLog('Gerou relatório completo', 'info');
}

function getCityStats(volunteers) {
    const cityCounts = {};
    volunteers.forEach(v => {
        const city = v.cidade || 'Não informado';
        cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    return Object.entries(cityCounts).sort(([,a], [,b]) => b - a).slice(0, 5);
}

function getAvailabilityStats(volunteers) {
    const availabilityCounts = {};
    volunteers.forEach(v => {
        const availability = v.disponibilidade || 'Não informado';
        availabilityCounts[availability] = (availabilityCounts[availability] || 0) + 1;
    });
    return Object.entries(availabilityCounts).sort(([,a], [,b]) => b - a);
}

function getAverageAge(volunteers) {
    const ages = volunteers.filter(v => v.idade).map(v => parseInt(v.idade));
    return ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;
}

function getInterestStats(volunteers) {
    const interestCounts = {};
    volunteers.forEach(v => {
        if (v.interesses) {
            v.interesses.forEach(interest => {
                interestCounts[interest] = (interestCounts[interest] || 0) + 1;
            });
        }
    });
    return Object.entries(interestCounts).sort(([,a], [,b]) => b - a);
}

// Log de atividades
function addActivityLog(action, type = 'info') {
    const logEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('pt-BR'),
        user: currentUser,
        action: action,
        type: type
    };
    
    activityLog.unshift(logEntry);
    
    // Manter apenas os últimos 100 logs
    if (activityLog.length > 100) {
        activityLog = activityLog.slice(0, 100);
    }
    
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
    updateActivityLog();
}

function updateActivityLog() {
    const logContainer = document.getElementById('activityLog');
    
    const typeColors = {
        'info': '#17a2b8',
        'success': '#28a745',
        'warning': '#ffc107',
        'danger': '#dc3545'
    };
    
    logContainer.innerHTML = activityLog.map(log => `
        <div class="log-item">
            <div>
                <div class="log-action" style="color: ${typeColors[log.type] || '#17a2b8'};">
                    ${log.action}
                </div>
                <div style="font-size: 0.8rem; color: #666;">
                    por ${log.user}
                </div>
            </div>
            <div class="log-time">${log.timestamp}</div>
        </div>
    `).join('');
}

function clearActivityLog() {
    if (confirm('Tem certeza que deseja limpar todo o log de atividades?')) {
        activityLog = [];
        localStorage.removeItem('activityLog');
        updateActivityLog();
        addActivityLog('Log de atividades foi limpo', 'warning');
    }
}

// Configurações
function createBackup() {
    const allData = {
        volunteers: JSON.parse(localStorage.getItem('volunteers')) || [],
        projectSignups: JSON.parse(localStorage.getItem('projectSignups')) || [],
        activityLog: JSON.parse(localStorage.getItem('activityLog')) || [],
        backupDate: new Date().toISOString()
    };
    
    const backupContent = JSON.stringify(allData, null, 2);
    downloadFile(backupContent, `backup-voluntarios-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    
    addActivityLog('Criou backup completo do sistema', 'info');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (confirm('Tem certeza que deseja importar estes dados? Isso substituirá todos os dados atuais.')) {
                if (data.volunteers) localStorage.setItem('volunteers', JSON.stringify(data.volunteers));
                if (data.projectSignups) localStorage.setItem('projectSignups', JSON.stringify(data.projectSignups));
                if (data.activityLog) localStorage.setItem('activityLog', JSON.stringify(data.activityLog));
                
                // Recarregar dados
                loadDashboardData();
                loadVolunteersTable();
                loadProjectsTable();
                updateActivityLog();
                
                addActivityLog('Importou dados do sistema', 'warning');
                alert('Dados importados com sucesso!');
            }
        } catch (error) {
            alert('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
        }
    };
    
    reader.readAsText(file);
}

function clearAllData() {
    if (confirm('ATENÇÃO: Isso irá apagar TODOS os dados do sistema. Esta ação não pode ser desfeita. Tem certeza?')) {
        if (confirm('Esta é sua última chance. Confirma a exclusão de TODOS os dados?')) {
            localStorage.removeItem('volunteers');
            localStorage.removeItem('projectSignups');
            localStorage.removeItem('activityLog');
            
            // Reinicializar arrays
            activityLog = [];
            
            // Recarregar interface
            loadDashboardData();
            loadVolunteersTable();
            loadProjectsTable();
            updateActivityLog();
            
            addActivityLog('Limpou todos os dados do sistema', 'danger');
            alert('Todos os dados foram removidos!');
        }
    }
}

function changePassword() {
    const currentPassword = prompt('Digite sua senha atual:');
    if (!currentPassword || ADMIN_CREDENTIALS[currentUser] !== currentPassword) {
        alert('Senha atual incorreta!');
        return;
    }
    
    const newPassword = prompt('Digite a nova senha:');
    if (!newPassword || newPassword.length < 6) {
        alert('A nova senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    const confirmPassword = prompt('Confirme a nova senha:');
    if (newPassword !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }
    
    // Em um sistema real, isso seria salvo no servidor
    ADMIN_CREDENTIALS[currentUser] = newPassword;
    
    addActivityLog('Alterou senha de acesso', 'warning');
    alert('Senha alterada com sucesso!');
}

function createNewProject() {
    alert('Funcionalidade de criação de novos projetos será implementada em versões futuras.');
    addActivityLog('Tentou criar um novo projeto', 'info');
}

function scheduleReport() {
    alert('Funcionalidade de agendamento de relatórios será implementada em versões futuras.');
    addActivityLog('Tentou agendar um relatório', 'info');
}

// Inicializar log de sistema
addActivityLog('Sistema administrativo inicializado', 'success');