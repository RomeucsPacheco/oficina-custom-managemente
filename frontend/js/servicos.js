const API_SERVICOS = 'http://localhost:8080/api/servicos';
let servicoEmEdicaoId = null;

document.addEventListener('DOMContentLoaded', () => {
    buscarServicos();
    configurarFormulario();
    configurarBotaoCancelar();
});

// 1. BUSCA OS SERVIÇOS (GET)
async function buscarServicos() {
    try {
        const response = await fetch(API_SERVICOS);
        if (!response.ok) throw new Error('Erro ao buscar serviços');

        const servicos = await response.json();
        const tabela = document.getElementById('tabelaServicos');
        tabela.innerHTML = '';

        servicos.forEach(servico => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${servico.id}</td>
                <td><strong>${servico.nomeServico}</strong></td>
                <td><span style="color: #00b37e;">${servico.categoria}</span></td>
                <td>R$ ${servico.precoBase.toFixed(2)}</td>
                <td>
                    <button class="btn-editar" onclick="prepararEdicao(${servico.id}, '${servico.nomeServico}', '${servico.categoria}', ${servico.precoBase}, ${servico.tempoEstimadoHoras || 'null'})">Editar</button>
                    <button class="btn-deletar" onclick="excluirServico(${servico.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

// 2. CADASTRAR OU ATUALIZAR SERVIÇO (POST / PUT)
function configurarFormulario() {
    const form = document.getElementById('formServico');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nomeServico = document.getElementById('nomeServico').value;
        const category = document.getElementById('categoria').value;
        const price = document.getElementById('precoBase').value;
        const hours = document.getElementById('tempoEstimado').value;

        const dadosServico = {
            nomeServico,
            categoria: category,
            precoBase: parseFloat(price),
            tempoEstimadoHoras: hours ? parseInt(hours) : null
        };

        let url = API_SERVICOS;
        let metodo = 'POST';

        if (servicoEmEdicaoId !== null) {
            url = `${API_SERVICOS}/${servicoEmEdicaoId}`;
            metodo = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosServico)
            });

            if (response.ok) {
                alert(servicoEmEdicaoId !== null ? 'Serviço atualizado com sucesso!' : 'Serviço cadastrado com sucesso!');
                resetarEstadoFormulario();
                buscarServicos();
            } else {
                alert('Erro ao salvar o serviço.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
        }
    });
}

// 3. COLOCA OS DADOS NO FORMULÁRIO PARA EDIÇÃO
function prepararEdicao(id, nome, categoria, preco, horas) {
    servicoEmEdicaoId = id;

    document.getElementById('nomeServico').value = nome;
    document.getElementById('categoria').value = categoria;
    document.getElementById('precoBase').value = preco;
    document.getElementById('tempoEstimado').value = horas !== null ? horas : '';

    document.getElementById('tituloForm').innerText = `✏️ Editando Serviço (ID: ${id})`;
    document.getElementById('btnSalvar').innerText = "Atualizar Serviço";
    document.getElementById('btnCancelar').style.display = "block";
}

// 4. EXCLUIR SERVIÇO (DELETE)
async function excluirServico(id) {
    if (confirm('Tem certeza que deseja remover este serviço da oficina? Se houver agendamentos usando ele, a operação falhará.')) {
        try {
            const response = await fetch(`${API_SERVICOS}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Serviço excluído com sucesso!');
                buscarServicos();
                if (servicoEmEdicaoId === id) resetarEstadoFormulario();
            } else {
                alert('Não foi possível excluir. Remova primeiro as Ordens de Serviço ligadas a ele.');
            }
        } catch (error) {
            console.error('Erro ao deletar:', error);
        }
    }
}

// 5. CONFIGURA BOTÃO CANCELAR
function configurarBotaoCancelar() {
    document.getElementById('btnCancelar').addEventListener('click', () => {
        resetarEstadoFormulario();
    });
}

function resetarEstadoFormulario() {
    servicoEmEdicaoId = null;
    document.getElementById('formServico').reset();
    document.getElementById('tituloForm').innerText = "Novo Serviço / Modificação";
    document.getElementById('btnSalvar').innerText = "Salvar Serviço";
    document.getElementById('btnCancelar').style.display = "none";
}