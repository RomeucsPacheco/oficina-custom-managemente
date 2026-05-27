const API_AGENDAMENTOS = 'http://localhost:8080/api/agendamentos';
const API_VEICULOS = 'http://localhost:8080/api/veiculos';
const API_SERVICOS = 'http://localhost:8080/api/servicos';
let agendamentoEmEdicaoId = null;

document.addEventListener('DOMContentLoaded', () => {
    carregarVeiculos();
    carregarServicos();
    buscarAgendamentos();
    configurarFormulario();
    configurarBotaoCancelar();
});

// 1. CARREGA VEÍCULOS NO SELECT
async function carregarVeiculos() {
    try {
        const response = await fetch(API_VEICULOS);
        const veiculos = await response.json();
        const select = document.getElementById('selectVeiculo');
        select.innerHTML = '<option value="">Selecione um veículo...</option>';
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
        select.innerHTML = '<option value="">Selecione um serviço...</option>';
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
            const dataFormatada = a.dataAgendamento.split('-').reverse().join('/');
            const carroInfo = a.veiculo ? `${a.veiculo.marca} ${a.veiculo.modelo}` : 'N/A';
            const donoNome = a.veiculo && a.veiculo.cliente ? a.veiculo.cliente.nome : 'N/A';
            const servicoNome = a.servico ? a.servico.nomeServico : 'N/A';
            const vId = a.veiculo ? a.veiculo.id : '';
            const sId = a.servico ? a.servico.id : '';

            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${a.id}</td>
                <td><strong>${carroInfo}</strong> (${donoNome})</td>
                <td>${servicoNome}</td>
                <td>${dataFormatada}</td>
                <td><span style="padding: 4px 8px; border-radius: 4px; font-weight: bold; background: ${a.status === 'Concluído' ? '#00b37e' : a.status === 'Em Andamento' ? '#fba94c' : '#29292e'}">${a.status}</span></td>
                <td>
                    <button class="btn-editar" onclick="prepararEdicao(${a.id}, ${vId}, ${sId}, '${a.dataAgendamento}', '${a.status}', '${a.observacoes || ''}')">Editar</button>
                    <button class="btn-deletar" onclick="excluirAgendamento(${a.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) { console.error(error); }
}

// 4. CADASTRAR OU ATUALIZAR AGENDAMENTO (POST / PUT)
function configurarFormulario() {
    const form = document.getElementById('formAgendamento');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const veiculoId = document.getElementById('selectVeiculo').value;
        const servicoId = document.getElementById('selectServico').value;
        const dataAgendamento = document.getElementById('data').value;
        const status = document.getElementById('status').value;
        const observacoes = document.getElementById('observacoes').value;

        const dadosAgendamento = {
            veiculo: { id: parseInt(veiculoId) },
            servico: { id: parseInt(servicoId) },
            dataAgendamento,
            status,
            observacoes
        };

        let url = API_AGENDAMENTOS;
        let metodo = 'POST';

        if (agendamentoEmEdicaoId !== null) {
            url = `${API_AGENDAMENTOS}/${agendamentoEmEdicaoId}`;
            metodo = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAgendamento)
            });

            if (response.ok) {
                alert(agendamentoEmEdicaoId !== null ? 'Agendamento atualizado!' : 'Agendamento criado com sucesso!');
                resetarEstadoFormulario();
                buscarAgendamentos();
            } else {
                alert('Erro ao salvar agendamento.');
            }
        } catch (error) { console.error(error); }
    });
}

// 5. JOGA OS DADOS PRO FORMULÁRIO DE EDIÇÃO
function prepararEdicao(id, veiculoId, servicoId, data, status, obs) {
    agendamentoEmEdicaoId = id;

    document.getElementById('selectVeiculo').value = veiculoId;
    document.getElementById('selectServico').value = servicoId;
    document.getElementById('data').value = data;
    document.getElementById('status').value = status;
    document.getElementById('observacoes').value = obs;

    document.getElementById('tituloForm').innerText = `✏️ Editando Agendamento (ID: ${id})`;
    document.getElementById('btnSalvar').innerText = "Atualizar Agendamento";
    document.getElementById('btnCancelar').style.display = "block";
}

// 6. EXCLUIR AGENDAMENTO (DELETE)
async function excluirAgendamento(id) {
    if (confirm('Deseja realmente excluir este agendamento/ordem de serviço?')) {
        try {
            const response = await fetch(`${API_AGENDAMENTOS}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Agendamento excluído com sucesso!');
                buscarAgendamentos();
                if (agendamentoEmEdicaoId === id) resetarEstadoFormulario();
            } else {
                alert('Erro ao excluir agendamento.');
            }
        } catch (error) { console.error(error); }
    }
}

// 7. CONFIGURA BOTÃO CANCELAR
function configurarBotaoCancelar() {
    document.getElementById('btnCancelar').addEventListener('click', () => {
        resetarEstadoFormulario();
    });
}

function resetarEstadoFormulario() {
    agendamentoEmEdicaoId = null;
    document.getElementById('formAgendamento').reset();
    document.getElementById('tituloForm').innerText = "Nova Ordem / Agendamento";
    document.getElementById('btnSalvar').innerText = "Confirmar Agendamento";
    document.getElementById('btnCancelar').style.display = "none";
}