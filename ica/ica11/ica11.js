// Complete variable definitions and random functions

const customName = document.getElementById("custom-name");
const generateBtn = document.querySelector(".generate");
const story = document.querySelector(".story");

function randomValueFromArray(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

// Raw text strings

let characters = ["Chilly Billy", "Nitro", "Sphere"];

let places = ["a stupidly large, tall, and difficult mountain", "the bottom of the ocean", "some random building they saw on Google Maps"];

let events = ["melted into the ground, never to be seen again.", "get shoved into the wall, merged with the wall, and turned into living art", "just disappeared, as though someone had snapped them from existance"];

// Partial return random string function

function returnRandomStoryString() {
    let randomCharacter = randomValueFromArray(characters);
    let randomPlace = randomValueFromArray(places);
    let randomEvent = randomValueFromArray(events);

    let storyText = "One day, a very long time ago, Bob went outside to go to :inserty: for the day. It was 94 Fahrenheit outside, but that didn't stop Bob from going to :inserty:. Plus, Bob needed to get rid of their 300 pounds weight. Bob ran away as soon as they saw :insertx: :insertz:. It was so terrifying that Bob locked themselves inside their home, vowing to never go to :inserty: again. The fact that :insertz: was even possible was so crazy to Bob that they never went outside for an entire year, fearing that :insertz: could happen to them.";

    storyText = storyText.replaceAll(":insertx:", randomCharacter);
    storyText = storyText.replaceAll(":inserty:", randomPlace);
    storyText = storyText.replaceAll(":insertz:", randomEvent);

    return storyText;
}

// Event listener and partial generate function definition

generateBtn.addEventListener("click", generateStory);

function generateStory() {
    let newStory = returnRandomStoryString();
    if (customName.value !== "") {
        const name = customName.value;
        newStory = newStory.replaceAll("Bob", name);
    }

    if (document.getElementById("uk").checked) {
        const weight = Math.round(300/14) + " stone";
        const temperature = Math.round((94-32)*(5/9)) + " Celsius";

        newStory = newStory.replaceAll("300 pounds", weight);
        newStory = newStory.replaceAll("94 Fahrenheit", temperature);
    }

    // TODO: replace "" with the correct expression
    story.textContent = newStory;
    story.style.visibility = "visible";
}