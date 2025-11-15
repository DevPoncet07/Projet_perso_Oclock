


document.querySelector("html").addEventListener("keydown", handlerKey);

const main = document.querySelector("main");
const game = document.querySelector(".game");

const dino = document.querySelector('.dino');
dino.classList.add('dinoIdle')


const obstacles = [];
let lastTimeObstacle = 0;
let timeBetwennObstacle = 30;
let vitesse = 15;

let coordYDino = 250;
let countTimeJumpAnim = 0;
let dinoOnJump = false;
let timeMinObstacle=25;



let score = 0;
let coordScore = [450, 280];
let scoreInMove = false;
let alreadyMoveScore = false;
const nbScore = document.querySelector("#nbScore")
const allScore = document.querySelector("#score")

const title1 = document.querySelector('.title1')
const title2 = document.querySelector('.title2')

let title1InMove = false;
let alreadyMoveTitle1 = false;
let title2InMove = false;
let alreadyMoveTitle2 = false;
let timeLongAnimStart=2;
let timeShortAnimStart=1;


let decors=[];
let timerDecors=10;

let countTimeGame = 0;
let gameOn = false;
let gameover = false;
const intervalGame = setInterval(drawGame, 20);


function handlerKey(event) {
    console.log(event);
    switch (event.key) {
        case 'ArrowUp':
            if (gameOn) {
                dinoOnJump = true;
            }
            break;
        case "Enter":
            if ( !gameOn) {
                main.removeChild(document.querySelector('p'));
                gameOn = true;
                dino.classList.add('dinoLeft')
                reloadGame()
            }
            else if (gameOn){
                console.log('oui')
                terminateGame()
            }
            break;
    }
}



function drawGame() {
    if (gameOn) {
        ++countTimeGame;
        moveObstacle()
        moveDecors();
        if (score %1000>400 && !timeBetwennObstacle<35 && !alreadyMoveScore) {
            timeBetwennObstacle = 80;
            nbScore.style.animation = `animScoreStart ${timeShortAnimStart}s`
            alreadyMoveScore = true
            scoreInMove = true
        } else if (score%1000 > 750 &&  !timeBetwennObstacle<35 && !alreadyMoveTitle1) {
            timeBetwennObstacle = 250;
            title1.style.animation = `animTitle1Start ${timeLongAnimStart}s`
            alreadyMoveTitle1 = true
            title1InMove = true
        } else {
            if (timeBetwennObstacle<0 ) {
                generateObstacle();
                timeBetwennObstacle = generateNumberAlea(timeMinObstacle, 80);
            }
        }
        if (timerDecors===0){
            timerDecors=generateNumberAlea(1,10)
            createDecors();
        }
        if (dinoOnJump) {
            moveDinoOnJump()
        }

        if (title1InMove) {
            title1.style.transform = `translate( ${coordTitle1[0]}px , ${coordTitle1[1]}px)`
            coordTitle1[0] -= vitesse;
            const coorddino = dino.getBoundingClientRect();
            const coord = title1.getBoundingClientRect()
            if (coorddino.bottom > coord.top) {
                if (coorddino.left + 50 < coord.right && coorddino.left + 50 > coord.left) {
                    terminateGame()
                }
            }
            if (coordTitle1[0] < 600) {
                title1InMove = false;
                title2InMove = true;
                title1.style.transform = `translate( 0px , 0px)`;
                title1.style.animation = "animTitle1End 1s";
                coordTitle1 = [2800, 410];

                
            }
        }
        if (title2InMove) {
            title2.style.animation = `animTitle2Start ${timeLongAnimStart}s`
            title2.style.transform = `translate( ${coordTitle2[0]}px , ${coordTitle2[1]}px)`
            coordTitle2[0] -= vitesse;
            const coorddino = dino.getBoundingClientRect();
            const coord = title2.getBoundingClientRect()
            if (coorddino.bottom > coord.top) {
                if (coorddino.left + 50 < coord.right && coorddino.left + 50 > coord.left) {
                    terminateGame()
                }
            }
            if (coordTitle2[0] < 500) {
                title2InMove = false
                title2.style.transform = `translate( 0px , 0px)`
                title2.style.animation = `animTitle2End 1s`;
                coordTitle2 = [2700, 410];
            }
        }

        if (scoreInMove) {
            nbScore.style.transform = `translate( ${coordScore[0]}px , ${coordScore[1]}px)`
            coordScore[0] -= vitesse;
            const coorddino = dino.getBoundingClientRect();
            const coord = nbScore.getBoundingClientRect()
            if (coorddino.bottom > coord.top) {
                if (coorddino.left + 50 < coord.right && coorddino.left + 50 > coord.left) {
                    terminateGame()
                }
            }
            if (coordScore[0] < -1100) {
                scoreInMove = false;
                coordScore = [300, 280];
                nbScore.style.transform = `translate( 0px , 0px)`;
                nbScore.style.animation = `animScoreEnd ${timeLongAnimStart}s`;
            }
        }
        score += 1
        nbScore.textContent = "0".repeat(5 - (score).toString().length) + score
        if (score % 500 === 0) {
            vitesse += 3
            timeLongAnimStart-=0.2;
            timeShortAnimStart-=0.2;
        }
        if (score % 1000 === 0) {
            timeMinObstacle--;
            
        }
        if (score%1000===0){
            alreadyMoveScore = false
            alreadyMoveTitle1 = false
        }
        if (score%7===0){
            dino.classList.toggle('dinoLeft')
            dino.classList.toggle('dinoRight')

        }
        checkGameOver()
        timeBetwennObstacle--;
        timerDecors--;

    }

}

function moveDinoOnJump() {
    if (countTimeJumpAnim < 10) {
        coordYDino -= 20 - countTimeJumpAnim;
    } else {
        coordYDino += 5 + countTimeJumpAnim - 10;
    }
    if (coordYDino > 250) {
        dinoOnJump = false;
        coordYDino = 250;
        countTimeJumpAnim = 0;
    }
    dino.style.transform = `translate(100px,${coordYDino}px)`;
    ++countTimeJumpAnim;

}

function generateObstacle() {
    const typeObstacle=generateNumberAlea(1,3);
    switch (typeObstacle){
        case 1:
            const element = document.createElement('div');
            element.classList.add('obstacle');
            element.style.transform = `translate(${1000}px,197px)`
            game.append(element)
            const obstacle = {
                element: element,
                posx: 1000,
            }
            obstacles.push(obstacle);
            break;
        case 2:
            const element1 = document.createElement('div');
            element1.classList.add('obstacle');
            element1.style.transform = `translate(${1000}px,197px)`
            game.append(element1)
            const obstacle1 = {
                element: element1,
                posx: 1000,
            }
            obstacles.push(obstacle1);
            const element2 = document.createElement('div');
            element2.classList.add('obstacle');
            element2.style.transform = `translate(${1060}px,197px)`
            game.append(element2)
            const obstacle2 = {
                element: element2,
                posx: 1060,
            }
            obstacles.push(obstacle2);

        break
}
}

function moveObstacle() {
    obstacles.forEach((item, index) => {
        item.posx -= vitesse;
        if (item.posx < 0) {
            obstacles.splice(index, 1);
            game.removeChild(item.element)
        }
        item.element.style.transform = `translate(${item.posx}px,185px)`
    });
}



function checkGameOver() {
    const coorddino = dino.getBoundingClientRect();
    obstacles.forEach(item => {
        const coord = item.element.getBoundingClientRect();
        if (coorddino.bottom > coord.top) {
            if (coorddino.left + 50 < coord.right && coorddino.left + 50 > coord.left) {
                terminateGame()
            }
        }
    });
}

function terminateGame() {
    
    
    gameover = true;
    gameOn = false;
    scoreInMove=false
    nbScore.style.animation="";
    nbScore.style.transform="translate(0px,0px)";
    title1.style.transform = `translate( 0px , 0px)`
    title2.style.transform = `translate( 0px , 0px)`
    title1.style.animation = "";
    title2.style.animation = "";
    dino.classList.remove('dinoRight')
    dino.classList.remove('dinoLeft')
    const p = document.createElement('p')
    p.id = 'pStart'
    p.textContent = "Press enter for restart"
    main.prepend(p);
    
    allScore.style.animation="animEndScore 1s";
    allScore.style.transform=" translate(-600px,150px) scale(2)"
}

function reloadGame() {
    for (let i = obstacles.length - 1; i >= 0; --i) {
        game.removeChild(obstacles[i].element);
        obstacles.splice(i, 1);
    }
    timeBetwennObstacle = 30;
    vitesse = 15;
    timeMinObstacle=25;

    coordYDino = 250;
    countTimeJumpAnim = 0;
    dinoOnJump = false;

    score = 0;
    coordScore = [500, 280];
    scoreInMove = false;
    alreadyMoveScore = false;

    coordTitle1 = [3050, 410];
    coordTitle2 = [3000, 410];
    title1InMove = false;
    alreadyMoveTitle1 = false;
    title2InMove = false;
    alreadyMoveTitle2 = false;

    nbScore.style.transform = `translate( 0px , 0px)`
    title1.style.transform = `translate( 0px , 0px)`
    title2.style.transform = `translate( 0px , 0px)`
    dino.style.transform = `translate(100px,${coordYDino}px)`;
    nbScore.style.animation = "";
    title1.style.animation = "";
    title2.style.animation = "";
    allScore.style.animation="";
    allScore.style.transform="scale(1)"
    timeLongAnimStart=2;
    countTimeGame = 0;
    gameOn = true;
    gameover = false;

}
function generateNumberAlea(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function createDecors(){
    const div=document.createElement('div')
    div.classList.add('decors')
    div.style.width=`${generateNumberAlea(1,10)}px`
    div.style.transform="translate(1000px,250px)"
    game.append(div)
    decors.push({
        element:div,
        posx:1000,
        posy:250+generateNumberAlea(1,10)
    })
}

function moveDecors(){
    decors.forEach((item,index)=>{
        item.posx-=vitesse
        item.element.style.transform = `translate(${item.posx}px,${item.posy}px)`
        if(item.posx<0){
            decors.splice(index,1)
            game.removeChild(item.element)
        }
    })

}

