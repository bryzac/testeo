import { createNotification } from "../components/notification.js";

const form = document.querySelector('#form');
const formList = document.querySelector('#form_list');
const ul = document.querySelector('ul');
const createBtn = document.querySelector('#create_btn');
const input = document.querySelector('#task_input');
const total = document.querySelector('#total');
const completed = document.querySelector('#total_complete');
const incompleted = document.querySelector('#total_incomplete');

(async () => {
    try {
        const { data } = await axios.get('/api/todolists', {
            withCredentials: true
        });

        data.forEach(todo => {
            const newTask = document.createElement('li');
            newTask.id = todo.id;
            newTask.classList.add('flex', 'flex-row', 'bg-slate-600', 'px-1', 'py-1', 'rounded-md', 'border-zinc-400', 'border-2', 'gap-2', 'justify-around');
            newTask.innerHTML = `
                <p class="flex items-center w-9/12 bg-slate-500 px-3 rounded-md text-lg font-medium md:w-10/12">${todo.text}</p>
                <button class="bg-green-600 rounded-lg disabled:opacity-50 hover:bg-green-500 hover:scale-110 transition ease-in-out">
                    <img src="/images/solved.svg" class="w-6 h-6 m-1" alt="tarea completada">
                </button>
                <button class="bg-red-600 rounded-lg disabled:opacity-50 hover:bg-red-500 hover:scale-110 transition ease-in-out">
                    <img src="/images/trash.svg" class="w-6 h-6 m-1" alt="eliminar tarea">
                </button>
                <button class="bg-yellow-600 rounded-lg disabled:opacity-50 hover:bg-yellow-500 hover:scale-110 transition ease-in-out">
                    <img src="/images/edit.svg" class="w-6 h-6 m-1" alt="editar tarea">
                </button>
            `;
            if (todo.checked) {
                newTask.children[0].classList.add('line-through');
                newTask.classList.add('opacity-50');
                newTask.children[3].classList.add('invisible');
                newTask.classList.add('done');
            } else {
                newTask.children[0].classList.remove('line-through');
                newTask.classList.remove('opacity-50');
                newTask.children[3].classList.remove('invisible');
                newTask.classList.remove('done');
            }
            ul.append(newTask)
        })
    } catch (error) {
        window.location.pathname = '/login'
    }
})();



let textNotification = '';
let isNotificationTrue = '';
const message =(bool, text) => {
    console.log(bool);
    createNotification(bool, text);
        setTimeout(() => {
            notification.innerHTML = '';
        }, 2000);
};

// Contador
const totalCount = () => {
	const howMany = document.querySelector('ul').children.length; 
	total.innerHTML = howMany;
};
const completeCount = () => {
	const howMany = document.querySelectorAll('.done').length;
	completed.innerHTML = howMany;
};
const incompletedCount = () => {
	const howMany = document.querySelectorAll('ul li:not(.done)').length; 
	incompleted.innerHTML = howMany;
};

const todoCount = () => {
	totalCount();
	completeCount();
	incompletedCount();
};


// Regex validation
const TASK_REGEX = /^[a-zA-Z0-9 ñÑ,.?/()=+-_]{1,50}$/;

// Validation
let taskValidation = false;
const validation = (input, e) => {
    createBtn.disabled = taskValidation ? false : true;
};

input.addEventListener('input', e => {
    taskValidation = TASK_REGEX.test(e.target.value);
    validation(taskValidation, e);
});


// Add
form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!taskValidation) {
        validation(taskValidation, input);
        return
    };

    const { data } = await axios.post('/api/todolists', { text: input.value });


    const newTask = document.createElement('li');
    newTask.classList.add('flex', 'flex-row', 'bg-slate-600', 'px-1', 'py-1', 'rounded-md', 'border-zinc-400', 'border-2', 'gap-2', 'justify-around');
    newTask.innerHTML = `
        <p class="flex items-center w-9/12 bg-slate-500 px-3 rounded-md text-lg font-medium md:w-10/12">${input.value}</p>
        <button class="bg-green-600 rounded-lg disabled:opacity-50 hover:bg-green-500 hover:scale-110 transition ease-in-out">
            <img src="/images/solved.svg" class="w-6 h-6 m-1" alt="tarea completada">
        </button>
        <button class="bg-red-600 rounded-lg disabled:opacity-50 hover:bg-red-500 hover:scale-110 transition ease-in-out">
            <img src="/images/trash.svg" class="w-6 h-6 m-1" alt="eliminar tarea">
        </button>
        <button class="bg-yellow-600 rounded-lg disabled:opacity-50 hover:bg-yellow-500 hover:scale-110 transition ease-in-out">
            <img src="/images/edit.svg" class="w-6 h-6 m-1" alt="editar tarea">
        </button>
    `;
    ul.append(newTask);
    todoCount();

    textNotification = 'Tarea creada';
    isNotificationTrue = false;
    message(isNotificationTrue, textNotification);

    input.value = '';
    createBtn.disabled = true;
    taskValidation = false;
});


// 
formList.addEventListener('submit', e =>{
    e.preventDefault();

    // window.addEventListener("keypress", event => {
    //     if (event.key === 'Enter'){
    //         event.preventDefault();
    //     }
    // }, false);

    // Check
    if (e.submitter.children[0].alt === 'tarea completada') {
        const checkIcon = e.submitter.children[0];
        const listItem = checkIcon.parentElement;
        if (!e.submitter.parentElement.children[0].classList.contains('line-through')) {
            e.submitter.parentElement.children[0].classList.add('line-through');
            e.submitter.parentElement.classList.add('opacity-50');
            e.submitter.parentElement.children[3].classList.add('invisible');
            e.submitter.parentElement.classList.add('done');
        } else {
            e.submitter.parentElement.children[0].classList.remove('line-through');
            e.submitter.parentElement.classList.remove('opacity-50');
            e.submitter.parentElement.children[3].classList.remove('invisible');
            e.submitter.parentElement.classList.remove('done');
        }
        
    }
    
    // Delete
    if (e.submitter.children[0].alt === 'eliminar tarea') {
        e.submitter.parentElement.remove();
        todoCount();

        textNotification = 'Tarea eliminada';
        isNotificationTrue = true;
        message(isNotificationTrue, textNotification);
    }
    
    // Edit
    if (e.submitter.children[0].alt === 'editar tarea') {
        const text = e.submitter.parentElement.children[0].textContent;
        const editable = e.submitter.parentElement;
        editable.innerHTML = `
            <input type="text" placeholder="${text}" value="${text}" class="text-black w-9/12 md:w-10/12 px-3 rounded-lg bg-slate-100 outline-yellow-600 border-yellow-600 border-2 font-semibold">
            <button class="bg-green-600 rounded-lg disabled:opacity-50 hover:bg-green-500 hover:scale-110 transition ease-in-out">
                <img src="/images/save.svg" class="w-6 h-6 m-1" alt="guardar">
            </button>
            <button class="bg-red-600 rounded-lg disabled:opacity-50 hover:bg-red-500 hover:scale-110 transition ease-in-out">
                <img src="/images/cancel.svg" class="w-6 h-6 m-1" alt="cancelar">
            </button>
        `;
    } 
    
    // Save
    if (e.submitter.children[0].alt === 'guardar') {
        const text = e.submitter.parentElement.children[0].value;
        const editable = e.submitter.parentElement;

        if (e.submitter.parentElement.children[0].value === '') {
            textNotification = 'La tarea no puede estar vacía';
            isNotificationTrue = true;
            message(isNotificationTrue, textNotification);
            return
        };
        editable.innerHTML = `
            <p class="flex items-center w-9/12 bg-slate-500 px-3 rounded-md text-lg font-medium md:w-10/12">${text}</p>
            <button class="bg-green-600 rounded-lg disabled:opacity-50 hover:bg-green-500 hover:scale-110 transition ease-in-out">
                <img src="/images/solved.svg" class="w-6 h-6 m-1" alt="tarea completada">
            </button>
            <button class="bg-red-600 rounded-lg disabled:opacity-50 hover:bg-red-500 hover:scale-110 transition ease-in-out">
                <img src="/images/trash.svg" class="w-6 h-6 m-1" alt="eliminar tarea">
            </button>
            <button class="bg-yellow-600 rounded-lg disabled:opacity-50 hover:bg-yellow-500 hover:scale-110 transition ease-in-out">
                <img src="/images/edit.svg" class="w-6 h-6 m-1" alt="editar tarea">
            </button>
        `;

        textNotification = 'Tarea actualizada';
        isNotificationTrue = false;
        message(isNotificationTrue, textNotification);
    }
    
    // Cancel
    if (e.submitter.children[0].alt === 'cancelar') {
        const text = e.submitter.parentElement.children[0].placeholder;
        const editable = e.submitter.parentElement;
        editable.innerHTML = `
            <p class="flex items-center w-9/12 bg-slate-500 px-3 rounded-md text-lg font-medium md:w-10/12">${text}</p>
            <button class="bg-green-600 rounded-lg disabled:opacity-50 hover:bg-green-500 hover:scale-110 transition ease-in-out">
                <img src="/images/solved.svg" class="w-6 h-6 m-1" alt="tarea completada">
            </button>
            <button class="bg-red-600 rounded-lg disabled:opacity-50 hover:bg-red-500 hover:scale-110 transition ease-in-out">
                <img src="/images/trash.svg" class="w-6 h-6 m-1" alt="eliminar tarea">
            </button>
            <button class="bg-yellow-600 rounded-lg disabled:opacity-50 hover:bg-yellow-500 hover:scale-110 transition ease-in-out">
                <img src="/images/edit.svg" class="w-6 h-6 m-1" alt="editar tarea">
            </button>
        `;
    }
    todoCount();
});