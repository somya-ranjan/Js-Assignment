const todoList = {
  todos: [],
  dragStartIndex: "",

  addTodo: function (todoName, array, indexToInsertIn) {
    array.splice(indexToInsertIn, 0, {
      todoName: todoName,
      completed: false,
      children: [],
      id: lStorage.uuid(),
      collapsed: false,
      parent: (array + "").replace(".children", ""),
    })
    return array[indexToInsertIn].id
  },

  editTodo: function (todo, newTodoName) {
    todo.todoName = newTodoName;
  },

  deleteTodo: function (indexOfTodo, array) {
    array.splice(indexOfTodo, 1);
  },

  completTodo: function (todo, completFlag) {
    if (todo.completed === false || completFlag === true) {
      todo.completed = true;
    } else {
      todo.completed = false;
    }
    // // for nested Todos
    for (let i = 0; i < todo.children.length; i++) {
      this.completTodo(todo.children[i], completFlag);
    }
  },

  deleteAll: function () {
    this.todos = [];
  },

}


let moduleContainer=document.querySelector('.module_container')
let module=document.querySelector('.module_container_hero')
const mainHandlers = {
  openModule: function(){
    moduleContainer.style.display="flex"
    module.className="moduleOpen module_container_hero"
  },
  closeModule: function(){
    let todoInput = document.querySelector('.todo_input');
    todoInput.value = "";
    moduleContainer.style.display="none"
  },
  addTodo: function () {
    let todoInput = document.querySelector('.todo_input');
    todoList.addTodo(todoInput.value, todoList.todos, todoList.todos.length);
    todoInput.value = "";
    moduleContainer.style.display="none"
    view.render();
  },

  deleteAll: function () {
    todoList.deleteAll();
    view.render();
  },

  searchToDo: function(){
    view.createSearchToDo()
  }
}

const view = {
  render: function () {
    let ul = document.querySelector(".todo_list");
    ul.innerHTML = ""
    if (todoList.todos.length === 0) {
      let noTodosP = document.createElement('p');
      noTodosP.textContent = "Add Your Daily Task";
      ul.appendChild(noTodosP);
    }
    this.renderList(todoList.todos, ul);
    lStorage.store('todoListData', todoList.todos)
    document.querySelector(".todo_input").focus();
  },

  renderList: function (array, ulToAppendTo) {
    for (let i = 0; i < array.length; i++) {
      this.createTodoLi(array[i], i, array, ulToAppendTo)
      if (array[i].children.length > 0) {
        let nestedUl = document.createElement('ul');
        ulToAppendTo.appendChild(nestedUl);
        this.renderList(array[i].children, nestedUl);
      }
    }
  },

  createTodoLi: function (todo, indexOfTodo, array, ulToAppendTo) {
    let todoLi = document.createElement("li")
    todoLi.setAttribute('draggable', true);
    let id = todo.id;
    todoLi.id = id;
    let todoTextP = this.createTodoP(todo.todoName, id);
    if (todo.completed === true) {
      todoLi.className += 'completed';
    }

    let deleteButton = this.createDeleteButton(indexOfTodo, array);
    let completButton = this.createTaskCompletedButton(todo);
    let editInput = this.createEditInput(todo, indexOfTodo, array, id);
    let addSubTodoButton = this.createAddSubTodoButton(todo.children);

    ulToAppendTo.appendChild(todoLi);
    todoLi.appendChild(todoTextP);
    todoLi.appendChild(editInput);
    todoLi.appendChild(deleteButton);
    todoLi.appendChild(completButton);
    todoLi.appendChild(addSubTodoButton);

    view.createDragAndDrop()
  },

  createTodoP: function (text, id) {
    let p = document.createElement('span');
    p.textContent = text || 'New Todo';
    p.id = id + 'span'
    p.addEventListener('click', function () {
      let p = document.getElementById(id + 'span');
      let editInput = document.getElementById(id + "editInput");
      editInput.style.display = 'block';
      p.style.display = 'none';
      editInput.focus();
    })

    return p;
  },

  createEditInput: function (todo, indexOfTodo, array, id) {
    let editInput = document.createElement('input');
    editInput.value = todo.todoName;
    editInput.id = id + "editInput";
    editInput.style.display = 'none';

    editInput.addEventListener('keyup', function (e) {
      todoList.editTodo(todo, editInput.value);
    })

    return editInput;
  },

  createDeleteButton: function (indexOfTodo, array) {
    let deleteButton = document.createElement('button');
    deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
    deleteButton.className = 'delete_task_btn'
    deleteButton.onclick = function () {
      todoList.deleteTodo(indexOfTodo, array);
      view.render();
    };
    return deleteButton;
  },

  createTaskCompletedButton: function (todo) {
    let complet_Button = document.createElement('button');
    complet_Button.innerHTML = '<i class="fas fa-check"></i>';
    complet_Button.className = 'complet_task_btn';
    complet_Button.onclick = function () {
      todoList.completTodo(todo);
      view.render();
    };
    return complet_Button;
  },

  createAddSubTodoButton: function (array) {
    let addSubTodoButton = document.createElement('button');
    addSubTodoButton.innerHTML = '<i class="fas fa-plus"></i>';
    addSubTodoButton.className = 'sub_task_add_btn';

    addSubTodoButton.onclick = function () {
      let subtodoId = todoList.addTodo('New SubTodo', array, array.length);
      view.render();
      let subTodoP = document.getElementById(subtodoId + "span")
      subTodoP.click();
    }

    return addSubTodoButton;
  },
  
  createDragAndDrop: function () {
    let allUl=document.querySelectorAll("ul")
    allUl.forEach((uL)=>{
      let items = uL.getElementsByTagName("li"), current = null;
      for (let i of items) {
    
        i.ondragstart = (ev) => {
          current = i;
          for (let it of items) {

          }
        };
    
        i.ondragenter = (ev) => {
         
        };
    
        i.ondragleave = () => {

        };
    
        i.ondragend = () => { 
          
        };
    
        i.ondragover = (evt) => {
           evt.preventDefault(); 
        };
    
        i.ondrop = (evt) => {
          evt.preventDefault();
          if (i != current) {
            let currentpos = 0, droppedpos = 0;
            for (let it=0; it<items.length; it++) {
              if (current == items[it]) { currentpos = it; }
              if (i == items[it]) { droppedpos = it; }
            }
            if (currentpos < droppedpos) {
              i.parentNode.insertBefore(current, i.nextSibling);
            } else {
              i.parentNode.insertBefore(current, i);
            }
          }
        };
      }
    })
  },

  createSearchToDo: function () {
    let searchInput = document.getElementById("searchBox").value
    let todoListItems = document.querySelectorAll("li")
    todoListItems.forEach((item) => {
      let list = item.innerText
      let re = new RegExp(searchInput, 'gi')
      if (list.match(re)) {
        item.style.display = "block"
      } else {
        item.style.display = "none"
      }
    })
  }
}


// // storage
const lStorage = {
  store: function (nameSpace, data) {
    if (arguments.length < 2) {
      let store = localStorage.getItem(nameSpace);
      return (store && JSON.parse(store)) || [];
    } else {
      return localStorage.setItem(nameSpace, JSON.stringify(data));
    }
  },

  uuid: function () {
    let i, random;
    let uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
  },
}

// // storage
todoList.todos = lStorage.store('todoListData')
view.render(document.querySelector('.todo_input'));
