import fetch from "node-fetch";

const IP_ADDRESS = "192.168.43.198"
const PORT = 8000

function turnLed(value) {
    console.log("entrato dentro turnled con valore: " + value);
    fetch('http://' + IP_ADDRESS + ':' + PORT + '/set/21', {
        method: 'PATCH',
        body: JSON.stringify({ "on": value }),
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    }).then((response) => response.json())
        .then((json) => console.log(json));
}

module.exports = {
    turnLed,
  };
  
// turnLed(1);