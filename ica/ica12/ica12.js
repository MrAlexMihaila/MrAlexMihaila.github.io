let newBTN = document.querySelector("#js-new-quote");
let answerBTN = document.querySelector("#js-tweet");
let json = {question: "", answer: ""};

const endpoint = "https://trivia.cyberwisp.com/getrandomchristmasquestion";

newBTN.addEventListener("click", getQuote);
answerBTN.addEventListener("click", displayAnswer);

async function getQuote()
{
    //alert("test");
    try{
        const response = await fetch(endpoint);
        if(!response.ok) //response not ok
        {
            throw error(response.statusText);
        }
        
        json = await response.json();
        console.log(json);
        displayQuote(json.question);
        clearAnswer();
    } catch(error) {
        console.log(error);
        alert("Unable to fetch API endpoint");
    }
}

function displayQuote(quote)
{
    const quoteText = document.querySelector("#js-quote-text");

    quoteText.textContent = quote;
}

function displayAnswer()
{
    const answerText = document.querySelector("#js-answer-text");

    answerText.textContent = json.answer;
}

function clearAnswer()
{
    const answerText = document.querySelector("#js-answer-text");

    answerText.textContent = "";
}

getQuote();