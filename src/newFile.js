import { todos, deleteItem, container } from './main';

document.getElementById('info-receive').addEventListener('submit', function (event) {
    // 1. Prevent the default browser form submission (prevents page reload)
    event.preventDefault();

    // 3. Collect form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    todos.push(data);
    console.log(todos);
    document.getElementById('info-receive').reset();
    const box = document.createElement('div');
    const name = document.createElement('h2');
    const desc = document.createElement('p');
    const date = document.createElement('p');
    const del = document.createElement('button');
    const lable = document.createElement('label');
    const progress = document.createElement('select');
    del.id = 'delete';
    del.textContent = "X";
    del.onclick = () => deleteItem(`card card${todos.length}`);
    box.className = 'card';
    box.id = `card card${todos.length}`;
    name.textContent = data["name"];
    container.appendChild(box);
    box.appendChild(name);
    box.appendChild(del);
    if (data["description"]) {
        desc.textContent = data["description"];
        box.appendChild(desc);

    }
    if (data['progression']) {
        progress.id = 'status-select';
        lable.id = 'status-select';
        const v1 = document.createElement('option');
        const v2 = document.createElement('option');
        const v3 = document.createElement('option');
        const v4 = document.createElement('option');
        v1.value = 'Pending';
        v2.value = 'Ongoing';
        v3.value = 'Completed';
        v4.value = 'Cancelled';
        v1.textContent = 'Pending';
        v2.textContent = 'Ongoing';
        v3.textContent = 'Completed';
        v4.textContent = 'Cancelled';
        box.appendChild(lable);
        box.appendChild(progress);
        progress.appendChild(v1);
        progress.appendChild(v2);
        progress.appendChild(v3);
        progress.appendChild(v4);
    }
    if (data["dueDate"]) {
        date.textContent = data["dueDate"];
        date.id = 'date';
        box.appendChild(date);

    }
});
