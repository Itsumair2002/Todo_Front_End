let todos = [];
let editIndex = -1;
// Main function to initialize and render the signup page
function main() {
    console.log('The script is running...')
    let token = localStorage.getItem('token');
    if (token) {
        renderLandingPage(); // Fetch and display user information if token exists
    } else {
        renderSignupPage(); // Show signup page first
    }
}
// Function to render the signup form
function renderSignupPage() {
    // Clear existing content
    document.body.innerHTML = '';

    // Create a container for the signup form
    const signupContainer = document.createElement('div');
    signupContainer.className = 'container'; // Apply the same styles as the landing page

    // Create a title for the signup form
    const title = document.createElement('h2');
    title.innerText = 'Signup';

    // Create input field for username
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'signupUsername';
    usernameInput.name = 'username';
    usernameInput.placeholder = 'Enter your email here';

    // Create input field for password
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'signupPassword';
    passwordInput.name = 'password';
    passwordInput.placeholder = 'Enter your password here';

    // Create a submit button
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = signup; // Assign the signup function

    // Create link to sign in page
    const signinLink = document.createElement('p');
    signinLink.innerHTML = 'Already signed up? <span style="cursor:pointer; color: #f1f1f1; text-decoration: underline;">Sign in now</span>';
    signinLink.onclick = renderSigninPage; // Redirect to signin page when clicked

    // Append all elements to the signup container
    signupContainer.appendChild(title);
    signupContainer.appendChild(usernameInput);
    signupContainer.appendChild(passwordInput);
    signupContainer.appendChild(submitButton);
    signupContainer.appendChild(signinLink);

    // Append the signup container to the body
    document.body.appendChild(signupContainer);
}
// Function to render the signin form
function renderSigninPage() {
    // Clear existing content
    document.body.innerHTML = '';

    // Create a container for the signin form
    const signinContainer = document.createElement('div');
    signinContainer.className = 'container'; // Apply the same styles as the signup and landing page

    // Create a title for the signin form
    const title = document.createElement('h2');
    title.innerText = 'Login';

    // Create input field for username
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'signinUsername';
    usernameInput.name = 'username';
    usernameInput.placeholder = 'Enter your email here';

    // Create input field for password
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'signinPassword';
    passwordInput.name = 'password';
    passwordInput.placeholder = 'Enter your password here';

    // Create a submit button
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Login';
    submitButton.onclick = signin; // Assign the signin function

    // Create link to signup page
    const signupLink = document.createElement('p');
    signupLink.innerHTML = 'Not signed up yet? <span style="cursor:pointer; color: #f1f1f1; text-decoration: underline;">Sign up now</span>';
    signupLink.onclick = renderSignupPage; // Redirect to signup page when clicked

    // Append all elements to the signin container
    signinContainer.appendChild(title);
    signinContainer.appendChild(usernameInput);
    signinContainer.appendChild(passwordInput);
    signinContainer.appendChild(submitButton);
    signinContainer.appendChild(signupLink);

    // Append the signin container to the body
    document.body.appendChild(signinContainer);
}
// Function to render the initial landing page with todos and a logout button
function renderLandingPage() {
    // Clear existing content
    document.body.innerHTML = '';

    // Create logout button
    const logoutButton = document.createElement('button');
    logoutButton.innerText = 'Logout';
    logoutButton.className = 'logout-button'; // Apply the CSS class
    logoutButton.onclick = logout;


    // Append logout button to the body
    document.body.appendChild(logoutButton);

    // Create main container
    const container = document.createElement('div');
    container.className = 'container';

    // Create input field for adding new todos
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'todo-input';
    input.placeholder = 'Enter a new task...';

    // Create add button
    const addButton = document.createElement('button');
    addButton.innerText = 'Add Todo';
    addButton.onclick = addTodo;

    // Create container for the list of todos
    const todolist = document.createElement('div');
    todolist.className = 'todolist';

    // Append elements to the container
    container.appendChild(input);
    container.appendChild(addButton);
    container.appendChild(todolist);

    // Append the container to the body
    document.body.appendChild(container);

    // Fetch todos after rendering the UI
    fetchTodos();
}
// Function to fetch todos from the server
async function fetchTodos() {
    try {
        let token = localStorage.getItem('token')
        let response = await axios.get("http://localhost:3000/getTodos", { headers: { token: token } })
        todos = response.data.todos
        render(); // Render the todos once fetched
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}
// Signup function to handle user signup
function signup() {
    (async function () {
        let signupUser = document.getElementById('signupUsername');
        let signupPassword = document.getElementById('signupPassword');
        let email = signupUser.value;
        let password = signupPassword.value;

        try {
            await axios.post('http://localhost:3000/signup', {
                email: email,
                password: password
            });
            signupUser.value = '';
            signupPassword.value = '';
            alert('Signup successful!');
            renderSigninPage(); // Show the signin page after successful signup
        } catch (error) {
            console.error('Signup failed:', error);
            alert('Signup failed. Please try again.');
            //Clear the input fields
            signupUser.value = '';
            signupPassword.value = '';
        }
    })();
}
// Signin function to handle user signin
function signin() {
    (async function () {
        let email = document.getElementById('signinUsername').value;
        let password = document.getElementById('signinPassword').value;

        try {
            let response = await axios.post('http://localhost:3000/signin', {}, {
                headers: {
                    email: email,
                    password: password
                }
            });
            localStorage.setItem('token', response.data.token); // Store the received token
            renderLandingPage(); // Show the landing page after successful signin
        } catch (error) {
            console.error('Signin failed:', error);
            alert('Signin failed. Please check your credentials and try again.');
            // Clear the input fields
            document.getElementById('signinUsername').value = '';
            document.getElementById('signinPassword').value = '';
        }
    })();
}
// Logout function to clear the token and reload the page
function logout() {
    localStorage.removeItem('token');
    location.reload();
}
// Function to add a new todo
async function addTodo() {
    const todoInput = document.querySelector("#todo-input").value.trim();

    if (todoInput === '') {
        alert('The input box cannot be empty');
    } else {
        let token = localStorage.getItem('token')
        try {
            await axios.post("http://localhost:3000/addTodo", { title: todoInput }, { headers: { token: token } })
            fetchTodos()
        } catch (error) {
            alert('Request failed! Please try again')
        }
    }
}
async function deleteTodo(index) {
    try {
        let token = localStorage.getItem('token')
        await axios.delete("http://localhost:3000/deleteTodo", { headers: { token: token, id: todos[index]._id } })
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
            await axios.put("http://localhost:3000/editTodo", { id: todos[index]._id, title: title}, { headers: { token: token } })
            editIndex = -1
            fetchTodos()
        } catch (error) {
            alert('Failed request! Please try again')
        }
    }
}

// Function to render the list of todos
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

// Initialize the application
main();