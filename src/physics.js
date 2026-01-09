// PhysicsBall.js

export class PhysicsBall {
    constructor(element, world) {
        this.element = element;
        this.world = world; // Pass world as an argument for better modularity
        this.posX = Math.random() * (this.world.clientWidth - 60);
        this.posY = Math.random() * (this.world.clientHeight - 60);
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;

        // Physics Constants
        this.gravity = 0.1;
        this.bounce = 0.7;    // Adjusted: 0.0001 was effectively stopping the ball
        this.friction = 0.98;  // Adjusted: should be < 1 to slow things down

        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.initEvents();
    }

    initEvents() {
        this.element.onmousedown = (e) => {
            this.isDragging = true;
            const rect = this.world.getBoundingClientRect();
            const shiftX = e.clientX - this.element.getBoundingClientRect().left;
            const shiftY = e.clientY - this.element.getBoundingClientRect().top;

            const onMouseMove = (e) => {
                this.vx = e.clientX - this.lastMouseX;
                this.vy = e.clientY - this.lastMouseY;
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;

                // Corrected Position Logic
                this.posX = e.clientX - rect.left - shiftX;
                this.posY = e.clientY - rect.top - shiftY;

                this.render();
            };

            const onMouseUp = () => {
                this.isDragging = false;
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
            this.vy += this.gravity;
            this.posX += this.vx;
            this.posY += this.vy;

            // Boundary Checks
            if (this.posY + 60 >= this.world.clientHeight) {
                this.posY = this.world.clientHeight - 60;
                this.vy *= -this.bounce;
                this.vx *= this.friction;
            }
            if (this.posY <= 0) {
                this.posY = 0;
                this.vy *= -this.bounce;
            }
            if (this.posX <= 0) {
                this.posX = 0;
                this.vx *= -this.bounce;
            } else if (this.posX + 60 >= this.world.clientWidth) {
                this.posX = this.world.clientWidth - 60;
                this.vx *= -this.bounce;
            }
            this.render();
        }
    }

    render() {
        this.element.style.transform = `translate(${this.posX}px,${this.posY - this.element.clientHeight}px)`;
    }
}