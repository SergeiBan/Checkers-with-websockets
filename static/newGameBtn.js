//These funcs are for game control buttons
import { defaultBoardState, boardState } from "./index.js";
import { repaintBoard } from "./repaintBoard.js";
import { deepCopyFunction } from "./deepCopy.js";

export let ws = false;
export let firstPlayer = false;
let connectionEstablished = false;
let ws_scheme = '';

if (window.location.protocol == "https:") {
    ws_scheme = "wss://";
} else {
    ws_scheme = "ws://";
};

const board = document.getElementsByClassName('board')[0];
const gameMenu = document.getElementsByClassName('game-menu')[0];
const menu = document.getElementsByClassName('menu')[0];

//This func starts a new game on the single device
export const startNewGame = () => {
    menu.textContent = '';
    gameMenu.classList.remove("invisible", "underlayer");
    
    const newGameBtn = document.createElement("button");
    newGameBtn.classList.add('newGameBtn');
    newGameBtn.textContent = 'New Game';
    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add('cancelBtn');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = cancelNewGame;
    

    newGameBtn.onclick = function() {
        connectionEstablished = false;
        for (let key of Object.keys(defaultBoardState)) {
            boardState[key] = deepCopyFunction(defaultBoardState[key]);
        }

        repaintBoard(boardState);
        if (ws) { ws.close(); }
        gameMenu.classList.add("invisible", "underlayer");
        menu.textContent = '';
        board.classList.remove('rotated');
    }
    menu.appendChild(newGameBtn);
    menu.appendChild(cancelBtn);
    
}

//This func provides a player with a number so he could pass it to his friend
export const inviteSecondPlayer = () => {
    menu.textContent = '';
    gameMenu.classList.remove("invisible", "underlayer");
    
    const invitation = document.createElement('button');
    invitation.classList.add('invitation');
    invitation.textContent = "Start multiplayer game";
    menu.appendChild(invitation);
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('ws-id');
    cancelBtn.textContent = "Cancel"
    cancelBtn.onclick = cancelNewGame;
    menu.appendChild(cancelBtn);

    invitation.onclick = () => {
        cancelBtn.onclick = () => { if (ws) { ws.close(); } cancelNewGame(); }
        const getRandomId = max => {
            return Math.floor(Math.random() * max);
        }
        let client_id = getRandomId(10000); //Provide the board ID
        invitation.textContent = client_id + " - Tell this number to the other player. Once he enters it this menu will be closed and the game begins";
        invitation.disabled = true;

        if (ws) { ws.close(); }
        ws = new WebSocket(`${ws_scheme}${window.location.host}/ws?id=${client_id}&first=${true}`);
    
         ws.onmessage = function(event) {
            if (!connectionEstablished) {
                connectionEstablished = true;
                gameMenu.classList.add("invisible", "underlayer");
                menu.textContent = '';
                firstPlayer = true;
                return;
            }
        const newState = JSON.parse(event.data);
        for (let key of Object.keys(boardState)) {
            boardState[key] = newState[key]
        }
        repaintBoard(boardState); 
    };
    boardState.isRemote = true;
    }
}

//Join the first player by entering the code provided by him
export const join = () => {
    menu.textContent = '';
    gameMenu.classList.remove("invisible", "underlayer");

    const inputId = document.createElement('input');
    inputId.setAttribute('type', 'number');
    inputId.setAttribute('name', 'boardId');
    inputId.setAttribute('placeholder', 'Enter board id');
    inputId.classList.add('input-board-id');

    const sendBtn = document.createElement('button');
    sendBtn.classList.add('send-btn');
    sendBtn.textContent = 'Join!';
    sendBtn.onclick = function() {
        const boardId = inputId.value;
        if (ws) { ws.close(); }
        ws = new WebSocket(`${ws_scheme}${window.location.host}/ws?id=${boardId}&first=${false}`);
        boardState.isRemote = true;

        ws.onmessage = function(event) {
            if (!connectionEstablished) {
                connectionEstablished = true;
                gameMenu.classList.add("invisible", "underlayer");
                menu.textContent = '';
                firstPlayer = false;
                return;
    
            }
            const newState = JSON.parse(event.data);
            for (let key of Object.keys(boardState)) {
                boardState[key] = newState[key];
            }
            repaintBoard(boardState);
        };
        
        board.classList.add('rotated');
    }
    menu.appendChild(inputId);
    menu.appendChild(sendBtn);
}

export const loginRegister = () => {
    menu.textContent = '';
    gameMenu.classList.remove("invisible", "underlayer");
    
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/login");
    const login = document.createElement("input");
    login.setAttribute("type", "text");
    login.setAttribute("name", "login");
    login.setAttribute("placeholder", "Login");

    const submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("value", "Submit");
    // submit.onclick = (e) => {
    //     e.preventDefault();
    // }
    
    form.appendChild(login);
    form.appendChild(submit);
    menu.appendChild(form);
}

const cancelNewGame = (shouldCloseConnection = false) => {
    gameMenu.classList.add("invisible", "underlayer");
    menu.textContent = '';
}