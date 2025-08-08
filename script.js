class Tarefa {

    static lista = [];

    constructor(descricao = '', isConcluida = false) {
        this.id = Tarefa.gerarId();
        this.descricao = descricao;
        this.isConcluida = isConcluida;
        Tarefa.lista.push(this);
    }

    getId() {
        return this.id;
    }

    static gerarId() {
        if (Tarefa.lista.length === 0) return 1;
        return Tarefa.lista[Tarefa.lista.length - 1].id + 1;
    }

    static getTarefaPorId(id) {
        return Tarefa.lista.find(tarefa => tarefa.id === parseInt(id));
    }

    static getTarefaPorDescricao(descricao) {
        const busca = descricao.toLowerCase();
        return Tarefa.lista.filter(tarefa =>
            tarefa.descricao.toLowerCase().includes(busca)
    );
}
}

const btnAdiciona = document.getElementById("btnAdiciona");
const inputPesquisa = document.getElementById("inputPesquisa");
const btnLimpar = document.getElementById("btnLimpar");
const selectStatus = document.getElementById("selectStatus");

const btnChecar = document.getElementsByClassName("checar");
const btnEditar = document.getElementsByClassName("editar");
const btnExcluir = document.getElementsByClassName("excluir");

const tarefa = document.getElementById("inputTarefa");
const containerTask = document.getElementById("containerTask");

const icons = ["fa-solid", "fa-check", "fa-pencil", "fa-xmark"];
const btnEvento = [
  (e) => concluirTarefa(e),
  (e) => editarTarefa(e),
  (e) => excluir(e)
];

inputPesquisa.addEventListener("input", function(e) {
    filtrarPorTexto(e.target.value)
})

function filtrarPorTexto(filtro) {
  filtro = filtro.toLowerCase();

  let tarefasFiltradas = Tarefa.getTarefaPorDescricao(filtro);

  filtrarPorTarefas(tarefasFiltradas);
}

function filtrarPorTarefas(tarefasFiltradas) {
  const idsFiltrados = tarefasFiltradas.map(t => t.id);

  const containers = document.querySelectorAll(".container__task");

  containers.forEach(container => {
    const id = Number(container.dataset.id);

    const mostrar = idsFiltrados.includes(id);

    container.style.display = mostrar ? 'flex' : 'none';
  });
}

btnLimpar.addEventListener("click", (e) => {
    inputPesquisa.value = '';
    inputPesquisa.dispatchEvent(new Event('input'));
});

selectStatus.addEventListener("change", function(e) {
    filtrarPorStatus(e.target.value);
})

function filtrarPorStatus(filtro) {
    const containers = document.querySelectorAll(".container__task");

    containers.forEach((container) => {
        const status = container.dataset.status;

        let mostrar = true;

        if (filtro === 'pendentes') {
            mostrar = status === 'false';
        } else if (filtro === 'concluidas') {
            mostrar = status === 'true';
        }

        container.style.display = mostrar ? 'flex' : 'none';

    });
}

btnAdiciona.addEventListener("click", (e) => {
    if (tarefa.value != '') {
        adicionaTarefa(tarefa.value);
    }
})

function adicionarEventos(botoes, handler) {
    Array.from(botoes).forEach((btn) => {
        btn.addEventListener("click", handler);
    });
}

adicionarEventos(btnChecar, concluirTarefa);
adicionarEventos(btnEditar, editarTarefa);
adicionarEventos(btnExcluir, excluir);

function adicionaTarefa(tarefaDescricao) {
    const novaTarefa = new Tarefa(tarefaDescricao);

    const tarefaElemento = criarElementoTarefa(novaTarefa);
    containerTask.appendChild(tarefaElemento);
}

function criarElementoTarefa(tarefa) {
    const container = document.createElement("div");
    container.classList.add("container__task");
    container.setAttribute('data-id', tarefa.id);
    container.setAttribute('data-status', tarefa.isConcluida);

    const containerDescricao = criarInputDescricao(tarefa.descricao);
    const containerButtons = criarBotoesTarefa();

    container.appendChild(containerDescricao);
    container.appendChild(containerButtons);

    return container;
}

function criarInputDescricao(descricao) {
    const containerDescricao = document.createElement("div");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("task__text");
    input.value = descricao;
    input.disabled = true;

    containerDescricao.appendChild(input);
    return containerDescricao;
}

function criarBotoesTarefa() {
    const containerButtons = document.createElement("div");
    containerButtons.classList.add("container__buttons");

    icons.slice(1).forEach((iconClass, index) => {
        const button = document.createElement("button");
        button.classList.add("btn__padrao");

        button.addEventListener("click", (e) => {
            btnEvento[index](e);
        });

        const icon = document.createElement("i");
        icon.classList.add(icons[0], iconClass); // ex: 'fa', 'fa-trash'

        button.appendChild(icon);
        containerButtons.appendChild(button);
    });

    return containerButtons;
}

function concluirTarefa(e) {
    const botao = e.target.closest('button');
    if (!botao) return;

    const container = botao.closest('.container__task');
    if (!container) return;

    const texto = container.querySelector('.task__text');
    if (texto) {
        texto.classList.toggle('check');
        const tarefa = Tarefa.getTarefaPorId(container.dataset.id);
        tarefa.isConcluida = !tarefa.isConcluida
        container.setAttribute('data-status', tarefa.isConcluida);
    }
}

function editarTarefa(e) {
    const botao = e.target.closest('button');
    const container = botao.closest('.container__task');
    const input = container.querySelector('.task__text');
    const icone = botao.querySelector('i');

    // Usa um atributo para marcar o estado
    const editando = botao.getAttribute('data-editando') === 'true';

    if (!editando) {
        input.disabled = false;
        input.classList.add('editando');
        input.focus();

        if (icone) {
            icone.className = 'fa-solid fa-floppy-disk';
        }

        botao.setAttribute('data-editando', 'true');
    } else {
        input.disabled = true;
        input.classList.remove('editando');

        if (icone) {
            icone.className = 'fa-solid fa-pencil';
        }

        botao.setAttribute('data-editando', 'false');
    }
}

function excluir(e) {
    let tarefa = e.target.closest(".container__task");
    if (!tarefa) return;
    tarefa.remove();
}

const descricoes = [
  'Ir no mercado',
  'Lavar o carro',
  'Estudar JavaScript',
  'Fazer exercícios físicos',
  'Organizar a mesa',
  'Ler um capítulo de livro'
];

for (let i = 0; i < descricoes.length; i++) {
  adicionaTarefa(descricoes[i]);
}

