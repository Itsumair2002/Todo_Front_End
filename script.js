let todos = [];
let editIndex = -1;

function main() {
    console.log('The script is running...')
    let token = localStorage.getItem('token');
    if (token) {
        renderLandingPage();
    } else {
        renderSignupPage();
    }
}

function renderSignupPage() {
    document.body.innerHTML = '';
    const signupContainer = document.createElement('div');
    signupContainer.className = 'container';
    const title = document.createElement('h2');
    title.innerText = 'Signup';
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'signupUsername';
    usernameInput.name = 'username';
    usernameInput.placeholder = 'Enter your email here';
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'signupPassword';
    passwordInput.name = 'password';
    passwordInput.placeholder = 'Enter your password here';
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = signup;
    const signinLink = document.createElement('p');
    signinLink.innerHTML = 'Already signed up? <span style="cursor:pointer; color: #f1f1f1; text-decoration: underline;">Sign in now</span>';
    signinLink.onclick = renderSigninPage;
    signupContainer.appendChild(title);
    signupContainer.appendChild(usernameInput);
    signupContainer.appendChild(passwordInput);
    signupContainer.appendChild(submitButton);
    signupContainer.appendChild(signinLink);
    document.body.appendChild(signupContainer);
}

function renderSigninPage() {
    document.body.innerHTML = '';
    const signinContainer = document.createElement('div');
    signinContainer.className = 'container';
    const title = document.createElement('h2');
    title.innerText = 'Login';
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'signinUsername';
    usernameInput.name = 'username';
    usernameInput.placeholder = 'Enter your email here';
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'signinPassword';
    passwordInput.name = 'password';
    passwordInput.placeholder = 'Enter your password here';
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Login';
    submitButton.onclick = signin;
    const signupLink = document.createElement('p');
    signupLink.innerHTML = 'Not signed up yet? <span style="cursor:pointer; color: #f1f1f1; text-decoration: underline;">Sign up now</span>';
    signupLink.onclick = renderSignupPage;
    signinContainer.appendChild(title);
    signinContainer.appendChild(usernameInput);
    signinContainer.appendChild(passwordInput);
    signinContainer.appendChild(submitButton);
    signinContainer.appendChild(signupLink);
    document.body.appendChild(signinContainer);
}

function renderLandingPage() {
    document.body.innerHTML = '';
    const logoutButton = document.createElement('button');
    logoutButton.innerText = 'Logout';
    logoutButton.className = 'logout-button';
    logoutButton.onclick = logout;
    document.body.appendChild(logoutButton);
    const container = document.createElement('div');
    container.className = 'container';
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'todo-input';
    input.placeholder = 'Enter a new task...';
    const addButton = document.createElement('button');
    addButton.innerText = 'Add Todo';
    addButton.onclick = addTodo;
    const todolist = document.createElement('div');
    todolist.className = 'todolist';
    container.appendChild(input);
    container.appendChild(addButton);
    container.appendChild(todolist);
    document.body.appendChild(container);
    fetchTodos();
}

async function fetchTodos() {
    try {
        let token = localStorage.getItem('token')
        let response = await axios.get("https://todobackend-248o0is6.b4a.run/getTodos", { headers: { token: token } })
        todos = response.data.todos
        render();
        document.getElementById('todo-input').value = ''
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}

function signup() {
    (async function () {
        let signupUser = document.getElementById('signupUsername');
        let signupPassword = document.getElementById('signupPassword');
        let email = signupUser.value;
        let password = signupPassword.value;

        try {
            let response = await axios.post('https://todobackend-248o0is6.b4a.run/signup', {
                email: email,
                password: password
            });
            if (response.status === 200) {
                signupUser.value = '';
                signupPassword.value = '';
                alert('Signup successful!');
                renderSigninPage();
            } else alert('Signup failed!')
        } catch (error) {
            if (error.response.status === 403) {
                alert('User already resgistered!')
            } else {
                console.error('Signup failed:', error);
                alert('Signup failed. Please try again.');
                signupUser.value = '';
                signupPassword.value = '';
            }
        }
    })();
}

function signin() {
    (async function () {
        let email = document.getElementById('signinUsername').value;
        let password = document.getElementById('signinPassword').value;

        try {
            let response = await axios.post('https://todobackend-248o0is6.b4a.run/signin', {}, {
                headers: {
                    email: email,
                    password: password
                }
            });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                renderLandingPage();
                alert('Signed In!')
            } else if (response.status === 403) {
                alert('User not found! Please Signup!')
            } else if (response.status === 400) {
                alert('Password is not valid!')
            } else {
                alert('Error whle signing in!')
            }
        } catch (error) {
            console.error('Signin failed:', error);
            alert('Signin failed. Please check your credentials and try again.');
            document.getElementById('signinUsername').value = '';
            document.getElementById('signinPassword').value = '';
        }
    })();
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}

async function addTodo() {
    const todoInput = document.querySelector("#todo-input").value.trim();
    let result = todos.find(e => e.title === todoInput)
    if (todoInput === '') {
        alert('The input box cannot be empty');
    } else if(result){
        alert('The todo already exists')
        document.getElementById('todo-input').value = ''
    } else {
        console.log('here')
        let token = localStorage.getItem('token')
        try {
            await axios.post("https://todobackend-248o0is6.b4a.run/addTodo", { title: todoInput }, { headers: { token: token } })
            fetchTodos()
        } catch (error) {
            alert('Request failed! Please try again')
        }
    }
}

async function deleteTodo(index) {
    try {
        let token = localStorage.getItem('token')
        await axios.delete("https://todobackend-248o0is6.b4a.run/deleteTodo", { headers: { token: token, id: todos[index]._id } })
        console.log('Error is coming')
        fetchTodos()
        console.log('Error is coming')
    } catch (error) {
        alert('Failed request! Please try again')
    }
}

function editTodo(index) {
    editIndex = index
    render()
}

async function saveTodo(index) {
    let token = localStorage.getItem('token')
    let title = document.getElementById(`edit-input-${index}`).value.trim()
    if (title === '') {
        alert('The input box cannot be empty')
    } else {
        console.log('Inside the save todo function')
        try {
            await axios.put("https://todobackend-248o0is6.b4a.run/editTodo", { id: todos[index]._id, title: title }, { headers: { token: token } })
            editIndex = -1
            fetchTodos()
        } catch (error) {
            alert('Failed request! Please try again')
        }
    }
}

function render() {
    const todolist = document.querySelector('.todolist');
    todolist.innerHTML = "";
    todos.forEach((todo, i) => {
        const div = document.createElement('div');

        if (editIndex === i) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = todo.title;
            input.id = `edit-input-${i}`;

            const saveButton = document.createElement('button');
            saveButton.innerHTML = 'Save';
            saveButton.setAttribute('onclick', `saveTodo(${i})`);

            div.append(input);
            div.append(saveButton);
        } else {
            const h1 = document.createElement('h1');
            h1.innerText = `${i + 1} - ${todo.title}`;

            const editButton = document.createElement('button');
            editButton.innerHTML = 'Edit';
            editButton.setAttribute('onclick', `editTodo(${i})`);

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'Delete';
            deleteButton.setAttribute('onclick', `deleteTodo(${i})`);

            div.append(h1);
            div.append(editButton);
            div.append(deleteButton);
        }

        todolist.append(div);
    });
}

main();
