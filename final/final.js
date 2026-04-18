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
const finalDistance = 500;

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

function powerValueCalculation(increasing)
{
    if(increasing)
    {
        powerValue = powerValue + powerChangeValue;
        if(powerValue > 100)
        {
            powerValue = 100; //upper cap for power level
        }
    }
    else
    {
        powerValue = powerValue - powerChangeValue;
        if(powerValue < 0)
        {
            powerValue = 0; //lower cap for power level
        }
    }

    powerMeter.innerText = "Power Level: " + powerValue;
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
    }
}

function restartGame()
{
    if(gameState === 4 || gameState === 5 || gameState === 6)
    {
        gameState = 1;
        gameStateDisplay.innerText = "Game Not Started";
        powerMeter.innerText = "Power Level: 0";
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
    gameStateDisplay.innerText = "Wow, you overexerted yourself and failed...";
    volumeDisplay.innerText = "Volume: 0";
    restartGameButton.disabled = false;
}

function failMinLogic()
{
    gameStateDisplay.innerText = "Wow, you need to actually try...";
    volumeDisplay.innerText = "Volume: 0";
    restartGameButton.disabled = false;
}