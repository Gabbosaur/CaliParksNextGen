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
console.log("provasa")

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

// the link to your model provided by Teachable Machine export panel
// const URL = "./model/";
const URL = "https://teachablemachine.withgoogle.com/models/5J7bd1hZc/";

let model, webcam, ctx, labelContainer, maxPredictions;

let flag_start = false;
let flag_end = false;
let flag_led = false;
let flag_SW_start = false;
let flag_SW_end = false;
let reps = 0;
let playerName = "Player";
let ranking = [];
let selectedGameMode = "amrap";
let rankingIso = [];
let floatIsoValue = 0.0;


let COUNTDOWN_TIMER_IN_SECONDS = 10;

var timeInSecs;
var ticker;

let startTime = 0;
let interval;
let isRunning = false;
let centiseconds = 0;

function startIsoTimer() {
    if (!isRunning) {
        playTone(800, "sine", 0.3); // Play start sound on server
        turnLed(1); // Turn LED ON and sound on raspberry
        startTime = new Date().getTime() - centiseconds * 10;
        interval = setInterval(updateDisplay, 10); // Update display every 10 milliseconds
        // document.getElementById("start").textContent = "Start";
        isRunning = true;
    }
}

function stopIsoTimer() {
    if (isRunning) {
        playTone(800, "sine", 0.3); // Play finish sound on server
        turnLed(1); // Play sound again on raspberry
        clearInterval(interval);
        // document.getElementById("stop").textContent = "Stop";
        isRunning = false;
        centiseconds = Math.floor((new Date().getTime() - startTime) / 10);
    }
}

function resetIsoTimer() {
    clearInterval(interval);
    turnLed(0);
    document.getElementById("display").textContent = "00.00";
    // document.getElementById("start").textContent = "Start";
    isRunning = false;
    centiseconds = 0;
}

function updateDisplay() {
    centiseconds = Math.floor((new Date().getTime() - startTime) / 10);
    const seconds = Math.floor(centiseconds / 100);
    const centiSeconds = centiseconds % 100;

    const display = `${String(seconds).padStart(2, '0')}.${String(centiSeconds).padStart(2, '0')}`;
    document.getElementById("display").textContent = display;

    const stringValue = seconds.toString() + "." + centiseconds.toString();
    floatIsoValue = parseFloat(stringValue);
}




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
        enableSelectGameMode();
        updateRanking(playerName, reps, null, selectedGameMode);
    }

    secs %= 60;
    var pretty = ((secs < 10) ? "0" : "") + secs + ":" + deciSecs;

    document.getElementById("countdown").innerHTML = pretty;
}



function updateRanking(name, reps, time, gameMode) {
    if (gameMode === "amrap") {
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
    } else if (gameMode === "iso") {
        console.log("time in iso mode: " + time);
        let record = {};
        record["player"] = name;
        record["time"] = time;
        rankingIso.push(record);
        rankingIso.sort((a, b) => parseInt(b.time) - parseInt(a.time)); // descending order

        const rankingsListIso = document.querySelector(".list-group-iso");
        rankingsListIso.innerHTML = ""; // clear the existing list items
        rankingIso.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";

            // convert back to a better format
            let t_seconds = Math.floor(item.time);
            let t_centiseconds = Math.round((item.time-t_seconds)*100);
            console.log(time);
            console.log(t_seconds);
            console.log(t_centiseconds);
            const t_time = `${String(t_seconds).padStart(2, '0')}.${String(t_centiseconds).padStart(2, '0')}`;
        

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
            // repsRankingElement.innerHTML = `${item.time}`;
            repsRankingElement.innerHTML = `${t_time}`;
            listItem.appendChild(repsRankingElement);
            rankingsListIso.appendChild(listItem);
        });
    }

}

function updatePlayerName(name) {
    name = name.trim();
    playerName = name.charAt(0).toUpperCase() + name.slice(1);
}

function disableStartButton() {
    const button = document.getElementById("startButton");
    button.setAttribute("disabled", "");
}

function disableSelectGameMode() {
    const button = document.getElementById("gameModeSelect");
    button.setAttribute("disabled", "");
}

function enableStartButton() {
    const button = document.getElementById("startButton");
    button.removeAttribute("disabled");
}

function enableSelectGameMode() {
    const button = document.getElementById("gameModeSelect");
    button.removeAttribute("disabled");
}

function exportData(el) { // da separare i due rankings
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

document.addEventListener("DOMContentLoaded", function () {
    // Get the select element by its ID
    var selectElement = document.getElementById("gameModeSelect");

    // Add an event listener to listen for changes in the select element
    selectElement.addEventListener("change", function () {
        // Get the selected value
        var selectedValue = selectElement.value;

        // Use the selected value as needed
        console.log("Selected Game Mode: " + selectedValue);

        // You can perform additional actions based on the selected value here.
        // For example:
        if (selectedValue === "amrap") {
            // Handle the "As many reps as possible" mode
            selectedGameMode = "amrap";
            document.getElementById("amrapcounter").style.display = "inline";
            document.getElementById("countdown").style.display = "inline";
            document.getElementById("countdown").style.fontSize = "48px";
            document.getElementById("display").style.display = "none";

        } else if (selectedValue === "iso") {
            // Handle the "Isometric hold" mode
            selectedGameMode = "iso";
            document.getElementById("amrapcounter").style.display = "none";
            document.getElementById("countdown").style.display = "none";
            document.getElementById("display").style.display = "inline";
            document.getElementById("display").textContent = "00.00";
            document.getElementById("display").style.fontSize = "68px";
            // DA FARE LA PARTE DEL CONTROLLO ISOMETRICO
            // DA FARE LA CLASSIFICA, SEPARARE IN MODALITà
        }
    });
});

async function init() {
    disableStartButton();
    disableSelectGameMode();
    resetIsoTimer();
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

    // Game Mode
    if (selectedGameMode === 'amrap') {
        console.log("Game Mode: " + selectedGameMode);
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
    } else if (selectedGameMode === 'iso') {
        console.log("Game Mode: " + selectedGameMode);
        window.requestAnimationFrame(loopIso);


        // append/get elements to the DOM
        const canvas = document.getElementById("canvas");
        canvas.width = size; canvas.height = size;
        ctx = canvas.getContext("2d");
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
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

async function loopIso(timestamp) {
    webcam.update(); // update the webcam frame
    await predictIso();
    window.requestAnimationFrame(loopIso);
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

async function predictIso() {
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
            // if (flag_led) {
            //     turnLed(0);
            //     console.log("led OFF");
            //     flag_led = false;
            // }
            if (flag_SW_end) {
                webcam.stop();
                enableStartButton();
                enableSelectGameMode();
                updateRanking(playerName, null, floatIsoValue, selectedGameMode);
                flag_SW_end = false;
            }
        }
        if (prediction[1].probability > 0.95 && flag_SW_start) {
            stopIsoTimer();
            flag_SW_end = true;
            flag_SW_start = false;
        }
        if (prediction[2].probability > 0.95 && flag_start) {
            flag_end = true;
            startIsoTimer();
            flag_SW_start = true;
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