const volumeDisplay = document.getElementById("volumeText");
const startGameButton = document.getElementById("startGameButton");
const restartGameButton = document.getElementById("restartGameButton");
const runner = document.getElementById("runner-icon");
const countdownOverlay = document.getElementById("countdown-overlay");
const countdownNumber = document.getElementById("countdown-number");
const infoBox = document.getElementById("info-box");

let powerValue = 0;
const POWER_UP = 15;
const POWER_DOWN = 7;

let timesAtMaxPower = 0;
let timesAtMinPower = 0;
const maxTimeAtMaxPower = 5;
const maxTimeAtMinPower = 5;

let currentDistance = 0;
const finalDistance = 200;

//for running animation
const runFrames = ["🏃", "🚶"];
let frameIndex = 0;
let frameTimer = null;
runner.style.transform = "scaleX(-1)"; //force them to face right

//0, countdown
//1, intro 
//2, running 
//3, jumping 
//4, success 
//5, fail max power
//6, fail min power
let gameState = 1;
let distanceCheckTimer;

let finalJumpVolume = 0;

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

function startRunAnimation()
{
    runner.classList.add("running");
    frameTimer = setInterval(() => {
        frameIndex = (frameIndex + 1) % runFrames.length;
        runner.innerText = runFrames[frameIndex];
    }, 200);
}

function stopRunAnimation() 
{
    runner.classList.remove("running");
    clearInterval(frameTimer);
    frameTimer = null;
}

function beginCountdown()
{
    if(gameState !== 1)
    {
        return;
    }

    gameState = 0;
    startGameButton.disabled  = true;
    restartGameButton.disabled = true;
    document.getElementById("instructions").style.display = "none";

    let count = 3;
    countdownNumber.className = "";
    countdownNumber.textContent = count;
    countdownOverlay.classList.add("active");

    const tick = setInterval(() => {
        count = count - 1;
        countdownNumber.style.animation = "none";
        countdownNumber.offsetHeight;
        countdownNumber.style.animation = "";

        if(count > 0)
        {
            countdownNumber.className = "";
            countdownNumber.textContent = count;
        }
        else 
        {
            clearInterval(tick);
            countdownNumber.classList.add("go");
            countdownNumber.textContent = "GO!";
            setTimeout(() => {
                countdownOverlay.classList.remove("active");
                startGame();
            }, 700);
        }
    }, 900);
}

function startGame()
{
    gameState = 2;
    runner.className = "";
    runner.style.transform = "scaleX(-1)";
    runner.innerText = runFrames[0];
    startRunAnimation()
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
    volumeDisplay.innerText = "Volume: ";
    setPower(0);
    document.getElementById("runner-icon").style.left = "0%";
    startGameButton.disabled = false;
    restartGameButton.disabled = true;
    runner.style.left = "0%";
    runner.style.transform = "scaleX(-1)";
    runner.innerText = "🏃";
    runner.className = "";
    infoBox.innerText = "";
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
        startJumpAnimation();
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

function startJumpAnimation() {
    clearInterval(distanceCheckTimer);
    gameState = 3; 

    finalJumpVolume = Math.floor(powerValue);
    stopRunAnimation();

    runner.innerText = "🤸";
    runner.classList.add("jumping");

    setTimeout(() => {
        resultLogic(); 
    }, 800);
}

function resultLogic() 
{
    gameState = 4;
    stopRunAnimation();
    volumeDisplay.innerText = "Volume: " + finalJumpVolume;
    restartGameButton.disabled = false;
}

function failMaxLogic() 
{
    stopRunAnimation();
    runner.innerText = "🫠";
    infoBox.innerText = "Overexerted yourself! Try again!"
    volumeDisplay.innerText = "Volume: 0";
    restartGameButton.disabled = false;
}

function failMinLogic()
{
    stopRunAnimation();
    runner.innerText = "😵";
    infoBox.innerText = "Underexerted yourself! Try again!";
    volumeDisplay.innerText = "Volume: 0";
    restartGameButton.disabled = false;
}