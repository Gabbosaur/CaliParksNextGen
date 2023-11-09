// import { turnLed } from "./led.js";
// import fetch from "node-fetch";

const IP_ADDRESS = "10.8.0.30"
const PORT = 8123

function turnLed(value) {
    fetch('http://' + IP_ADDRESS + ':' + PORT + '/set/21', {
        method: 'PATCH',
        body: JSON.stringify({ "on": value }),
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    }).then((response) => response.json())
        .then((json) => console.log(json));
}
console.log("provaassaoksa")

window.onload = function () {
    document.getElementById('turnLedOn').addEventListener('click', function () {
        console.log("clicked led ON");
        turnLed(1);
        console.log("finish ON");
    });

    document.getElementById("turnLedOff").addEventListener('click', function () {
        console.log("clicked led OFF");
        turnLed(0);
        console.log("finish OFF");
    });
}




// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// const URL = "./model/";
const URL = "https://teachablemachine.withgoogle.com/models/to5Ug0JQ_/";
let model, webcam, ctx, labelContainer, maxPredictions;

let flag_start = false;
let flag_end = false;
let flag_led = false;
let reps = 0;
let playerName = "Player";
let ranking = [];

let COUNTDOWN_TIMER_IN_SECONDS = 30;

var timeInSecs;
var ticker;

function startTimer(secs, webcam) {
    resetCounter();
    timeInSecs = parseInt(secs * 10);
    ticker = setInterval("tick(webcam)", 100);
}

function tick(webcam) {
    var secs = Math.floor(timeInSecs / 10);
    var deciSecs = timeInSecs % 10;
    if (deciSecs > 0 || secs > 0) {
        timeInSecs--;
    }
    else {
        clearInterval(ticker);
        webcam.stop();
        enableStartButton();
        updateRanking(playerName, reps);
    }

    secs %= 60;
    var pretty = ((secs < 10) ? "0" : "") + secs + ":" + deciSecs;

    document.getElementById("countdown").innerHTML = pretty;
}



function updateRanking(name, reps) {
    let record = {};
    record["player"] = name;
    record["reps"] = reps;
    ranking.push(record);
    ranking.sort((a, b) => parseInt(b.reps) - parseInt(a.reps)); // descending order

    const rankingsList = document.querySelector(".list-group");
    rankingsList.innerHTML = ""; // clear the existing list items
    ranking.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
        // Apply even or odd class based on the index
        if (index % 2 === 0) {
            listItem.classList.add("even-list-item");
        } else {
            listItem.classList.add("odd-list-item");
        }

        if (index === 0) {
            listItem.innerHTML = `🥇 ${item.player}`;
        } else if (index === 1) {
            listItem.innerHTML = `🥈 ${item.player}`;
        } else if (index === 2) {
            listItem.innerHTML = `🥉 ${item.player}`;
        }
        else {
            listItem.innerHTML = `${item.player}`;
        }
        const repsRankingElement = document.createElement("span");
        repsRankingElement.style = "font-weight: bold;";
        repsRankingElement.innerHTML = `${item.reps}`;
        listItem.appendChild(repsRankingElement);
        rankingsList.appendChild(listItem);
    });
}

function updatePlayerName(name) {
    name = name.trim();
    playerName = name.charAt(0).toUpperCase() + name.slice(1);
}

function disableStartButton() {
    const button = document.getElementById("startButton");
    button.setAttribute("disabled", "");
}

function enableStartButton() {
    const button = document.getElementById("startButton");
    button.removeAttribute("disabled");
}

function exportData(el) {
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ranking));
    el.setAttribute("href", "data:" + data);
    el.setAttribute("download", "CaliParksNextGen-Ranking.json");
}

// Da fixare e strutturare meglio l'output del pdf
window.jsPDF = window.jspdf.jsPDF;
window.html2canvas = html2canvas;
window.addEventListener("DOMContentLoaded", (event) => {
    const el = document.getElementById("generate-pdf");
    if (el) {
        el.addEventListener("click", function () {
            // Create a new jsPDF instance
            var doc = new jsPDF();

            // Get the HTML content you want to convert
            var pdfContent = document.getElementById("modalrank");

            // Generate the PDF from the HTML content
            doc.html(pdfContent, { x: 5, y: 55 }).then(function () { doc.save("test.pdf") });

            // Save or display the PDF (e.g., open it in a new tab)
            // doc.save("my-pdf-document.pdf");
        });
    }
});


async function init() {
    disableStartButton();
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = 400;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    startTimer(COUNTDOWN_TIMER_IN_SECONDS, webcam);
    window.requestAnimationFrame(loop);


    // append/get elements to the DOM
    const canvas = document.getElementById("canvas");
    canvas.width = size; canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

function updateCounter() {
    counter = document.getElementById("counter");
    counter.textContent = reps;
    playTone(800, "sine", 0.3);
}

function resetCounter() {
    reps = 0;
    counter = document.getElementById("counter");
    counter.textContent = reps;
}

async function updateBar(prediction) {
    var progressBar1 = document.getElementById("progressBar1");
    var progressBar2 = document.getElementById("progressBar2");
    var progressBar3 = document.getElementById("progressBar3");
    // await
    progressBar1.style.setProperty('--width', prediction[0].probability * 100 + '%');
    progressBar2.style.setProperty('--width', prediction[1].probability * 100 + '%');
    progressBar3.style.setProperty('--width', prediction[2].probability * 100 + '%');
}

function incrementCounter() {
    counter.style.fontSize = "110px";
    reps++;
    updateCounter();
    turnLed(1);
    console.log("led ON");
    flag_led = true;
    setTimeout(function () {
        counter.style.fontSize = "100px";
    }, 200);
}


async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    updateBar(prediction);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;

        if (prediction[0].probability > 0.95 && !flag_end) {
            flag_start = true;
            if (flag_led) {
                turnLed(0);
                console.log("led OFF");
                flag_led = false;
            }
        }
        if (prediction[2].probability > 0.95 && flag_start) {
            flag_end = true;
            incrementCounter();

            flag_start = false;
            flag_end = false;
        }
    }


    // finally draw the poses
    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}