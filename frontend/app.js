const API_BASE = window.API_BASE || '/api';
const infoEl = document.querySelector('#info');
const todosEl = document.querySelector('#todos');
const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');

async function fetchJson(path, options) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function loadInfo() {
  try {
    const data = await fetchJson('/info');
    infoEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    infoEl.textContent = `Cannot call backend: ${err.message}`;
  }
}

async function loadTodos() {
  try {
    const todos = await fetchJson('/todos');
    todosEl.innerHTML = todos.map(t => `<li>${t.done ? '✅' : '⬜'} ${t.text}</li>`).join('');
  } catch (err) {
    todosEl.innerHTML = `<li>Cannot load todos: ${err.message}</li>`;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  await fetchJson('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  input.value = '';
  await loadTodos();
});

document.querySelector('#refresh').addEventListener('click', loadInfo);
loadInfo();
loadTodos();
