import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
//setupCounter(document.querySelector('#counter'))

const todos = []
const container = document.getElementById("container");
function deleteItem(item) {
  const element = document.getElementById(item);
  const parent = element.parentElement
  console.log(item)
  element.remove()
  updateContainer(parent)
}
const drag = document.getElementById('card');

const statusSelect = document.querySelectorAll('.status-select');


document.getElementById('info-receive').addEventListener('submit', function (event) {
  // 1. Prevent the default browser form submission (prevents page reload)
  event.preventDefault();

  // 3. Collect form data
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  todos.push(data)
  console.log(todos)
  document.getElementById('info-receive').reset()
  const box = document.createElement('div');
  const name = document.createElement('h2')
  const desc = document.createElement('p')
  const date = document.createElement('p')
  const del = document.createElement('button')
  //const lable = document.createElement('label')
  const progress = document.createElement('select')
  const priority = document.createElement('select')
  del.id = `delete card${todos.length}`
  del.className = 'delete'
  del.textContent = "X"
  del.value = `card card${todos.length}`
  del.onclick = () => deleteItem(del.value)
  box.className = 'card'
  box.id = `card card${todos.length}`
  name.textContent = data["name"];
  var container = document.getElementById('Pending')
  container.appendChild(box)
  box.appendChild(name)
  box.appendChild(del)
  if (data["description"]) {
    desc.textContent = data["description"]
    box.appendChild(desc)

  }
  progress.id = `status-select card` + todos.length
  progress.className = `status-select`
  //lable.id = 'status-select'
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
  box.appendChild(progress)
  progress.appendChild(v1)
  progress.appendChild(v2)
  progress.appendChild(v3)
  progress.appendChild(v4)
  priority.id = 'priority card' + todos.length
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
  box.appendChild(priority)
  priority.appendChild(high)
  priority.appendChild(middle)
  priority.appendChild(low)
  if (data["dueDate"]) {
    date.textContent = data["dueDate"]
    date.id = 'date card${todos.length}'
    date.className = 'date'
    box.appendChild(date)

  }
  progress.addEventListener('change', (event) => changeContainer(box, event))
  priority.addEventListener('change', (event) => changeOrder(box, event))
  const ball = document.getElementById(`Pending-Ball`)
  const children = container.querySelectorAll('.card')
  ball.style.width = `${children.length * 10 + 10}px`
  ball.style.height = `${children.length * 10 + 10}px`
});

function changeOrder(box, event) {
  box.style.order = event.target.value
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
}
function changeContainer(box, event) {
  const selectedValue = event.target.value
  const newBox = document.getElementById(selectedValue)
  const oldBox = box.parentElement
  newBox.appendChild(box)
  const children = newBox.querySelectorAll('.card')
  const newball = document.getElementById(`${selectedValue}-Ball`)
  newball.style.width = `${children.length * 10 + 10}px`
  newball.style.height = `${children.length * 10 + 10}px`


  const oldball = document.getElementById(oldBox.id + '-Ball')
  let oldChildren = oldBox.querySelectorAll('.card')
  if (oldChildren) {
    console.log(oldChildren)
    oldball.style.width = `${oldChildren.length * 10 + 10}px`
    oldball.style.height = `${oldChildren.length * 10 + 10}px`
  }
  else {
    oldball.style.width = '10px'
    oldball.style.height = '10px'
  }
}
const world = document.getElementById('world');
const gravity = 0.1;
const bounce = 0.0001; // Increased this; 0.01 was making it stop instantly
const friction = 1.01; // Should be < 1 to slow down (e.g., 0.98)
window.addEventListener('resize', () => {
  // Update world dimensions if you are storing them in variables
  const newWidth = world.clientWidth;
  const newHeight = world.clientHeight;

  ballInstances.forEach(ball => {
    // If the ball is now past the right wall, snap it to the edge
    if (ball.posX + 60 > newWidth) {
      ball.posX = newWidth - 60;
    }
    // If the ball is now below the floor, snap it to the bottom
    if (ball.posY + 60 > newHeight) {
      ball.posY = newHeight - 60;
    }
  });
});
class PhysicsBall {
  constructor(element) {
    this.element = element;
    this.posX = Math.random() * (world.clientWidth - 60);
    this.posY = Math.random() * (world.clientHeight - 60);
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.initEvents();
  }

  initEvents() {
    this.element.onmousedown = (e) => {
      this.isDragging = true;
      this.vx = 0;
      this.vy = 0;

      // 1. Get the current position of the world container relative to the viewport
      const rect = world.getBoundingClientRect();

      // 2. Calculate the offset: where inside the ball did you click? (0-60)
      const shiftX = e.clientX - this.element.getBoundingClientRect().left;
      const shiftY = e.clientY - this.element.getBoundingClientRect().top;

      const onMouseMove = (e) => {
        // 3. Update velocity based on movement
        this.vx = e.clientX - this.lastMouseX;
        this.vy = e.clientY - this.lastMouseY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;

        // 4. Position the ball relative to the WORLD container, not the screen
        // Subtracting 'rect.left' ensures resize doesn't shift the ball
        this.posX = e.clientX - rect.left - shiftX;
        this.posY = e.clientY - rect.top;

        this.render();
      };

      const onMouseUp = () => {
        this.isDragging = false;
        this.element.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    this.element.ondragstart = () => false;
  }

  update() {
    if (!this.isDragging) {
      // Apply Physics
      this.vy += gravity;
      this.posX += this.vx;
      this.posY += this.vy;

      // Floor Collision
      if (this.posY + 60 >= world.clientHeight) {
        this.posY = world.clientHeight - 60
        this.vy *= -bounce;
        this.vx *= friction;
      }

      // Ceiling Collision
      if (this.posY <= 0) {
        this.posY = 0;
        this.vy *= -bounce;
      }

      // Wall Collisions
      if (this.posX <= 0) {
        this.posX = 0;
        this.vx *= -bounce;
      } else if (this.posX + 60 >= world.clientWidth) {
        this.posX = world.clientWidth - 60;
        this.vx *= -bounce;
      }

      this.render();
    }
  }

  render() {
    this.element.style.left = this.posX + 'px';
    this.element.style.bottom = world.clientHeight - this.posY + 'px';
  }
}

// Initialize all balls
const ballElements = document.querySelectorAll('.ball');
const ballInstances = Array.from(ballElements).map(el => new PhysicsBall(el));

// Main Animation Loop
function animate() {
  ballInstances.forEach(ball => ball.update());
  requestAnimationFrame(animate);
}

animate();