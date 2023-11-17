const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function Task(title, description = '', difficulty, expireDate) {
  this.title = title;
  this.description = description;
  this.status = "pendiente";
  this.creationDate = new Date();
  this.lastEditDate = new Date();
  this.expireDate = expireDate;
  this.difficulty = difficulty;
}

Task.prototype.changeStatus = function(newStatus) {
  this.status = newStatus;
};

Task.prototype.showTask = function() {
  console.log("Titulo:", this.title);
  console.log("Estado:", this.status);
  console.log("Descripción:", this.description);
  console.log("Fecha de creación:", this.creationDate);
  console.log("Fecha de vencimiento:", this.expireDate);
  console.log("Dificultad:", this.getDifficultyStars());
  console.log("Última edición:", this.lastEditDate);
};

Task.prototype.getDifficultyStars = function() {
  switch (this.difficulty.toLowerCase()) {
    case 'baja':
      return '★☆☆';
    case 'media':
      return '★★☆';
    case 'alta':
      return '★★★';
    default:
      return this.difficulty;
  }
};

Task.prototype.editTask = function(newTitle, newDescription, newStatus, newDifficulty, newExpireDate) {
  this.title = newTitle || this.title;
  this.description = newDescription || this.description;
  this.status = newStatus || this.status;
  this.difficulty = newDifficulty || this.difficulty;
  this.expireDate = newExpireDate || this.expireDate;
  this.lastEditDate = new Date();

  console.log("Tarea editada con éxito.");
};

const taskList = [];

function createTask(title, description, difficulty, expireDate) {
  const task = new Task(title, description, difficulty, expireDate);
  taskList.push(task);
}

function showTaskAndEdit(task) {
  task.showTask();

  rl.question("\nPresione 'E' para editar la tarea, '0' para volver: \n", (response) => {
    if (response.toLowerCase() === 'e') {
      editTask(task);
    } else if (response === '0') {
      mainMenu();
    } else {
      console.log("Opción no válida. Volviendo al Menú Principal.");
      mainMenu();
    }
  });
}

function editTask(task) {
  rl.question("Nuevo título (Enter para mantener el actual): ", (newTitle) => {
    rl.question("Nueva descripción (Enter para mantener la actual): ", (newDescription) => {
      rl.question("Nuevo estado (en curso/pendiente/terminada) (Enter para mantener el actual): ", (newStatus) => {
        rl.question("Nueva dificultad (Enter para mantener la actual): ", (newDifficulty) => {
          rl.question("Nueva fecha de vencimiento (formato dd/mm/yyyy, Enter para mantener la actual): ", (newExpireDate) => {
            task.editTask(newTitle, newDescription, newStatus, newDifficulty, newExpireDate);

            rl.question("Presiona Enter para volver al Menú Principal.", () => {
              mainMenu();
            });
          });
        });
      });
    });
  });
}

function displayMainMenu() {
  console.log("Menú principal");
  console.log("1. Ver mis tareas\n2. Buscar una tarea\n3. Crear tarea\n0. Salir");
}

function displaySubMenu() {
  console.log("Qué tareas deseas ver?");
  console.log("1. Todas\n2. Pendientes\n3. En curso\n4. Terminadas\n5. Volver\n");
}

function mainMenu() {
  rl.question("Presiona Enter para mostrar el Menú Principal.", () => {

    displayMainMenu();

    rl.question("?", (main_menu) => {
      switch (main_menu) {
        case '1':
          displaySubMenu();

          rl.question("?", (sub_menu) => {
            switch (sub_menu) {
              case '1': // Todas
                console.log("Mostrando todas las tareas...\n");

                taskList.sort((a, b) => a.title.localeCompare(b.title));

                for (let i = 0; i < taskList.length; i++) {
                  taskList[i].showTask();
                }

                rl.question("Presiona Enter para volver al Menú Principal.", () => {
                  mainMenu();
                });
                break;

              case '3': // En curso
                console.log("Mostrando todas las tareas en curso...\n");

                for (let i = 0; i < taskList.length; i++) {
                  if (taskList[i].status.toLowerCase() === "en curso") {
                    taskList[i].showTask();
                  }
                }
                break;

              case '4': // Terminadas
                console.log("Mostrando todas las tareas terminadas...\n");

                for (let i = 0; i < taskList.length; i++) {
                  if (taskList[i].status.toLowerCase() === "terminada") {
                    taskList[i].showTask();
                  }
                }
                break;

              default:
                console.log("Respuesta inválida. Vuelva a intentarlo.\n");
                break;
            }
            rl.question("Presiona Enter para volver al Menú Principal.", () => {
              displayMainMenu();
            });
          });
          break;

        case '2':
          rl.question("Ingrese el título de la tarea a buscar: ", (taskTitle) => {
            let taskFound = false;
            for (let i = 0; i < taskList.length; i++) {
              if (taskList[i].title === taskTitle) {
                showTaskAndEdit(taskList[i]);
                taskFound = true;
                break;
              }
            }

            if (!taskFound) {
              console.log("Tarea no encontrada.");
            }

            rl.question("Presiona Enter para volver al Menú Principal.", () => {
              mainMenu();
            });
          });
          break;

        case '3':
          rl.question("Ingrese el título de la tarea: ", (title) => {
            rl.question("Ingrese la descripción de la tarea: ", (description) => {
              rl.question("Ingrese la dificultad de la tarea (baja/media/alta): ", (difficulty) => {
                rl.question("Ingrese la fecha de vencimiento (formato dd/mm/yyyy): ", (expireDate) => {
                  createTask(title, description, difficulty, expireDate);
                  console.log("Tarea creada con éxito.");
                  rl.question("Presiona Enter para volver al Menú Principal.", () => {
                    mainMenu();
                  });
                });
              });
            });
          });
          break;

        case '0':
          console.log("Fin del programa \n");
          rl.close();
          break;

        default:
          console.log("Opción no válida. Intente de nuevo.");
          mainMenu();
          break;
      }
    });

  });
}

mainMenu();

