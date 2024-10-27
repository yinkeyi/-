const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;
let d = null; // 初始化方向为null
let moveFlag = false; // 新增标志
let game; // 定义游戏定时器
let isMobile = false; // 标记是否为手机模式

function startGame() {
    document.getElementById('startOverlay').style.display = 'none';
    game = setInterval(draw, 200);
}

document.addEventListener('keydown', direction);

function direction(event) {
    if (isMobile) return; // 如果是手机模式，直接返回，不处理键盘事件

    if (!moveFlag) {
        if ((event.keyCode == 37 || event.keyCode == 65) && d != 'RIGHT') {
            d = 'LEFT';
        } else if ((event.keyCode == 38 || event.keyCode == 87) && d != 'DOWN') {
            d = 'UP';
        } else if ((event.keyCode == 39 || event.keyCode == 68) && d != 'LEFT') {
            d = 'RIGHT';
        } else if ((event.keyCode == 40 || event.keyCode == 83) && d != 'UP') {
            d = 'DOWN';
        }
        moveFlag = true; // 设置标志，表示已经处理过按键
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    if (d) { // 只有在方向被设置后才更新蛇的位置
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (d == 'LEFT') snakeX -= box;
        if (d == 'UP') snakeY -= box;
        if (d == 'RIGHT') snakeX += box;
        if (d == 'DOWN') snakeY += box;

        // 让蛇从一边穿过到另一边
        if (snakeX < 0) snakeX = canvas.width - box;
        if (snakeY < 0) snakeY = canvas.height - box;
        if (snakeX >= canvas.width) snakeX = 0;
        if (snakeY >= canvas.height) snakeY = 0;

        if (snakeX == food.x && snakeY == food.y) {
            score++;
            food = {
                x: Math.floor(Math.random() * 19 + 1) * box,
                y: Math.floor(Math.random() * 19 + 1) * box
            };
        } else {
            snake.pop();
        }

        let newHead = {
            x: snakeX,
            y: snakeY
        };

        if (collision(newHead, snake)) {
            endGame('游戏结束');
        }

        snake.unshift(newHead);
    }

    ctx.fillStyle = 'black';
    ctx.font = '45px Changa one';
    ctx.fillText(score, 2 * box, 1.6 * box);

    moveFlag = false; // 重置标志，允许下次按键
}

function endGame(message) {
    clearInterval(game); // 停止游戏
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '45px Changa one';
    ctx.fillText(message, canvas.width / 3, canvas.height / 2);

    // 创建按钮
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';

    const restartButton = document.createElement('button');
    restartButton.innerText = '再来一次';
    restartButton.style.margin = '10px';
    restartButton.onclick = () => {
        document.location.reload();
    };

    const exitButton = document.createElement('button');
    exitButton.innerText = '退出';
    exitButton.style.margin = '10px';
    exitButton.onclick = () => {
        window.close();
    };

    overlay.appendChild(restartButton);
    overlay.appendChild(exitButton);
    document.body.appendChild(overlay);
}

// 创建开始游戏的选项
window.onload = function() {
    const startOverlay = document.createElement('div');
    startOverlay.id = 'startOverlay';
    startOverlay.style.position = 'absolute';
    startOverlay.style.top = '0';
    startOverlay.style.left = '0';
    startOverlay.style.width = '100%';
    startOverlay.style.height = '100%';
    startOverlay.style.display = 'flex';
    startOverlay.style.flexDirection = 'column';
    startOverlay.style.alignItems = 'center';
    startOverlay.style.justifyContent = 'center';
    startOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';

    const pcButton = document.createElement('button');
    pcButton.innerText = '电脑玩';
    pcButton.style.margin = '10px';
    pcButton.onclick = startGame;

    const mobileButton = document.createElement('button');
    mobileButton.innerText = '手机玩';
    mobileButton.style.margin = '10px';
    mobileButton.onclick = () => {
        isMobile = true;
        createJoystick();
        startGame();
    };

    startOverlay.appendChild(pcButton);
    startOverlay.appendChild(mobileButton);
    document.body.appendChild(startOverlay);
};

function createJoystick() {
    const joystick = document.createElement('div');
    joystick.style.position = 'absolute';
    joystick.style.bottom = '20px';
    joystick.style.left = '20px';
    joystick.style.width = '100px';
    joystick.style.height = '100px';
    joystick.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    joystick.style.borderRadius = '50%';
    joystick.style.display = 'flex';
    joystick.style.alignItems = 'center';
    joystick.style.justifyContent = 'center';
    joystick.style.touchAction = 'none';

    const handle = document.createElement('div');
    handle.style.width = '50px';
    handle.style.height = '50px';
    handle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    handle.style.borderRadius = '50%';
    handle.style.position = 'relative';

    joystick.appendChild(handle);
    document.body.appendChild(joystick);

    let startX, startY;

    joystick.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    });

    joystick.addEventListener('touchmove', (e) => {
        e.preventDefault(); // 防止滚动
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        // 限制handle的移动范围
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 40) {
            const angle = Math.atan2(dy, dx);
            handle.style.transform = `translate(${Math.cos(angle) * 40}px, ${Math.sin(angle) * 40}px)`;
        } else {
            handle.style.transform = `translate(${dx}px, ${dy}px)`;
        }

        // 检测摇动方向并更新蛇的方向
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && d != 'LEFT') {
                d = 'RIGHT';
            } else if (dx < 0 && d != 'RIGHT') {
                d = 'LEFT';
            }
        } else {
            if (dy > 0 && d != 'UP') {
                d = 'DOWN';
            } else if (dy < 0 && d != 'DOWN') {
                d = 'UP';
            }
        }

        moveFlag = true;
    });

    joystick.addEventListener('touchend', () => {
        handle.style.transform = 'translate(0, 0)';
    });
}
