// ============================================================
// public/js/tutores.js
// ============================================================
// ESTE ARQUIVO É COM VOCÊ (ALUNO DESENVOLVE).
//
// A estrutura abaixo (elementos, eventos já conectados, nomes de
// função) já está pronta para vocês seguirem o mesmo padrão usado
// em outros projetos do curso (inicializar() no topo, funções
// carregarX() e renderizarX() separadas). O que falta é o conteúdo
// de cada função marcada com TODO.
//
// EXEMPLOS DE APOIO (pasta exemplos/):
//   - exemplo-montar-tela.js : desenhar a tabela, botões Editar e
//                              Excluir, levar os dados para o formulário
//   - exemplo-fetch.js       : todos os tipos de fetch (GET, busca,
//                              POST, PUT e DELETE)
//
// Requisitos envolvidos neste arquivo: RF-12, RF-13, RF-14, RF-15, RF-17
// ============================================================

const corpoTabela = document.getElementById('corpo-tabela-tutores');
const tabela = document.getElementById('tabela-tutores');
const mensagemTutores = document.getElementById('mensagem-tutores');

const inputBusca = document.getElementById('input-busca');
const btnBuscar = document.getElementById('btn-buscar');

const formTutor = document.getElementById('form-tutor');
const tutorIdInput = document.getElementById('tutor-id');
const tutorNomeInput = document.getElementById('tutor-nome');
const tutorCpfInput = document.getElementById('tutor-cpf');
const tutorTelefoneInput = document.getElementById('tutor-telefone');
const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');

inicializar();

async function inicializar() {
    await carregarTutores();
}

// ------------------------------------------------------------
// RF-12: listar tutores
// RF-14: também é usada para a busca (aceita um termo opcional)
// ------------------------------------------------------------
async function carregarTutores(termoBusca = '') {
    try {
        const url = termoBusca
            ? `/api/tutores?busca=${encodeURIComponent(termoBusca)}`
            : '/api/tutores';

        const resposta = await fetch(url);

        if (resposta.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (!resposta.ok) {
            throw new Error('Erro ao buscar tutores.');
        }

        const tutores = await resposta.json();
        renderizarTutores(tutores);

    } catch (erro) {
        mensagemTutores.textContent = 'Erro ao carregar tutores.';
        console.error(erro);
    }
}

// ------------------------------------------------------------
// Desenha a tabela de tutores na tela
// ------------------------------------------------------------
function renderizarTutores(tutores) {

    // Lista vazia: mostra a mensagem, esconde a tabela e PARA.
    if (tutores.length === 0) {
        mensagemTutores.textContent = 'Nenhum tutor encontrado.';
        mensagemTutores.classList.remove('d-none');
        tabela.classList.add('d-none');
        corpoTabela.innerHTML = '';
        return;
    }

    // Tem dados: esconde a mensagem e mostra a tabela.
    mensagemTutores.classList.add('d-none');
    tabela.classList.remove('d-none');

    // .map() transforma CADA livro numa linha de HTML (texto);
    // .join('') junta todas as linhas num texto só;
    // innerHTML coloca esse texto dentro do <tbody>.
    corpoTabela.innerHTML = tutores.map(tutores => {
        return `
            <tr>
                <td>${tutores.nome}</td>
                <td>${livro.login || '-'}</td>
                <td>${livro.senha}</td>
                <td>${formatarTutores(livro.data_publicacao)}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-editar" data-id="${livro.id}">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-excluir" data-id="${livro.id}">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // ----------------------------------------------------------
    // D) Ligar os botões de cada linha
    // ----------------------------------------------------------
    // ATENÇÃO: isto precisa vir DEPOIS do innerHTML acima. Os
    // botões só passam a existir quando o innerHTML é executado;
    // antes disso o querySelectorAll não encontra nada.
    //
    // data-id="${livro.id}" guardou o id dentro do botão, e
    // botao.dataset.id devolve esse valor (sempre como TEXTO).

    document.querySelectorAll('.btn-editar').forEach(botao => {
        botao.addEventListener('click', () => {
            const id = botao.dataset.id;

            // find procura, na lista que já temos, o livro desse id.
            // Usamos == (e não ===) porque dataset.id é texto e
            // livro.id é número.
            const livro = livros.find(item => item.id == id);

            if (!livro) {
                return;
            }

            preencherFormulario(livro);
        });
    });

    document.querySelectorAll('.btn-excluir').forEach(botao => {
        botao.addEventListener('click', () => {
            excluirLivro(botao.dataset.id);
        });
    });
}

// ------------------------------------------------------------
// RF-14: busca
// ------------------------------------------------------------
btnBuscar.addEventListener('click', () => {
    // TODO: pegue o valor de inputBusca.value e chame
    // carregarTutores(termo)
});

// ------------------------------------------------------------
// RF-15 / RF-17: salvar (inserir novo ou editar existente)
// ------------------------------------------------------------
formTutor.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const tutor = {
        nome: tutorNomeInput.value.trim(),
        cpf: tutorCpfInput.value.trim(),
        telefone: tutorTelefoneInput.value.trim()
    };

    const id = tutorIdInput.value;

    try {
        // TODO: se "id" estiver preenchido, é uma edição (RF-17) ->
        //   fetch PUT /api/tutores/{id}
        // Se estiver vazio, é um novo cadastro (RF-15) ->
        //   fetch POST /api/tutores
        // Em ambos os casos: enviar "tutor" como JSON no body,
        // conferir resposta.ok, e se der certo:
        //   - limpar o formulário (formTutor.reset())
        //   - esconder o botão de cancelar edição
        //   - chamar carregarTutores() de novo para atualizar a lista

    } catch (erro) {
        alert('Erro ao salvar tutor.');
        console.error(erro);
    }
});

btnCancelarEdicao.addEventListener('click', () => {
    formTutor.reset();
    tutorIdInput.value = '';
    btnCancelarEdicao.classList.add('d-none');
});

// ------------------------------------------------------------
// Chamada pelos botões "Editar" criados em renderizarTutores()
// ------------------------------------------------------------
function preencherFormularioParaEdicao(tutor) {
    // TODO: preencher tutorIdInput, tutorNomeInput, tutorCpfInput,
    // tutorTelefoneInput com os dados de "tutor", e mostrar o
    // botão btnCancelarEdicao (remover a classe d-none)
}

// ------------------------------------------------------------
// RF-13: excluir tutor
// Chamada pelos botões "Excluir" criados em renderizarTutores()
// ------------------------------------------------------------
async function excluirTutor(id) {
    if (!confirm('Deseja realmente excluir este tutor?')) return;

    try {
        // TODO: fetch DELETE /api/tutores/{id}, conferir resposta.ok,
        // e se der certo, chamar carregarTutores() de novo

    } catch (erro) {
        alert('Erro ao excluir tutor.');
        console.error(erro);
    }
}
