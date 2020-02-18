// visuals (front - end properties)

const editorWrapper = document.querySelector(".editor-wrapper")
const KeyWords = document.querySelectorAll(".color-1")
const SystemCommands = document.querySelectorAll(".color-2")
const Strings = document.querySelectorAll(".color-3")
const stars = document.querySelectorAll(".star")
const themes = document.getElementById("themes")


window.localStorage.trainingData = window.localStorage.trainingData || JSON.stringify([])
// The ratings which will be used as training data will be stored in the local storage, will be parsed with the command "stringify"

// colours for the text editor, setting one for each aspect
const currentColors = {
  back: {},
  one: {},
  two: {},
  three: {},
}

generateRandomTheme() // A random theme is generated for you to vote
/* 
  as you vote, 
  - data is saved to localstorage
*/

predictThemeCombinations()
/*
  - trains a neural network from your vote history
  - creates 100,000 randomized themes
  - runs the themes through the network, getting a score for each
  - sorts and returns the top 20 scored themes
*/   

stars.forEach((star, i) => {
  const score = i / 4
  star.addEventListener("mouseenter", setStars.bind(setStars, i))
  star.addEventListener("mouseleave", clearStars)
  star.addEventListener("click", saveTrainingData.bind(saveTrainingData, score))
})
/*
  - rating is done by selecting the number of stars
  - once a rating is made, data is saved to training data 
  - stars are restored to accommodate the next rating
*/ 

function saveTrainingData(score) {
  const data = JSON.parse(window.localStorage.trainingData)

  data.push({
    input: [
      Math.round(currentColors.back.r/2.55) / 100, // divide by 255 and round to 2 decimal places
      Math.round(currentColors.back.g/2.55) / 100,
      Math.round(currentColors.back.b/2.55) / 100,
      Math.round(currentColors.one.r/2.55) / 100,
      Math.round(currentColors.one.g/2.55) / 100,
      Math.round(currentColors.one.b/2.55) / 100,
      Math.round(currentColors.two.r/2.55) / 100,
      Math.round(currentColors.two.g/2.55) / 100,
      Math.round(currentColors.two.b/2.55) / 100,
      Math.round(currentColors.three.r/2.55) / 100,
      Math.round(currentColors.three.g/2.55) / 100,
      Math.round(currentColors.three.b/2.55) / 100,
    ],
    output: [score]
  })

  window.localStorage.trainingData = JSON.stringify(data)


  predictThemeCombinations()
  clearStars()
  generateRandomTheme()
}

// once sufficient data is generated, color combinations are displayed!
function predictThemeCombinations() {
  const data = JSON.parse(window.localStorage.trainingData)
  if (!data.length) {
    return;
  }

  themes.innerHTML = ""
  const net = new brain.NeuralNetwork({activation: "leaky-relu"});
  const results = []
// activation function
  
  net.train(data)
// training the network
  
  for (let i = 0; i < 100000; i++) {
    const back = getRandomBackgroundRgb()
    const one = getRandomRgb()
    const two = getRandomRgb()
    const three = getRandomRgb()
    const colors = [
      Math.round(back.r/2.55) / 100, // divide by 255 and round to 2 decimal places
      Math.round(back.g/2.55) / 100,
      Math.round(back.b/2.55) / 100,
      Math.round(one.r/2.55) / 100,
      Math.round(one.g/2.55) / 100,
      Math.round(one.b/2.55) / 100,
      Math.round(two.r/2.55) / 100,
      Math.round(two.g/2.55) / 100,
      Math.round(two.b/2.55) / 100,
      Math.round(three.r/2.55) / 100,
      Math.round(three.g/2.55) / 100,
      Math.round(three.b/2.55) / 100,
    ]

    const [ score ] = net.run(colors)
    results.push({ back, one, two, three, score})
  }

  // sort results
  const sortedResults = results.sort(function(a, b) {
    var a = a.score
    var b = b.score

    return b - a
  })

  // keep the top 20 results after sorting
  for (let i = 0; i < 20; i++) {
    addNewTheme(sortedResults[i])
  }
}



// functions and methods called previously

function addNewTheme({back, one, two, three, score}) {
  const newTheme = document.createElement("div")
  newTheme.classList.add("predicted-theme")
  newTheme.innerHTML = `
  <div class="editor-wrapper" style="background:rgb(${back.r}, ${back.g}, ${back.b})">
    <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">import</span> React <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">from</span> <span style="color: rgb(${two.r}, ${two.g}, ${two.b})">"react"</span><br/>
    <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">import</span> ReactDOM <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">from</span> <span style="color: rgb(${two.r}, ${two.g}, ${two.b})">"react-dom"</span><br/>
    <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">import {</span> Provider <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">} from</span> <span style="color: rgb(${two.r}, ${two.g}, ${two.b})">"react-redux"</span><br/>
    <br/>
    <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">import</span> Layout <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">from</span> <span style="color: rgb(${two.r}, ${two.g}, ${two.b})">"./components/Layout"</span><br/>
    <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">import</span> store <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">from</span> <span style="color: rgb(${two.r}, ${two.g}, ${two.b})">"./store"</span><br/>
    <br/>
    <span style="color:rgb(${one.r}, ${one.g}, ${one.b})">const</span> app<span style="color:rgb(${one.r}, ${one.g}, ${one.b})"> = </span>document.<span style="color: rgb(${three.r}, ${three.g}, ${three.b})">getElementById</span><span style="color:rgb(${one.r}, ${one.g}, ${one.b})">(</span><span style="color: rgb(${two.r}, ${two.g}, ${two.b})">'app'</span><span style="color:rgb(${one.r}, ${one.g}, ${one.b})">)</span><br/>
    <br/>
    ReactDOM.render<span style="color:rgb(${one.r}, ${one.g}, ${one.b})">(</span>&lt;<span style="color: rgb(${three.r}, ${three.g}, ${three.b})">Provider store={</span>store<span style="color: rgb(${three.r}, ${three.g}, ${three.b})">}</span>&gt;<br/>
    &nbsp;&nbsp;&lt;<span style="color: rgb(${three.r}, ${three.g}, ${three.b})">Layout </span>/&gt;<br/>
    &lt;/<span style="color: rgb(${three.r}, ${three.g}, ${three.b})">Provider</span>&gt;, app<span style="color:rgb(${one.r}, ${one.g}, ${one.b})"">)</span>
  </div>
  <li>Score ${score}</li>
  <li>Background rgb(${back.r}, ${back.g}, ${back.b})</li>
  <li>KeyWords rgb(${one.r}, ${one.g}, ${one.b})</li>
  <li>SystemCommands rgb(${two.r}, ${two.g}, ${two.b})</li>
  <li>Strings rgb(${three.r}, ${three.g}, ${three.b})</li>
  `
  themes.appendChild(newTheme)
}

function setStars(whichStar) {
  for (let i = 0; i < stars.length; i++) {
    stars[i].classList.add("gold")
    if (i >= whichStar) {
      break;
    }
  }
}

function clearStars() {
  for (const star of stars) {
    star.classList.remove("gold")
  }
}
function generateRandomTheme() {
  currentColors.back = getRandomBackgroundRgb()
  currentColors.one = getRandomRgb()
  currentColors.two = getRandomRgb()
  currentColors.three = getRandomRgb()

  editorWrapper.style.background = `rgb(${currentColors.back.r},${currentColors.back.g},${currentColors.back.b})`
  for (let color of KeyWords) {
    color.style.color = `rgb(${currentColors.one.r},${currentColors.one.g},${currentColors.one.b})`
  }
  for (let color of SystemCommands) {
    color.style.color = `rgb(${currentColors.two.r},${currentColors.two.g},${currentColors.two.b})`
  }
  for (let color of Strings) {
    color.style.color = `rgb(${currentColors.three.r},${currentColors.three.g},${currentColors.three.b})`
  }
}

function getRandomRgb() {
  return {
    r: Math.round(Math.random()*205 + 50), // number between 50 and 255
    g: Math.round(Math.random()*205 + 50),
    b: Math.round(Math.random()*205 + 50),
  }
}

function getRandomBackgroundRgb() {
  return {
    r: Math.round(Math.random()*50), // number between 0 and 50
    g: Math.round(Math.random()*50),
    b: Math.round(Math.random()*50),
  }
}


