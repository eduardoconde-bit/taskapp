tableHeader = `
  <table class="table mx-auto columns is-vcentered is-bordered">
  <tr>
      <th>Título</th>
      <th>Descrição da Tarefa</th>
      <th>Acão</th>
  </tr>
`;

tableEnd = `
  </table>
`;

listHtml = `
  <tr>
    <td>{0}</td>
    <td>{1}</td>
    <td>
      <button onclick="removeTask(this)" id="{2}" class="button is-danger is-mall m-1" type="button">Excluir</button>
      <button id="{3}" class="button is-warning is-mall m-1 js-modal-trigger" data-target="modal-update">Editar</button>
    </td>
  </tr>
`;

document.addEventListener("DOMContentLoaded", () => {
  let form = document.getElementById("create-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    
    document.querySelectorAll("#create-form input, #create-form textarea").forEach(($element) => {
      $element.readOnly = true;
    })
    
    await createTask(formData);
    
    document.querySelectorAll("#create-form input, #create-form textarea").forEach(($element) => {
      $element.readOnly = false;
      $element.value = null;
    })

  })
})

//Modal Functions
function openModal($el) {
  $el.classList.add('is-active');
}

function closeModal($el) {
  $el.classList.remove('is-active');
}

function closeAllModals() {
  (document.querySelectorAll('.modal') || []).forEach(($modal) => {
    closeModal($modal);
  });
}

// Add a click event on buttons to open a specific modal
function modalTrigger() {
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });
}

function modalClose() {
  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });
}

function modalKeyEvent() {
  document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  modalTrigger();
  modalClose();
  modalKeyEvent();
})

function sprintf(format, ...args) {
  return format.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[index] !== 'undefined' ? args[index] : match;
  });
}

async function showTasks() {
  try {
    let response = await fetch('https://tasks-ten-red.vercel.app/api/api.php');
    let data = await response.json();
    let sectionList = document.getElementById("task-container")
    let table;

    //clear task table
    sectionList.innerHTML = "";

    table = tableHeader;

    data.forEach(task => {
      let rowTable = listHtml;
      table += sprintf(rowTable, task.title, task.description, task.id, task.id);
    });
    table += tableEnd;
    sectionList.insertAdjacentHTML("afterbegin", table);

    modalTrigger();

  } catch (error) {
    console.error("Erro: ", error);
  }

}

document.addEventListener('DOMContentLoaded', showTasks);

async function createTask(formData) {
  let bodyContent = JSON.stringify({
    "title": formData.get("title"),
    "description": formData.get("description")
  });

  let response = await fetch("https://tasks-ten-red.vercel.app/api/api.php", {
    method: "POST",
    body: bodyContent
  });

  let success = await response.json();
  success.success ? alert("Tarefa criada com Sucesso!") : alert("Não Foi Possível Criar Tarefa");
  showTasks();
}

async function removeTask(button) {
  let sectionList = document.getElementById("task-container")

  let bodyContent = JSON.stringify({
    "id": button.id
  });

  let response = await fetch('https://tasks-ten-red.vercel.app/api/api.php', {
    method: "DELETE",
    body: bodyContent
  });

  let success = await response.json();
  success.success ? alert("Excluído Com Sucesso!") : alert("Não Foi Possível Excluir Tarefa");
  showTasks();
}

async function updateTask(button) {
  alert('update');
}
