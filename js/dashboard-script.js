// ==========================================
// FUNÇÕES GLOBAIS (Abas e Modais)
// ==========================================
function switchTab(tabId) {
    // Esconder todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
    
    // Mostrar a aba selecionada
    document.getElementById(`tab-${tabId}`).classList.add('active');
    document.querySelector(`button[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('is-active');
}

// ==========================================
// LÓGICA DO DASHBOARD (Quando a página carrega)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MÓDULO: CONTATOS (Existente)
    // ==========================================
    let mockLeads = [
        { id: 'LD-001', nome: 'Carlos Eduardo Mendes', contato: 'carlos.mendes@email.com', motivo: 'Revisão de contrato social da empresa', status: 'novo_contato', data_registro: '2026-04-20T10:30:00Z' },
        { id: 'LD-002', nome: 'Fernanda Albuquerque', contato: '(61) 98888-7777', motivo: 'Planejamento sucessório familiar', status: 'em_andamento', data_registro: '2026-04-18T14:15:00Z' },
        { id: 'LD-003', nome: 'Ricardo Gomes', contato: 'ricardo@empresa.com.br', motivo: 'Consulta sobre compliance digital', status: 'concluido', data_registro: '2026-04-10T09:00:00Z' }
    ];

    const leadsTableBody = document.getElementById('leads-table-body');
    
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR');
    };

    const updateLeadStats = () => {
        document.getElementById('count-novos').textContent = mockLeads.filter(l => l.status === 'novo_contato').length;
        document.getElementById('count-andamento').textContent = mockLeads.filter(l => l.status === 'em_andamento').length;
        document.getElementById('count-total').textContent = mockLeads.length;
    };

    const renderLeadsTable = (filterStatus = 'all') => {
        leadsTableBody.innerHTML = '';
        const filtered = filterStatus === 'all' ? mockLeads : mockLeads.filter(l => l.status === filterStatus);

        if (filtered.length === 0) {
            leadsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum contato encontrado.</td></tr>`;
            return;
        }

        filtered.forEach(lead => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDate(lead.data_registro)}</td>
                <td><strong>${lead.nome}</strong></td>
                <td>${lead.contato}</td>
                <td class="cell-reason" title="${lead.motivo}">${lead.motivo}</td>
                <td>
                    <select class="status-select" data-id="${lead.id}" data-status="${lead.status}">
                        <option value="novo_contato" ${lead.status === 'novo_contato' ? 'selected' : ''}>Novo</option>
                        <option value="em_andamento" ${lead.status === 'em_andamento' ? 'selected' : ''}>Em Andamento</option>
                        <option value="concluido" ${lead.status === 'concluido' ? 'selected' : ''}>Concluído</option>
                    </select>
                </td>
                <td><button class="action-btn" onclick="openLeadDetails('${lead.id}')">Ver Detalhes</button></td>
            `;
            leadsTableBody.appendChild(tr);
        });

        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const newStatus = e.target.value;
                const lead = mockLeads.find(l => l.id === e.target.getAttribute('data-id'));
                if(lead) { lead.status = newStatus; updateLeadStats(); e.target.setAttribute('data-status', newStatus); }
            });
        });
    };

    // Filtros de contatos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderLeadsTable(e.target.getAttribute('data-filter'));
        });
    });

    window.openLeadDetails = (id) => {
        const lead = mockLeads.find(l => l.id === id);
        if(!lead) return;
        const map = { 'novo_contato': 'Novo Contato', 'em_andamento': 'Em Andamento', 'concluido': 'Concluído' };
        document.getElementById('modal-body-content').innerHTML = `
            <div class="detail-group"><label>Data</label><p>${formatDate(lead.data_registro)}</p></div>
            <div class="detail-group"><label>Nome</label><p>${lead.nome}</p></div>
            <div class="detail-group"><label>Contato</label><p>${lead.contato}</p></div>
            <div class="detail-group"><label>Status</label><p>${map[lead.status]}</p></div>
            <div class="detail-group"><label>Motivo</label><p>${lead.motivo}</p></div>
        `;
        document.getElementById('details-modal').classList.add('is-active');
    };

    updateLeadStats();
    renderLeadsTable();


    // ==========================================
    // 2. MÓDULO: NOTÍCIAS (Novo)
    // ==========================================
    let mockNews = [
        { id: 1, titulo: 'A importância do Compliance Digital', categoria: 'Direito Empresarial', status: 'Publicado', conteudo: 'Texto completo aqui...', data: '2026-04-15' },
        { id: 2, titulo: 'Novas regras para o e-commerce', categoria: 'Informativo', status: 'Rascunho', conteudo: 'Texto do rascunho...', data: '2026-04-20' }
    ];

    const newsTableBody = document.getElementById('news-table-body');

    window.renderNewsTable = () => {
        newsTableBody.innerHTML = '';
        if (mockNews.length === 0) {
            newsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Nenhuma notícia cadastrada.</td></tr>`;
            return;
        }

        mockNews.forEach(news => {
            const tr = document.createElement('tr');
            const badgeClass = news.status === 'Publicado' ? 'publicado' : 'rascunho';
            
            tr.innerHTML = `
                <td>${formatDate(news.data)}</td>
                <td><strong>${news.titulo}</strong></td>
                <td>${news.categoria}</td>
                <td><span class="status-badge ${badgeClass}">${news.status}</span></td>
                <td>
                    <button class="action-btn edit-btn" onclick="openNewsModal(${news.id})">Editar</button>
                    <button class="action-btn delete-btn" onclick="deleteNews(${news.id})">Excluir</button>
                </td>
            `;
            newsTableBody.appendChild(tr);
        });
    };

    window.openNewsModal = (id = null) => {
        const modal = document.getElementById('news-modal');
        const form = document.getElementById('news-form');
        
        if (id) {
            // Modo Edição
            const news = mockNews.find(n => n.id === id);
            document.getElementById('news-modal-title').textContent = 'Editar Notícia';
            document.getElementById('news-id').value = news.id;
            document.getElementById('news-title').value = news.titulo;
            document.getElementById('news-category').value = news.categoria;
            document.getElementById('news-status').value = news.status;
            document.getElementById('news-content').value = news.conteudo;
        } else {
            // Modo Criação
            form.reset();
            document.getElementById('news-modal-title').textContent = 'Nova Notícia';
            document.getElementById('news-id').value = '';
        }
        
        modal.classList.add('is-active');
    };

    window.saveNews = (event) => {
        event.preventDefault(); // Impede o envio real do formulário
        
        const id = document.getElementById('news-id').value;
        const titulo = document.getElementById('news-title').value;
        const categoria = document.getElementById('news-category').value;
        const status = document.getElementById('news-status').value;
        const conteudo = document.getElementById('news-content').value;

        if (id) {
            // Atualizar existente
            const index = mockNews.findIndex(n => n.id == id);
            mockNews[index] = { ...mockNews[index], titulo, categoria, status, conteudo };
        } else {
            // Criar nova
            const novaNoticia = {
                id: Date.now(), // Gera um ID único simples
                titulo,
                categoria,
                status,
                conteudo,
                data: new Date().toISOString()
            };
            mockNews.unshift(novaNoticia); // Adiciona no início da lista
        }

        closeModal('news-modal');
        renderNewsTable();
        alert('Notícia salva com sucesso!');
    };

    window.deleteNews = (id) => {
        if(confirm('Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.')) {
            mockNews = mockNews.filter(n => n.id !== id);
            renderNewsTable();
        }
    };

    // Inicializar tabela de notícias
    renderNewsTable();

    // Fechar modais ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
});