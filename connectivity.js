const ws = new WebSocket("ws://localhost:8082");

ws.addEventListener("open", () => {
    console.log("We are connected!");

    ws.send("Henlo, this is CLIENT, how's it going?");

    console.log("REPS: " + reps);
    ws.send(reps);
});

ws.addEventListener("message", e => {
    console.log(e);
})