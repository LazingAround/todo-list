import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
//setupCounter(document.querySelector('#counter'))
// main.js
import { PhysicsBall } from './physics.js';

const world = document.getElementById('world');
const ballElements = document.querySelectorAll('.ball');

// Initialize instances
const ballInstances = Array.from(ballElements).map(el => new PhysicsBall(el, world));

// Handle Window Resize
window.addEventListener('resize', () => {
  const newWidth = world.clientWidth;
  const newHeight = world.clientHeight;

  ballInstances.forEach(ball => {
    if (ball.posX + 60 > newWidth) ball.posX = newWidth - 60;
    if (ball.posY + 60 > newHeight) ball.posY = newHeight - 60;
  });
});

// Loop
function animate() {
  ballInstances.forEach(ball => ball.update());
  requestAnimationFrame(animate);
}

animate();



const todos = []
const container = document.getElementById("container");

function deleteItem(item) {
  const element = document.getElementById(item);
  const parent = element.parentElement
  console.log(item)
  const find = todos.findIndex((card) => card.id = element.id)
  todos.splice(find, 1)
  console.log(todos)
  element.remove()
  updateContainer(parent)
  savedUpdate()
}

function createCard(data) {
  const box = document.createElement('div');
  const name = document.createElement('h2')
  const desc = document.createElement('p')
  const date = document.createElement('p')
  const del = document.createElement('button')
  const progression = document.createElement('select')
  const priority = document.createElement('select')
  const uuid = crypto.randomUUID();
  const v1 = document.createElement('option')
  const v2 = document.createElement('option')
  const v3 = document.createElement('option')
  const v4 = document.createElement('option')
  v1.value = 'Pending'
  v2.value = 'Ongoing'
  v3.value = 'Completed'
  v4.value = 'Cancelled'
  v1.textContent = '🟡 Pending'
  v2.textContent = '🔵 Ongoing'
  v3.textContent = '🟢 Completed'
  v4.textContent = '🔴 Cancelled'
  //box.appendChild(lable)
  progression.appendChild(v1)
  progression.appendChild(v2)
  progression.appendChild(v3)
  progression.appendChild(v4)

  const high = document.createElement('option')
  const middle = document.createElement('option')
  const low = document.createElement('option')
  box.appendChild(document.createElement('br'))

  high.value = '1'
  middle.value = '2'
  low.value = '3'
  high.textContent = 'High ^'
  middle.textContent = 'Middle ='
  low.textContent = 'Low ⌄'
  priority.appendChild(high)
  priority.appendChild(middle)
  priority.appendChild(low)
  box.id = (Object.hasOwn(data, 'id')) ? data.id : uuid
  priority.id = 'priority ' + box.id
  progression.value = Object.hasOwn(data, 'progress') ? data.progress : "Pending"
  priority.value = (Object.hasOwn(data, 'priority')) ? data.priority : 1

  del.id = "delete " + box.id
  del.className = 'delete'
  del.textContent = 'X'
  del.value = box.id
  del.onclick = () => deleteItem(del.value)

  box.className = 'card'
  name.textContent = data["name"]
  var container = document.getElementById(progression.value)
  container.appendChild(box)
  box.appendChild(name)
  box.appendChild(del)
  if (data["description"]) {
    desc.textContent = data["description"]
    box.appendChild(desc)
  }

  progression.id = 'status-select ' + box.id
  progression.className = 'status-select'
  box.appendChild(progression)
  box.appendChild(priority)
  if (data["dueDate"]) {
    date.textContent = data["dueDate"]
    date.id = 'date card${todos.length}'
    var due = new Date(data['dueDate'])
    var now = new Date()
    if (due > now) {
      date.className = 'date not-expired'
    } else {
      date.className = 'date expired'
    }
    timeUpdate(date, data['dueDate'])
    box.appendChild(date)
  }
  progression.addEventListener('change', (event) => changeContainer(box, event))
  priority.addEventListener('change', (event) => changeOrder(box, event))

  data.id = box.id
  data.progress = progression.value
  data.priority = priority.value

  todos.push(data)
  updateBallSize(progression.value)

  savedUpdate()
}

function updateBallSize(container_id) {
  const ball = document.getElementById(container_id + '-Ball')
  const container = document.getElementById(container_id)
  const children = container.querySelectorAll('.card')
  ball.style.width = `${children.length * 10}px`
  ball.style.height = ball.style.width
}

document.getElementById('info-receive').addEventListener('submit', function (event) {
  // 1. Prevent the default browser form submission (prevents page reload)
  event.preventDefault();

  // 3. Collect form data
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  document.getElementById('info-receive').reset()
  createCard(data)

});
function timeUpdate(date, info) {
  var repeat = 3000
  var due = new Date(info)
  var now = new Date()
  var difference = due - now
  if (due > now) {
    date.className = 'date not-expired'
  } else {
    date.className = 'date expired'
  }
  if (difference < 60000) {
    date.textContent = `Due in ${Math.round(difference / 1000)}s`
    repeat = 1000
  }
  else if (difference < 3600000) {
    date.textContent = `Due in ${Math.round(difference / 60000)}m`
    repeat = 3000

  }
  else if (difference < 3600000 * 24) {
    date.textContent = `Due in ${Math.round(difference / 3600000)}hr`
    repeat = 3000
  }
  else if (difference < 3600000 * 24 * 7) {
    date.textContent = `Due in ${Math.round(difference / 3600000 / 24)} day`
    repeat = 3000
  } else {
    var txt = due.toLocaleDateString('en-AU')
    date.textContent = `Due on ${txt}`

  }
  setTimeout(timeUpdate, repeat, date, info)

}
function changeOrder(box, event) {
  const find = todos.findIndex(card => card.id === box.id)
  console.log(box.id)
  todos[find].priority = event.target.value
  box.style.order = event.target.value
  savedUpdate()
}
function updateContainer(box) {
  console.log(box)
  const children = box.querySelectorAll('.card')
  const ball = document.getElementById(box.id + '-Ball')
  if (ball) {
    ball.style.width = `${children.length * 10 + 10}px`
    ball.style.height = `${children.length * 10 + 10}px`
  }
  else {
    ball.style.width = `10px`
    ball.style.height = `10px`
  }
  savedUpdate()
}
function changeContainer(box, event) {
  console.log('cajnge')
  const find = todos.findIndex(card => card.id === box.id)
  todos[find].progress = event.target.value
  const selectedValue = event.target.value
  console.log(todos)
  const newBox = document.getElementById(selectedValue)
  const oldBox = box.parentElement
  newBox.appendChild(box)
  console.log(newBox.id)
  updateBallSize(newBox.id)
  updateBallSize(oldBox.id)

  savedUpdate()
}
function savedUpdate() {
  localStorage.setItem('data', JSON.stringify(todos));
  console.log(todos)
}

const storedTodos = JSON.parse(localStorage.getItem('data'));
console.log(storedTodos);

storedTodos.forEach((data) => {
  createCard(data)
});

const containers = document.querySelectorAll(".sub")
containers.forEach((cont) => {
  updateBallSize(cont.id)
})