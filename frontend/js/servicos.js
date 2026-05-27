const API_SERVICOS = 'http://localhost:8080/api/servicos';

document.addEventListener('DOMContentLoaded', () => {
    buscarServicos();
    configurarFormulario();
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
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

// 2. CADASTRA UM NOVO SERVIÇO (POST)
function configurarFormulario() {
    const form = document.getElementById('formServico');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nomeServico = document.getElementById('nomeServico').value;
        const categoria = document.getElementById('categoria').value;
        const precoBase = document.getElementById('precoBase').value;
        const tempoEstimado = document.getElementById('tempoEstimado').value;

        const novoServico = {
            nomeServico,
            categoria,
            precoBase: parseFloat(precoBase),
            tempoEstimadoHoras: tempoEstimado ? parseInt(tempoEstimado) : null
        };

        try {
            const response = await fetch(API_SERVICOS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoServico)
            });

            if (response.ok) {
                alert('Serviço cadastrado com sucesso!');
                form.reset();
                buscarServicos();
            } else {
                alert('Erro ao salvar serviço.');
            }
        } catch (error) {
            console.error('Erro ao conectar na API:', error);
        }
    });
}