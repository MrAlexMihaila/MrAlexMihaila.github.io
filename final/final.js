const volumeDisplay = document.getElementById("volumeText");
const startGameButton = document.getElementById("startGameButton");
const restartGameButton = document.getElementById("restartGameButton");
const runner = document.getElementById("runner-icon");
const countdownOverlay = document.getElementById("countdown-overlay");
const countdownNumber = document.getElementById("countdown-number");
const infoBox = document.getElementById("info-box");
const crowdAudio = document.getElementById("crowd-audio");
const booAudio = document.getElementById("crowd-boo-audio");
const celebrateAudio = document.getElementById("celebrate-audio");

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

function startAudio(audioVar)
{
    audioVar.currentTime = 0;
    audioVar.volume = 0.4;
    audioVar.play();
}

function stopAudio(audioVar) 
{
    audioVar.pause();
    audioVar.currentTime = 0;
}

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
    startAudio(crowdAudio);
    //document.getElementById("instructions").style.display = "none";
}

function restartGame() 
{
    if(![4,5,6].includes(gameState))
    {
        return;
    }

    stopAudio(crowdAudio);
    stopAudio(booAudio);
    stopAudio(celebrateAudio);

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
    stopAudio(crowdAudio);
    startAudio(celebrateAudio);
    launchConfetti();
    volumeDisplay.innerText = "Volume: " + finalJumpVolume;
    restartGameButton.disabled = false;
}

function failMaxLogic() 
{
    stopRunAnimation();
    stopAudio(crowdAudio);
    startAudio(booAudio);
    runner.innerText = "🫠";
    infoBox.innerText = "Overexerted yourself! Try again!"
    volumeDisplay.innerText = "Volume: 0";
    restartGameButton.disabled = false;
}

function failMinLogic()
{
    stopRunAnimation();
    stopAudio(crowdAudio);
    startAudio(booAudio);
    runner.innerText = "😵";
    infoBox.innerText = "Underexerted yourself! Try again!";
    volumeDisplay.innerText = "Volume: 0";
    restartGameButton.disabled = false;
}

function launchConfetti() 
{
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#e67e22"];
    const container = document.getElementById("game-container");

    for(let i = 0; i < 80; i++) 
    {
        const piece = document.createElement("div");
        const isRect = Math.random() > 0.5;
        const size = Math.random() * 8 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = Math.random() * 100; // % across container
        const delay = Math.random() * 1.2;
        const duration = Math.random() * 1.5 + 1.5;
        const drift = (Math.random() - 0.5) * 160; // px left or right
        const spin = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 600 + 200);

        piece.style.cssText = `
            position: absolute;
            width: ${isRect ? size : size * 0.6}px;
            height: ${isRect ? size * 0.4 : size}px;
            background: ${color};
            left: ${startX}%;
            top: -12px;
            border-radius: ${isRect ? "2px" : "50%"};
            pointer-events: none;
            z-index: 20;
            animation: none;
        `;
        container.appendChild(piece);

        piece.animate([
            { 
                transform: `translateY(0px) translateX(0px) rotate(0deg)`, 
                opacity: 1 
            },

            { 
                transform: `translateY(180px) translateX(${drift * 0.4}px) rotate(${spin * 0.4}deg)`, 
                opacity: 1, 
                offset: 0.5 
            },

            { 
                transform: `translateY(420px) translateX(${drift}px) rotate(${spin}deg)`, 
                opacity: 0 
            }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            fill: "forwards"
        }).onfinish = () => piece.remove();
    }
}