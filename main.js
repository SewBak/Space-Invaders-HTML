const c = document.getElementById("c");
const d = c.getContext("2d");
const g = 10
goingLeft = false;
goingRight = false;
canCreateProjectile = true;
//Changing the style to RED because RED is COOL
d.fillStyle = "#ff0000";
moveTurn = true;
//Storing the positions of the squares that make up the enemy
const enemymodel = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, 1],
    [-1, -1],
    [1, -1]
];
const playermodel = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, -2]
]
//Arrays for storing square positions (columns are 3D arrays and the player is a 2D array)
column1 = [];
column2 = [];
player = [];
projectiles = [];
enemyprojectile = [];
//Function that makes drawing easier
function rect(x, y) {
    d.fillRect(x * g, y * g, g, g);
}
drawInitialEnemies();

function drawInitialEnemies() {
    x = 2;
    y = 3;
    column = 1;
    while (true) {
        if (x >= 50) {
            y += 5;
            x = 6;
            //Increasing the column count
            column++;
        }
        if (y >= 9) break;
        //Creating an array where we will store the squares that make up the current enemy
        currentenemy = [];
        for (i = 0; i < enemymodel.length; i++) {
            rect(x + enemymodel[i][0], y + enemymodel[i][1]);
            currentenemy.push([x + enemymodel[i][0], y + enemymodel[i][1]]);
        }
        if (column == 1) column1.push(currentenemy);
        if (column == 2) column2.push(currentenemy);
        x += 7;
    }
}
//interval for moveEnemies
const moveEnemiesInterval = setInterval(moveEnemies, 1000);
//interval for updateProjectiles
const updateProjectilesInterval = setInterval(updateProjectiles, 100);
setTimeout(createEnemyProjectile, 3000);
function moveEnemies() {
    //Clearing the screen
    d.clearRect(0, 0, 500, 500);
    drawProjectiles();
    //Moving all squares that make up the enemies to the left/ to the right, starting with the first column
    for (i = 0; i < column1.length; i++) {
        for (j = 0; j < column1[i].length; j++) {
            if (moveTurn) column1[i][j][0]++;
            else column1[i][j][0]--;
            rect(column1[i][j][0], column1[i][j][1]);
        }
    }
    for (i = 0; i < column2.length; i++) {
        for (j = 0; j < column2[i].length; j++) {
            if (moveTurn) column2[i][j][0]--;
            else column2[i][j][0]++;
            rect(column2[i][j][0], column2[i][j][1]);
        }
    }
    //Drawing the player again because the whole screen was cleared
    drawPlayer();
    //Swapping the movement for the next time the function gets called
    moveTurn = !moveTurn;
}
drawInitialPlayer();
//Draw the initial player
function drawInitialPlayer() {
    x = 25;
    y = 45;
    for (i = 0; i < playermodel.length; i++) {
        rect(x + playermodel[i][0], y + playermodel[i][1]);
        player.push([x + playermodel[i][0], y + playermodel[i][1]]);
    }
}
//Draw the player
function drawPlayer() {
    for (i = 0; i < player.length; i++) {
        rect(player[i][0], player[i][1]);
    }
}
//Draw the columns
function drawColumns() {
    for (i = 0; i < column1.length; i++) {
        for (j = 0; j < column1[i].length; j++) {
            rect(column1[i][j][0], column1[i][j][1]);
        }
    }
    for (i = 0; i < column2.length; i++) {
        for (j = 0; j < column2[i].length; j++) {
            rect(column2[i][j][0], column2[i][j][1]);
        }
    }
}
//What happens when a key is pressed
function keyDown(event) {
    key = event.keyCode || event.which;
    if (key == 65 && goingRight) {
        clearInterval(rightInterval);
        goingRight = false;
    } else if (key == 68 && goingLeft) {
        clearInterval(leftInterval);
        goingLeft = false;
    }
    if (key == 65 && goingLeft == false) {
        window.leftInterval = setInterval(function () { movePlayer(0); }, 50);
        goingLeft = true;
        return;
    } else if (key == 68 && goingRight == false) {
        window.rightInterval = setInterval(function () { movePlayer(1); }, 50);
        goingRight = true;
        return;
    } else if (key == 32) {
        createProjectile();
    }
}

function keyUp(event) {
    key = event.keyCode || event.which;
    if (key == 65) {
        clearInterval(leftInterval);
        goingLeft = false;
    } else if (key == 68) {
        clearInterval(rightInterval);
        goingRight = false;
    }
}

function movePlayer(dir) {
    d.clearRect(0, 0, 500, 500);
    drawColumns();
    drawProjectiles();
    rect(enemyprojectile[0], enemyprojectile[1]);
    for (i = 0; i < player.length; i++) {
        if (dir == 0) player[i][0]--;
        else if (dir == 1) player[i][0]++;
        rect(player[i][0], player[i][1]);
    }
    borderCollision();
}

function borderCollision() {
    for (i = 0; i < player.length; i++) {
        if (player[i][0] < 0) {
            movePlayer(1);
        } else if (player[i][0] > 49) {
            movePlayer(0);
        }
    }
}

function createProjectile() {
    if (canCreateProjectile == false) return;
    projectiles.push([player[4][0], player[4][1] - 1]);
    rect(player[4][0], player[4][1] - 1);
    canCreateProjectile = false;
    setTimeout(function () { canCreateProjectile = true; }, 1000);
}

function updateProjectiles() {
    d.clearRect(0, 0, 500, 500);
    drawColumns();
    drawPlayer();
    for (i = 0; i < projectiles.length; i++) {
        projectiles[i][1]--;
        rect(projectiles[i][0], projectiles[i][1]);
    }
    d.clearRect(enemyprojectile[0] * g, enemyprojectile[1] * g, g, g);
    enemyprojectile[1]++;
    if (enemyprojectile[1] > 49) createEnemyProjectile();
    else rect(enemyprojectile[0], enemyprojectile[1]);
    projectileCollision();
}

function drawProjectiles() {
    for (i = 0; i < projectiles.length; i++) {
        rect(projectiles[i][0], projectiles[i][1]);
    }
}
function projectileCollision() {
    for (i = 0; i < projectiles.length; i++) {
        if (projectiles[i][1] < 0) projectiles.splice(i, 1);
    }
    for (i = 0; i < projectiles.length; i++) {
        checkloop:
        for (j = 0; j < column1.length; j++) {
            for (k = 0; k < column1[j].length; k++) {
                if (projectiles[i][0] == column1[j][k][0] && projectiles[i][1] == column1[j][k][1]) {
                    projectiles.splice(i, 1);
                    column1.splice(j, 1);
                    d.clearRect(0, 0, 500, 500);
                    drawColumns();
                    drawPlayer();
                    drawProjectiles();
                    break checkloop;
                }
            }
        }
        checkloop2:
        for (j = 0; j < column2.length; j++) {
            for (k = 0; k < column2[j].length; k++) {
                if (projectiles[i][0] == column2[j][k][0] && projectiles[i][1] == column2[j][k][1]) {
                    projectiles.splice(i, 1);
                    column2.splice(j, 1);
                    d.clearRect(0, 0, 500, 500);
                    drawColumns();
                    drawPlayer();
                    drawProjectiles();
                    break checkloop2;
                }
            }
        }
    }
    for (i = 0; i < player.length; i++) {
        if (enemyprojectile[0] == player[i][0] && enemyprojectile[1] == player[i][1]) {
            alert("You lost");
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_self");
            break;
        }
    }
    if (column1.length == 0 && column2.length == 0) {
        alert("You win");
        window.open("https://www.youtube.com/watch?v=rRPQs_kM_nw", "_self");
    }
}
function createEnemyProjectile() {
    d.clearRect(enemyprojectile[0] * g, enemyprojectile[1] * g, g, g)
    enemyprojectile = [];
    if (Math.random() < 0.5) {
        enemyIndex = Math.floor(Math.random() * (column1.length));
        enemyprojectile = [column1[enemyIndex][0][0], column1[enemyIndex][0][1] + 2];
        rect(enemyprojectile[0], enemyprojectile[1]);
    }
    else {
        enemyIndex = Math.floor(Math.random() * (column2.length));
        enemyprojectile = [column2[enemyIndex][0][0], column2[enemyIndex][0][1] + 2];
        rect(enemyprojectile[0], enemyprojectile[1]);
    }
}