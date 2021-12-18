// let client_id = Date.now();
// document.querySelector("#ws-id").textContent = client_id;
import { boardState } from "./index.js";
import { repaintBoard } from "./repaintBoard.js"

let client_id = 1;
export var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);

ws.onmessage = function(event) {
    var messages = document.getElementById('messages')
    var message = document.createElement('li')
    var content = document.createTextNode(event.data)
    message.appendChild(content)
    messages.appendChild(message)
    const newState = JSON.parse(event.data);
    for (let key of Object.keys(boardState)) {
        boardState[key] = newState[key]
    }
    repaintBoard(boardState); 

};

function sendMessage(event) {
    var input = document.getElementById("messageText")
    ws.send(input.value)
    input.value = ''
    event.preventDefault()
}