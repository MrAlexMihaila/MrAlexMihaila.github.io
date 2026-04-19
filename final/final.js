const powerMeter = document.getElementById("powerMeter");
const gameStateDisplay = document.getElementById("gameStateDisplay");
const volumeDisplay = document.getElementById("volumeText");

const startGameButton = document.getElementById("startGameButton");
const restartGameButton = document.getElementById("restartGameButton");

let powerValue = 0;
const powerChangeValue = 10;

let timesAtMaxPower = 0;
let timesAtMinPower = 0;
const maxTimeAtMaxPower = 5;
const maxTimeAtMinPower = 5;

let currentDistance = 0;
const smallDistanceMult = 5;
const mediumDistanceMult = 10;
const largeDistanceMult = 20;
const finalDistance = 250;

//1 - intro
//2 - running/power meter part
//3 - jumping animation thing
//4 - result screen
//5 - failed screen, too much power
//6 - failed screen, too little power
let gameState = 1;

let distanceCheckTimer;

addEventListener("keydown", checkIfKeyPressed);

//check if power increase key is pressed
function checkIfKeyPressed(e)
{
    if(e.code === "Space")
    {
        if(gameState === 2)
        {
            powerValueCalculation(true);
        }
    }
}

function powerValueCalculation(increasing) {
    if(increasing)
    {
        powerValue = Math.min(100, powerValue + (powerChangeValue * 2));
    } 
    else 
    {
        powerValue = Math.max(0, powerValue - powerChangeValue);
    }

    const fill = document.getElementById("power-bar-fill");
    fill.style.width = powerValue + "%";

    if(powerValue >= 100)
    {
        fill.classList.add("danger");
    } 
    else 
    {
        fill.classList.remove("danger");
    }
}

function startGame()
{
    if(gameState === 1)
    {
        gameState = 2;
        gameStateDisplay.innerText = "Running";
        startGameButton.disabled = true;
        restartGameButton.disabled = true;
        powerValue = 0;
        currentDistance = 0;
        timesAtMaxPower = 0;
        timesAtMinPower = 0;
        distanceCheckTimer = setInterval(distanceCheckAndChange, 750);
        document.getElementById("instructionBox").style.display = "none";
    }
}

function restartGame()
{
    if(gameState === 4 || gameState === 5 || gameState === 6)
    {
        gameState = 1;
        gameStateDisplay.innerText = "Game Not Started";

        volumeDisplay.innerText = "Volume: ";
        
        const fill = document.getElementById("power-bar-fill");
        if(fill)
        {
            fill.style.width = "0%";
            fill.classList.remove("danger");
        }

        const runner = document.getElementById("runner-icon");
        if(runner)
        {
            runner.style.left = "0%";
        }

        startGameButton.disabled = false;
        restartGameButton.disabled = true;
    }
}

function distanceCheckAndChange()
{
    if(gameState === 2)
    {
        let mult = 1;
        if(powerValue > 80)
        {
            mult = largeDistanceMult;
        }
        else if(powerValue > 35)
        {
            mult = mediumDistanceMult;
        }
        else
        {
            mult = smallDistanceMult;
        }

        if(powerValue === 100)
        {
            timesAtMaxPower = timesAtMaxPower + 1;
            if(timesAtMaxPower >= maxTimeAtMaxPower)
            {
                clearInterval(distanceCheckTimer);
                gameState = 5;
                failMaxLogic();
            }
        }
        else
        {
            timesAtMaxPower = 0;
        }

        powerValueCalculation(false);

        if(powerValue === 0)
        {
            timesAtMinPower = timesAtMinPower + 1;
            if(timesAtMinPower >= maxTimeAtMinPower)
            {
                clearInterval(distanceCheckTimer);
                gameState = 6;
                failMinLogic();
            }
        }
        else
        {
            timesAtMinPower = 0;
        }

        currentDistance = currentDistance + (1 * mult);

        const runner = document.getElementById("runner-icon");
        const progress = (currentDistance / finalDistance) * 100;
        runner.style.left = Math.min(100, progress) + "%";

        if(currentDistance > finalDistance)
        {
            clearInterval(distanceCheckTimer);
            gameState = 3;
            jumpingLogic();
        }
    }
}

function jumpingLogic()
{
    gameStateDisplay.innerText = "Jumping, insert animation here eventually";
    setTimeout(resultLogic, 2000);
}

function resultLogic()
{
    gameState = 4;
    gameStateDisplay.innerText = "Finished! You did it!";
    volumeDisplay.innerText = "Volume: " + powerValue;
    restartGameButton.disabled = false;
}

function failMaxLogic()
{
    gameStateDisplay.innerText = "Wow, you overexerted yourself. Try again.";
    volumeDisplay.innerText = "Volume: 0";
    restartGameButton.disabled = false;
}

function failMinLogic()
{
    gameStateDisplay.innerText = "You put in no effort and tripped. Try again.";
    volumeDisplay.innerText = "Volume: 0";
    restartGameButton.disabled = false;
}