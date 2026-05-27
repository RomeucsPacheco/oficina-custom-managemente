const API_VEICULOS = 'http://localhost:8080/api/veiculos';
const API_CLIENTES = 'http://localhost:8080/api/clientes';

document.addEventListener('DOMContentLoaded', () => {
    carregarClientesNoSelect();
    buscarVeiculos();
    configurarFormulario();
});

// 1. CARREGA OS CLIENTES NO CAMPO DROP-DOWN DO FORMULÁRIO
async function carregarClientesNoSelect() {
    try {
        const response = await fetch(API_CLIENTES);
        const clientes = await response.json();
        const select = document.getElementById('selectCliente');

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
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${veiculo.id}</td>
                <td><strong>${veiculo.marca} ${veiculo.modelo}</strong> (${veiculo.ano || '-'})</td>
                <td><span style="background: #29292e; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${veiculo.placa.toUpperCase()}</span></td>
                <td>${veiculo.cliente ? veiculo.cliente.nome : 'Sem dono'}</td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

// 3. CADASTRA UM NOVO VEÍCULO (POST)
function configurarFormulario() {
    const form = document.getElementById('formVeiculo');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const clienteId = document.getElementById('selectCliente').value;
        const marca = document.getElementById('marca').value;
        const modelo = document.getElementById('modelo').value;
        const ano = document.getElementById('ano').value;
        const placa = document.getElementById('placa').value;

        // Estrutura o JSON exatamente como o Spring Boot espera (com o relacionamento)
        const novoVeiculo = {
            marca,
            modelo,
            ano: ano ? parseInt(ano) : null,
            placa,
            cliente: {
                id: parseInt(clienteId)
            }
        };

        try {
            const response = await fetch(API_VEICULOS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoVeiculo)
            });

            if (response.ok) {
                alert('Veículo cadastrado com sucesso!');
                form.reset();
                buscarVeiculos();
            } else {
                alert('Erro ao salvar veículo. Verifique se a placa já não está cadastrada.');
            }
        } catch (error) {
            console.error('Erro ao conectar na API:', error);
        }
    });
}