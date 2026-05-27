const API_VEICULOS = 'http://localhost:8080/api/veiculos';
const API_CLIENTES = 'http://localhost:8080/api/clientes';
let veiculoEmEdicaoId = null; // Controla se estamos editando

document.addEventListener('DOMContentLoaded', () => {
    carregarClientesNoSelect();
    buscarVeiculos();
    configurarFormulario();
    configurarBotaoCancelar();
});

// 1. CARREGA OS CLIENTES NO SELECT
async function carregarClientesNoSelect() {
    try {
        const response = await fetch(API_CLIENTES);
        const clientes = await response.json();
        const select = document.getElementById('selectCliente');
        
        // Mantém apenas a opção padrão limpa antes de preencher
        select.innerHTML = '<option value="">Selecione um cliente...</option>';

        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.text = `${cliente.nome} (ID: ${cliente.id})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
    }
}

// 2. BUSCA E LISTA OS VEÍCULOS (GET)
async function buscarVeiculos() {
    try {
        const response = await fetch(API_VEICULOS);
        if (!response.ok) throw new Error('Erro ao buscar veículos');

        const veiculos = await response.json();
        const tabela = document.getElementById('tabelaVeiculos');
        tabela.innerHTML = '';

        veiculos.forEach(veiculo => {
            const donoNome = veiculo.cliente ? veiculo.cliente.nome : 'Sem dono';
            const donoId = veiculo.cliente ? veiculo.cliente.id : '';

            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${veiculo.id}</td>
                <td><strong>${veiculo.marca} ${veiculo.modelo}</strong> (${veiculo.ano || '-'})</td>
                <td><span style="background: #29292e; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${veiculo.placa.toUpperCase()}</span></td>
                <td>${donoNome}</td>
                <td>
                    <button class="btn-editar" onclick="prepararEdicao(${veiculo.id}, ${donoId}, '${veiculo.marca}', '${veiculo.modelo}', ${veiculo.ano || 'null'}, '${veiculo.placa}')">Editar</button>
                    <button class="btn-deletar" onclick="excluirVeiculo(${veiculo.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

// 3. CADASTRAR OU ATUALIZAR VEÍCULO (POST / PUT)
function configurarFormulario() {
    const form = document.getElementById('formVeiculo');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const clienteId = document.getElementById('selectCliente').value;
        const marca = document.getElementById('marca').value;
        const modelo = document.getElementById('modelo').value;
        const ano = document.getElementById('ano').value;
        const placa = document.getElementById('placa').value;

        const dadosVeiculo = {
            marca,
            modelo,
            ano: ano ? parseInt(ano) : null,
            placa,
            cliente: { id: parseInt(clienteId) }
        };

        let url = API_VEICULOS;
        let metodo = 'POST';

        if (veiculoEmEdicaoId !== null) {
            url = `${API_VEICULOS}/${veiculoEmEdicaoId}`;
            metodo = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosVeiculo)
            });

            if (response.ok) {
                alert(veiculoEmEdicaoId !== null ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!');
                resetarEstadoFormulario();
                buscarVeiculos();
            } else {
                alert('Erro ao salvar veículo. Verifique se a placa já não existe.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
        }
    });
}

// 4. JOGA OS DADOS DO CARRO PRO FORMULÁRIO
function prepararEdicao(id, clienteId, marca, modelo, ano, placa) {
    veiculoEmEdicaoId = id;

    document.getElementById('selectCliente').value = clienteId;
    document.getElementById('marca').value = marca;
    document.getElementById('modelo').value = modelo;
    document.getElementById('ano').value = ano !== null ? ano : '';
    document.getElementById('placa').value = placa;

    document.getElementById('tituloForm').innerText = `✏️ Editando Veículo (ID: ${id})`;
    document.getElementById('btnSalvar').innerText = "Atualizar Veículo";
    document.getElementById('btnCancelar').style.display = "block";
}

// 5. EXCLUIR VEÍCULO (DELETE)
async function excluirVeiculo(id) {
    if (confirm('Deseja realmente remover este veículo da oficina? Se ele tiver ordens de serviço/agendamentos vinculados, a exclusão pode ser bloqueada.')) {
        try {
            const response = await fetch(`${API_VEICULOS}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Veículo removido com sucesso!');
                buscarVeiculos();
                if (veiculoEmEdicaoId === id) resetarEstadoFormulario();
            } else {
                alert('Erro ao excluir. Remova primeiro os agendamentos vinculados a este veículo.');
            }
        } catch (error) {
            console.error('Erro ao deletar veículo:', error);
        }
    }
}

// 6. CONFIGURA O BOTÃO CANCELAR
function configurarBotaoCancelar() {
    document.getElementById('btnCancelar').addEventListener('click', () => {
        resetarEstadoFormulario();
    });
}

function resetarEstadoFormulario() {
    veiculoEmEdicaoId = null;
    document.getElementById('formVeiculo').reset();
    document.getElementById('tituloForm').innerText = "Novo Veículo";
    document.getElementById('btnSalvar').innerText = "Salvar Veículo";
    document.getElementById('btnCancelar').style.display = "none";
}