import { Utils } from '/misc/Utils.js';
import { World } from './World/World.js';
World.Keyboard.enable('Space', 'KeyA', 'KeyW', 'KeyS', 'KeyD', 'KeyQ', 'KeyR', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft');
let width = 2050;
let height = 1550;
const suiciders = [];
const gameCanvas = new World.Canvase('game', width, height);
const viewPortCanvas = new World.Canvase('viewport', window.innerWidth, window.innerHeight);
// const miniMapCanvas = new World.Canvase(
//     'minimap',
//     250,
//     250,
// );
const player = new World.Sprites.Player({
    canvas: gameCanvas,
    x: width / 2,
    y: height / 2,
    width: 25,
    height: 25,
    health: 50,
    color: 'yellow',
    speed: { x: 10, y: 10 },
    gun: new World.Sprites.Gun(gameCanvas, 'SMALLRAPIDS')
});
const enemy = new World.Sprites.Enemy('suicider', {
    x: 0,
    y: 0,
    color: "skyblue",
    follow: player,
    velocity: { x: 9.5, y: 8 },
    health: 2500,
    canvas: gameCanvas
});

const enemy2 = new World.Sprites.Enemy('suicider', {
    x: width,
    y: height,
    color: "orange",
    follow: player,
    velocity: { x: 7, y: 11 },
    health: 2500,
    canvas: gameCanvas
});

suiciders.push(enemy);
suiciders.push(enemy2);
gameCanvas.context.font = "20px Arial";

const camera = new World.Camera(0, 0, width, height, window.innerWidth, window.innerHeight);
camera.follow(player, window.innerWidth / 2, window.innerHeight / 2);
function game() {
    gameCanvas.context.setTransform(1, 0, 0, 1, 0, 0);
    gameCanvas.clear();
    viewPortCanvas.clear();

    drawWorld();

    drawAndMove();

    playerFire();

    //miniMapCanvas.clear();
    //miniMapCanvas.context.drawImage(gameCanvas.element, 0, 0, 500, 500, miniMapCanvas.element.style.left, miniMapCanvas.element.style.top, 500, 500);

    window.requestAnimationFrame(game);
}
game();























window.onresize = function() {
    gameCanvas.width = gameCanvas.width;
    gameCanvas.height = gameCanvas.height;

    viewPortCanvas.height = viewPortCanvas.height;
    viewPortCanvas.width = viewPortCanvas.width;

}






function drawWorld() {

    camera.update();
    gameCanvas.context.translate(camera.viewX, camera.viewY);

    viewPortCanvas.context.font = "30px Arial";
    viewPortCanvas.context.fillText(`Player(${player.x}, ${player.y})`, 0, 30);
    viewPortCanvas.context.fillText(`Enemy(${Math.round(enemy.x)}, ${Math.round(enemy.y)})`, 0, 60);


    //grid
    for (let r = 0, rCount = 0; r < gameCanvas.width; r += gameCanvas.width / 10, rCount += 1) {
        for (let c = 0, cCount = 0; c < gameCanvas.height; c += gameCanvas.height / 10, cCount += 1) {
            gameCanvas.context.fillStyle = 'lime';
            gameCanvas.context.fillText(`(${rCount}, ${cCount})`, r, c + 20);
            gameCanvas.context.fillRect(r, 0, 1, gameCanvas.height);
            gameCanvas.context.fillRect(0, c, gameCanvas.width, 1);
        }
    }
    //borders
    gameCanvas.context.fillRect(0, 0, width, 1);
    gameCanvas.context.fillRect(width, 0, 1, height);
    gameCanvas.context.fillRect(0, 0, 1, height);
    gameCanvas.context.fillRect(0, height, width, 1);

}

function playerFire() {
    if (World.keys[World.Keybinds.find('shoot_right')].isPressed) {
        player.fire({
            x: player.x + (player.width * player.activeGun.inherited.width) * Math.cos(player.radian),
            y: player.y + (player.height * player.activeGun.inherited.height) * Math.sin(player.radian),
            direction: 'right'
        });
    } else if (World.keys[World.Keybinds.find('shoot_up')].isPressed) {
        player.fire({
            x: player.x + (player.width * player.activeGun.inherited.height) * Math.cos(player.radian),
            y: player.y + (player.height * player.activeGun.inherited.width) * Math.sin(player.radian),
            direction: 'up'
        });
    } else if (World.keys[World.Keybinds.find('shoot_left')].isPressed) {
        player.fire({
            x: player.x + (player.width * player.activeGun.inherited.width) * Math.cos(player.radian),
            y: player.y + (player.height * player.activeGun.inherited.height) * Math.sin(player.radian),
            direction: 'left'
        });
    } else if (World.keys[World.Keybinds.find('shoot_down')].isPressed) {
        player.fire({
            x: player.x + (player.width * player.activeGun.inherited.width) * Math.cos(player.radian),
            y: player.y + (player.height * player.activeGun.inherited.width) * Math.sin(player.radian),
            direction: 'down'
        });
    }

    if (World.keys[World.Keybinds.find('reload')].isPressed) {
        player.reload();
    }

    player.activeGun.bullets.forEach(bullet => {
        suiciders.forEach(enemy => {
            if (Utils.rectCollides(enemy, bullet)) {
                enemy.hit(player.activeGun.inherited.bullet.damage);
                enemy.explode("scatter", 2000, 10, 3);
                player.activeGun.killBullet(bullet);
                enemy.healthColor = 'red';
                setTimeout(() => {
                    enemy.healthColor = 'blue';
                }, 200);
                enemy.isHit = true;
            } else {
                enemy.isHit = false;
            }
        });
    });

    if(enemy.alive === false && !enemy2.hyper) {
        enemy2.velocity.x += 4.5;
        enemy2.velocity.y += 4.5;
        enemy2.health = enemy2.maxHealth;
        enemy2.color = 'red';
        enemy2.hyper = true;
    }
    if(enemy2.alive === false && !enemy.hyper) {
        enemy.velocity.x += 4.5;
        enemy.velocity.y += 4.5;
        enemy.health = enemy.maxHealth;
        enemy.color = 'red';
        enemy.hyper = true;
    }

    suiciders.forEach(enemy => {
        if(Utils.rectCollides(enemy, player)) {
            // enemy.y -= enemy.height - enemy.height * 50 / 51;
            // enemy.x -= enemy.width - enemy.width * 50 / 51;
            // enemy.width *= 50 / 51;
            // enemy.height *= 50 / 51;
            enemy.explode("scatter", 2000, 7);
            player.color = 'red';
            setTimeout(() => {
                if(enemy.alive) player.hit(enemy.damage / 50);
                //enemy.die();
                player.color = 'red';
            }, 300);
        }
    });
}


        




function drawAndMove() {
    player.draw();
    player.move();

    suiciders.forEach(enemy => {
        enemy.draw();
        enemy.move();
    });
}
