const API_URL = 'http://localhost:8080/api/clientes';

// Executa assim que a página carrega no navegador
document.addEventListener('DOMContentLoaded', () => {
    buscarClientes();
    configurarFormulario();
});

// 1. FUNÇÃO PARA BUSCAR CLIENTES (GET)
async function buscarClientes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar dados do servidor');
        
        const clientes = await response.json();
        const tabela = document.getElementById('tabelaClientes');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher para não duplicar

        clientes.forEach(cliente => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${cliente.id}</td>
                <td><strong>${cliente.nome}</strong></td>
                <td>${cliente.telefone || '-'}</td>
                <td>${cliente.email || '-'}</td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Não foi possível carregar a lista de clientes. O backend Java está rodando?');
    }
}

// 2. FUNÇÃO PARA CADASTRAR CLIENTE (POST)
function configurarFormulario() {
    const form = document.getElementById('formCliente');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede a página de recarregar e quebrar o fluxo

        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;

        const novoCliente = { nome, telefone, email };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoCliente)
            });

            if (response.ok) {
                alert('Cliente cadastrado com sucesso!');
                form.reset();      // Limpa os inputs do formulário
                buscarClientes();  // Recarrega a tabela mostrando o novo cliente
            } else {
                alert('Erro ao salvar o cliente no banco.');
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            alert('Erro de conexão com o servidor Java.');
        }
    });
}