// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = "./model/";
let model, webcam, ctx, labelContainer, maxPredictions;

let flag_start = false;
let flag_end = false;
let reps = 0;

async function init() {
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
}


async function updateBar(prediction) {
    var progressBar1 = document.getElementById("progressBar1");
    var progressBar2 = document.getElementById("progressBar2");
    var progressBar3 = document.getElementById("progressBar3");
    await progressBar1.style.setProperty('--width', prediction[0].probability * 100 + '%');
    await progressBar2.style.setProperty('--width', prediction[1].probability * 100 + '%');
    await progressBar3.style.setProperty('--width', prediction[2].probability * 100 + '%');
    updateStartPercentage(prediction);
}

function updateStartPercentage(prediction) {
    counter1 = document.getElementById("pu-start");
    counter2 = document.getElementById("pu-mid");
    counter3 = document.getElementById("pu-end");
    counter1.textContent = prediction[0].probability.toFixed(2) * 100 + '%';
    counter2.textContent = prediction[1].probability.toFixed(2) * 100 + '%';
    counter3.textContent = prediction[2].probability.toFixed(2) * 100 + '%';

}

function incrementCounter() {
    counter.style.fontSize = "110px";
    reps++;
    updateCounter();

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