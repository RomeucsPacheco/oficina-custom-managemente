const API_AGENDAMENTOS = 'http://localhost:8080/api/agendamentos';
const API_VEICULOS = 'http://localhost:8080/api/veiculos';
const API_SERVICOS = 'http://localhost:8080/api/servicos';

document.addEventListener('DOMContentLoaded', () => {
    carregarVeiculos();
    carregarServicos();
    buscarAgendamentos();
    configurarFormulario();
});

// 1. CARREGA VEÍCULOS NO SELECT
async function carregarVeiculos() {
    try {
        const response = await fetch(API_VEICULOS);
        const veiculos = await response.json();
        const select = document.getElementById('selectVeiculo');
        veiculos.forEach(v => {
            const option = document.createElement('option');
            option.value = v.id;
            option.text = `${v.marca} ${v.modelo} [${v.placa.toUpperCase()}] - Dono: ${v.cliente ? v.cliente.nome : 'Sem Dono'}`;
            select.appendChild(option);
        });
    } catch (error) { console.error(error); }
}

// 2. CARREGA SERVIÇOS NO SELECT
async function carregarServicos() {
    try {
        const response = await fetch(API_SERVICOS);
        const servicos = await response.json();
        const select = document.getElementById('selectServico');
        servicos.forEach(s => {
            const option = document.createElement('option');
            option.value = s.id;
            option.text = `${s.nomeServico} (R$ ${s.precoBase.toFixed(2)})`;
            select.appendChild(option);
        });
    } catch (error) { console.error(error); }
}

// 3. BUSCA E LISTA OS AGENDAMENTOS (GET)
async function buscarAgendamentos() {
    try {
        const response = await fetch(API_AGENDAMENTOS);
        if (!response.ok) throw new Error('Erro ao buscar agendamentos');
        
        const agendamentos = await response.json();
        const tabela = document.getElementById('tabelaAgendamentos');
        tabela.innerHTML = '';

        agendamentos.forEach(a => {
            // Formata a data de AAAA-MM-DD para DD/MM/AAAA
            const dataFormatada = a.dataAgendamento.split('-').reverse().join('/');
            
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${a.id}</td>
                <td><strong>${a.veiculo ? a.veiculo.marca + ' ' + a.veiculo.modelo : 'N/A'}</strong> (${a.veiculo && a.veiculo.cliente ? a.veiculo.cliente.nome : 'N/A'})</td>
                <td>${a.servico ? a.servico.nomeServico : 'N/A'}</td>
                <td>${dataFormatada}</td>
                <td><span style="padding: 4px 8px; border-radius: 4px; font-weight: bold; background: ${a.status === 'Concluído' ? '#00b37e' : a.status === 'Em Andamento' ? '#fba94c' : '#29292e'}">${a.status}</span></td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) { console.error(error); }
}

// 4. CRIA NOVO AGENDAMENTO (POST)
function configurarFormulario() {
    const form = document.getElementById('formAgendamento');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const veiculoId = document.getElementById('selectVeiculo').value;
        const servicoId = document.getElementById('selectServico').value;
        const dataAgendamento = document.getElementById('data').value;
        const status = document.getElementById('status').value;
        const observacoes = document.getElementById('observacoes').value;

        const novoAgendamento = {
            veiculo: { id: parseInt(veiculoId) },
            servico: { id: parseInt(servicoId) },
            dataAgendamento,
            status,
            observacoes
        };

        try {
            const response = await fetch(API_AGENDAMENTOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoAgendamento)
            });

            if (response.ok) {
                alert('Agendamento/Ordem de Serviço criada!');
                form.reset();
                buscarAgendamentos();
            } else {
                alert('Erro ao criar agendamento.');
            }
        } catch (error) { console.error(error); }
    });
}