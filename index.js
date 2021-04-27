const filterElem = document.getElementById("filters");
const todoListElem = document.getElementById("todo-list");
const bodyElem = document.body;
const itemsLeftElem = document.getElementById("item-left");
var todos = [];

/* Behavior for changing theme button */
document.querySelector("#main header .theme-btn").addEventListener("click", function print(){
    bodyElem.dataset.theme = bodyElem.dataset.theme === "dark" ? "light" : "dark"
});

/* 
separate filter div on small screen
put filter div on status bar on large screen
*/
(function repositionFilterElem(){
    const statusBar = document.querySelector("#main main .status-bar");
    const mainDivElem = document.getElementById("main");
    const mainElem = document.querySelector("#main main");
    var mediaQuery = window.matchMedia("(min-width: 40rem)");
    if(mediaQuery.matches){
        filterInStatusBar();
    }
    mediaQuery.addListener(function(query){
        if(query.matches){
            filterInStatusBar();
        } else {
            filterOutStatusBar();
        }
    })

    function filterInStatusBar(){
        mainDivElem.removeChild(filterElem);
        statusBar.appendChild(filterElem);
    }
    function filterOutStatusBar(){
        statusBar.removeChild(filterElem);
        mainElem.insertAdjacentElement('afterend', filterElem);
    }
})();

/**load todo saved in todos.json file
 * (mimiking the server behavior)
 */
(function loadTodos(){
    let request = new XMLHttpRequest();
    request.open('GET', "./todos.json");
    request.responseType = 'json';
    request.send();
    request.onload = function(){
        data = request.response;
        data.forEach(obj=>{
            addTodo(obj.task, obj.completed);
        });
    }
})();

(function createNewTodoBehavior(){
    const checkbox = document.querySelector("#new-todo .checkbox");
    const task = document.querySelector("#new-todo input");

    checkbox.addEventListener("click", function(){
        foo();
    })
    task.addEventListener("keypress", function(e){
        if(e.key === "Enter"){
            foo();
        }
    })

    function foo(){
        let s = task.value;
        task.value = null;
        if(s.match(/\S/g)){ // addTodo only if s has non-space characters
            addTodo(s);
        }
    }
})();

(function filterBehavior(){
    const filterSpans = filterElem.children;
    filterElem.addEventListener("click", function({target, currentTarget}){
        if(target === currentTarget) return;
        let filter = target.textContent.toLowerCase();
        todoListElem.dataset.filter = filter;

        for(let i in filterSpans){
            filterSpans[i].className = null;
        }
        target.className = "applied";
    })
})();

(function clearCompletedBehavior(){
    const clearBtn = document.getElementById("clear-completed-btn");
    clearBtn.addEventListener("click", function(){
        let removeBtns = todoListElem.querySelectorAll('li[data-status="complete"] .remove-todo-btn');
        console.log(removeBtns);
        for(let i = removeBtns.length - 1; i >= 0; i--){
            removeBtns[i].click(); //simulates the click on remove btn for completed list     
        }
    })
})();

function addTodo(task, completed = false){
    let index = todos.length;
    todos.push({task, completed});

    let li = document.createElement("li");
    li.dataset.status = completed ? "complete" : "incomplete";

    let checkbox = document.createElement("span");
    checkbox.className = "checkbox";
    checkbox.onclick = function(){
        if(todos[index].completed){
            todos[index].completed = false;
            li.dataset.status = "incomplete"
        } else {
            todos[index].completed = true;
            li.dataset.status = "complete"
        }
        recalculateItemsLeft();
    }

    let todo = document.createElement("span");
    todo.className = "todo";
    todo.textContent = task;

    let removeBtn = document.createElement("span");
    removeBtn.className = "remove-todo-btn";
    removeBtn.onclick = function(){
        todos.splice(index, 1);
        todoListElem.removeChild(li);
        recalculateItemsLeft();
    }

    li.appendChild(checkbox);
    li.appendChild(todo);
    li.appendChild(removeBtn);
    todoListElem.appendChild(li);

    recalculateItemsLeft();
}

function recalculateItemsLeft(){
    console.log(todos.reduce((acc, currObj) => {return (currObj.completed) ? acc : acc + 1}, 0))
    itemsLeftElem.textContent = todos.reduce((acc, currObj) => {return (currObj.completed) ? acc : acc + 1}, 0);
}