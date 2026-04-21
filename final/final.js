const gameStateDisplay = document.getElementById("gameStateDisplay");
const volumeDisplay = document.getElementById("volumeText");
const startGameButton = document.getElementById("startGameButton");
const restartGameButton = document.getElementById("restartGameButton");

let powerValue = 0;
const POWER_UP = 15;
const POWER_DOWN = 7;

let timesAtMaxPower = 0;
let timesAtMinPower = 0;
const maxTimeAtMaxPower = 3;
const maxTimeAtMinPower = 3;

let currentDistance = 0;
const finalDistance = 200;

//1, intro 
//2, running 
//3, jumping 
//4, success 
//5, fail max power
//6, fail min power
let gameState = 1;
let distanceCheckTimer;

addEventListener("keydown", e => {
    if(e.code === "Space" && gameState === 2)
    {
        powerValueCalculation(true);
    }
});

function setPower(powerAmount) 
{
    powerValue = Math.max(0, Math.min(100, powerAmount));
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

function powerValueCalculation(increasing) 
{
    setPower(increasing ? powerValue + POWER_UP : powerValue - POWER_DOWN);
}

function startGame()
{
    if(gameState !== 1) 
    {
        return;
    }

    gameState = 2;
    gameStateDisplay.innerText = "Running";
    startGameButton.disabled = true;
    restartGameButton.disabled = true;
    setPower(0);
    currentDistance = 0;
    timesAtMaxPower = timesAtMinPower = 0;
    distanceCheckTimer = setInterval(distanceCheckAndChange, 100);
    document.getElementById("instructions").style.display = "none";
}

function restartGame() 
{
    if(![4,5,6].includes(gameState))
    {
        return;
    }

    gameState = 1;
    gameStateDisplay.innerText = "Game Not Started";
    volumeDisplay.innerText = "Volume: ";
    setPower(0);
    document.getElementById("runner-icon").style.left = "0%";
    startGameButton.disabled = false;
    restartGameButton.disabled = true;
}

function distanceCheckAndChange() 
{
    if(gameState !== 2)
    {
        return;
    }

    let mult = powerValue > 80 ? 5.33 : powerValue > 35 ? 2.67 : 1.33;
    currentDistance += mult;

    const runner = document.getElementById("runner-icon");
    runner.style.left = Math.min(100, (currentDistance / finalDistance) * 100) + "%";

    if(currentDistance > finalDistance)
    {
        clearInterval(distanceCheckTimer);
        gameState = 3;
        jumpingLogic();
        return;
    }

    if(powerValue >= 100)
    {
        if(++timesAtMaxPower >= maxTimeAtMaxPower)
        { 
            clearInterval(distanceCheckTimer); 
            gameState = 5; 
            failMaxLogic(); 
            return; 
        }
    }
    else
    { 
        timesAtMaxPower = 0;
    }

    powerValueCalculation(false);

    if(powerValue <= 0) 
    {
        if(++timesAtMinPower >= maxTimeAtMinPower)
        { 
            clearInterval(distanceCheckTimer); 
            gameState = 6; 
            failMinLogic(); 
            return; 
        }
    }
    else
    { 
        timesAtMinPower = 0; 
    }
}

function jumpingLogic() 
{
    gameStateDisplay.innerText = "Jumping!";
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