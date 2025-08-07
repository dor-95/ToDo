const btnAdiciona = document.getElementById("btnAdiciona");

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

function adicionaTarefa(tarefa) {
    
    const container = document.createElement("div");
    container.classList.add("container__task");

    const containerDescricao = document.createElement("div");
    const inputTarefa = document.createElement("input");
    inputTarefa.type = "text";
    inputTarefa.classList.add("task__text");
    inputTarefa.value = tarefa;
    inputTarefa.disabled = true;
    containerDescricao.appendChild(inputTarefa);

    const containerButtons = document.createElement("div");
    containerButtons.classList.add("container__buttons");

    icons.forEach((item, index) => {
        if (index >= 1) {
            const button = document.createElement("button");
            button.classList.add("btn__padrao");

            button.addEventListener("click", (e) => {
                btnEvento[index - 1](e);
            })

            const icon = document.createElement("i");
            icon.classList.add(icons[0], item);

            button.appendChild(icon);
            containerButtons.appendChild(button);
        }
    });

    container.appendChild(containerDescricao);
    container.appendChild(containerButtons);

    containerTask.appendChild(container);
}

function concluirTarefa(e) {
    const botao = e.target.closest('button');
    if (!botao) return;

    const container = botao.closest('.container__task');
    if (!container) return;

    const texto = container.querySelector('.task__text');
    if (texto) {
        texto.classList.toggle('check');
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