document.addEventListener('DOMContentLoaded', () => {
    // Simulação de dados recebidos do banco de dados (ex: Firestore)
    let mockLeads = [
        {
            id: 'LD-001',
            nome: 'Carlos Eduardo Mendes',
            contato: 'carlos.mendes@email.com',
            motivo: 'Revisão de contrato social da empresa',
            status: 'novo_contato',
            data_registro: '2026-04-20T10:30:00Z'
        },
        {
            id: 'LD-002',
            nome: 'Fernanda Albuquerque',
            contato: '(61) 98888-7777',
            motivo: 'Planejamento sucessório familiar',
            status: 'em_andamento',
            data_registro: '2026-04-18T14:15:00Z'
        },
        {
            id: 'LD-003',
            nome: 'Ricardo Gomes',
            contato: 'ricardo@empresa.com.br',
            motivo: 'Consulta sobre compliance digital',
            status: 'concluido',
            data_registro: '2026-04-10T09:00:00Z'
        }
    ];

    const tableBody = document.getElementById('leads-table-body');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Elementos do Modal
    const modal = document.getElementById('details-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const closeModalFooterBtn = document.getElementById('btn-close-modal-footer');
    const modalBody = document.getElementById('modal-body-content');

    // Função de formatação de data
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Função para atualizar os contadores no topo
    const updateStats = () => {
        const novos = mockLeads.filter(lead => lead.status === 'novo_contato').length;
        const andamento = mockLeads.filter(lead => lead.status === 'em_andamento').length;
        
        document.getElementById('count-novos').textContent = novos;
        document.getElementById('count-andamento').textContent = andamento;
        document.getElementById('count-total').textContent = mockLeads.length;
    };

    // Função para renderizar a tabela
    const renderTable = (filterStatus = 'all') => {
        tableBody.innerHTML = '';
        
        const filteredLeads = filterStatus === 'all' 
            ? mockLeads 
            : mockLeads.filter(lead => lead.status === filterStatus);

        if (filteredLeads.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum contato encontrado.</td></tr>`;
            return;
        }

        filteredLeads.forEach(lead => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${formatDate(lead.data_registro).split(',')[0]}</td>
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
                <td>
                    <button class="action-btn view-details-btn" data-id="${lead.id}">Ver Detalhes</button>
                </td>
            `;
            
            tableBody.appendChild(tr);
        });

        // Eventos para Select de Status
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', handleStatusChange);
        });

        // Eventos para Botão Ver Detalhes
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                openDetailsModal(id);
            });
        });
    };

    // Função para lidar com a alteração de status
    const handleStatusChange = (e) => {
        const select = e.target;
        const id = select.getAttribute('data-id');
        const newStatus = select.value;

        select.setAttribute('data-status', newStatus);

        const leadIndex = mockLeads.findIndex(l => l.id === id);
        if (leadIndex !== -1) {
            mockLeads[leadIndex].status = newStatus;
        }

        updateStats();
        console.log(`Status do lead ${id} atualizado para ${newStatus}`);
    };

    // Filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filter = e.target.getAttribute('data-filter');
            renderTable(filter);
        });
    });

    // ==========================================
    // Lógica do Modal de Detalhes
    // ==========================================
    const openDetailsModal = (id) => {
        const lead = mockLeads.find(l => l.id === id);
        if (!lead) return;

        const statusMap = {
            'novo_contato': 'Novo Contato',
            'em_andamento': 'Em Andamento',
            'concluido': 'Concluído'
        };

        modalBody.innerHTML = `
            <div class="detail-group">
                <label>ID da Solicitação</label>
                <p>${lead.id}</p>
            </div>
            <div class="detail-group">
                <label>Data de Registro</label>
                <p>${formatDate(lead.data_registro)}</p>
            </div>
            <div class="detail-group">
                <label>Nome Completo</label>
                <p>${lead.nome}</p>
            </div>
            <div class="detail-group">
                <label>Contato</label>
                <p>${lead.contato}</p>
            </div>
            <div class="detail-group">
                <label>Status</label>
                <p>${statusMap[lead.status] || lead.status}</p>
            </div>
            <div class="detail-group">
                <label>Motivo / Resumo do Caso</label>
                <p>${lead.motivo}</p>
            </div>
        `;
        
        modal.classList.add('is-active');
    };

    const closeModal = () => {
        modal.classList.remove('is-active');
    };

    closeModalBtn.addEventListener('click', closeModal);
    closeModalFooterBtn.addEventListener('click', closeModal);

    // Fechar modal ao clicar fora da caixa principal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Inicialização
    updateStats();
    renderTable();
});