const API_URL = 'http://localhost:8080/api/clientes';
let clienteEmEdicaoId = null; // Controla se estamos editando ou criando

document.addEventListener('DOMContentLoaded', () => {
    buscarClientes();
    configurarFormulario();
    configurarBotaoCancelar();
});

// 1. BUSCAR E LISTAR CLIENTES (GET)
async function buscarClientes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar dados do servidor');
        
        const clientes = await response.json();
        const tabela = document.getElementById('tabelaClientes');
        tabela.innerHTML = ''; 

        clientes.forEach(cliente => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${cliente.id}</td>
                <td><strong>${cliente.nome}</strong></td>
                <td>${cliente.telefone || '-'}</td>
                <td>${cliente.email || '-'}</td>
                <td>
                    <button class="btn-editar" onclick="prepararEdicao(${cliente.id}, '${cliente.nome}', '${cliente.telefone || ''}', '${cliente.email || ''}')">Editar</button>
                    <button class="btn-deletar" onclick="excluirCliente(${cliente.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

// 2. CADASTRAR OU ATUALIZAR CLIENTE (POST / PUT)
function configurarFormulario() {
    const form = document.getElementById('formCliente');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;

        const dadosCliente = { nome, telefone, email };

        let url = API_URL;
        let metodo = 'POST';

        // Se a variável tiver um ID, muda a rota e o método para PUT (Editar)
        if (clienteEmEdicaoId !== null) {
            url = `${API_URL}/${clienteEmEdicaoId}`;
            metodo = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCliente)
            });

            if (response.ok) {
                alert(clienteEmEdicaoId !== null ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
                resetarEstadoFormulario();
                buscarClientes(); 
            } else {
                alert('Erro ao salvar os dados.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
        }
    });
}

// 3. COLOCA OS DADOS DA TABELA NO FORMULÁRIO PARA EDITAR
function prepararEdicao(id, nome, telefone, email) {
    clienteEmEdicaoId = id;
    
    document.getElementById('nome').value = nome;
    document.getElementById('telefone').value = telefone;
    document.getElementById('email').value = email;

    // Altera a identidade visual do formulário
    document.getElementById('tituloForm').innerText = "✏️ Editando Cliente (ID: " + id + ")";
    document.getElementById('btnSalvar').innerText = "Atualizar Dados";
    document.getElementById('btnCancelar').style.display = "block";
}

// 4. EXCLUIR CLIENTE (DELETE)
async function excluirCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente? Se ele tiver veículos cadastrados, o banco pode recusar ou deletar os carros junto.')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Cliente excluído com sucesso!');
                buscarClientes();
                if (clienteEmEdicaoId === id) resetarEstadoFormulario();
            } else {
                alert('Não foi possível excluir. Verifique se existem veículos vinculados a este cliente.');
            }
        } catch (error) {
            console.error('Erro ao deletar:', error);
        }
    }
}

// 5. CONFIGURAÇÃO DO BOTÃO CANCELAR
function configurarBotaoCancelar() {
    document.getElementById('btnCancelar').addEventListener('click', () => {
        resetarEstadoFormulario();
    });
}

// Auxiliar para limpar o estado de edição e reverter o formulário para modo "Novo"
function resetarEstadoFormulario() {
    clienteEmEdicaoId = null;
    document.getElementById('formCliente').reset();
    document.getElementById('tituloForm').innerText = "Novo Cliente";
    document.getElementById('btnSalvar').innerText = "Salvar Cliente";
    document.getElementById('btnCancelar').style.display = "none";
}