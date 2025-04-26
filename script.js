const API_URL = 'https://dchat-backend.up.railway.app'; // Twój backend Railway

async function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    alert(data.message);
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('chat-section').style.display = 'block';
        localStorage.setItem('token', data.token);

        if (data.adminCode === '74322008') {
            document.getElementById('admin-panel').style.display = 'block';
        }

        loadMessages();
    } else {
        alert(data.message);
    }
}

async function sendMessage() {
    const message = document.getElementById('message-input').value;
    const token = localStorage.getItem('token');

    await fetch(`${API_URL}/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
    });

    document.getElementById('message-input').value = '';
    loadMessages();
}

async function loadMessages() {
    const response = await fetch(`${API_URL}/messages`);
    const data = await response.json();

    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';

    data.forEach(msg => {
        const div = document.createElement('div');
        div.textContent = `${msg.user}: ${msg.message}`;
        messagesDiv.appendChild(div);
    });
}

function logout() {
    localStorage.removeItem('token');
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('chat-section').style.display = 'none';
}

function addFollowers() {
    const token = localStorage.getItem('token');
    const userId = prompt("Podaj ID użytkownika do zwiększenia obserwujących:");

    fetch(`${API_URL}/admin/add-followers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
    }).then(res => res.json())
      .then(data => alert(data.message));
}
