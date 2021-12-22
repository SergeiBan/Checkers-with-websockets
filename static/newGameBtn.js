import { defaultBoardState, boardState } from "./index.js";
import { repaintBoard } from "./repaintBoard.js";
import { deepCopyFunction } from "./deepCopy.js";

export let ws = false;
export const firstPlayer = true;

export const startNewGame = () => {
    const gameMenu = document.getElementsByClassName('game-menu')[0];
    gameMenu.classList.remove("invisible", "underlayer");
    const menu = document.getElementsByClassName('menu')[0];
    const newGameBtn = document.createElement("button");
    newGameBtn.classList.add('newGameBtn');
    newGameBtn.textContent = 'New Game';
    newGameBtn.onclick = function() {
        for (let key of Object.keys(defaultBoardState)) {
            boardState[key] = deepCopyFunction(defaultBoardState[key]);
        }

        repaintBoard(boardState);
        if (ws) { ws.close(); }
        gameMenu.classList.add("invisible", "underlayer");
        menu.textContent = '';
    }
    menu.appendChild(newGameBtn);
    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add('cancelBtn');
    cancelBtn.onclick = function() {
        gameMenu.classList.add("invisible", "underlayer");
        menu.textContent = '';
    }
    menu.appendChild(cancelBtn);
}

export const inviteSecondPlayer = () => {
    const gameMenu = document.getElementsByClassName('game-menu')[0];

    gameMenu.classList.remove("invisible", "underlayer");
    const menu = document.getElementsByClassName('menu')[0];
    const getRandomId = max => {
        return Math.floor(Math.random() * max);
    }
    let client_id = getRandomId(10000);
    client_id = 1;
    const invitation = document.createElement('div');
    invitation.classList.add('invitation');
    invitation.textContent = "Tell this number to the other player";
    menu.appendChild(invitation);

    const wsId = document.createElement('div');
    wsId.classList.add('ws-id');
    wsId.textContent = client_id;
    menu.appendChild(wsId);

    if (ws) { ws.close; }
    ws = new WebSocket(`ws://localhost:8000/ws/${client_id}/${true}`);
    
    ws.onmessage = function(event) {
        const newState = JSON.parse(event.data);
        for (let key of Object.keys(boardState)) {
            boardState[key] = newState[key]
        }
        repaintBoard(boardState); 
    
    };
    boardState.isRemote = true;
}

export const join = () => {
    const gameMenu = document.getElementsByClassName('game-menu')[0];
    gameMenu.classList.remove("invisible", "underlayer");

    const menu = document.getElementsByClassName('menu')[0];

    const inputId = document.createElement('input');
    inputId.setAttribute('type', 'number');
    inputId.setAttribute('name', 'boardId');
    inputId.setAttribute('placeholder', 'Enter board id here');
    inputId.classList.add('input-board-id');

    const sendBtn = document.createElement('button');
    sendBtn.classList.add('send-btn');
    sendBtn.onclick = function() {
        const boardId = inputId.value;
        if (ws) { ws.close(); }
        ws = new WebSocket(`ws://localhost:8000/ws/${boardId}/${true}`);
        boardState.isRemote = true;

        ws.onmessage = function(event) {
            const newState = JSON.parse(event.data);
            for (let key of Object.keys(boardState)) {
                boardState[key] = newState[key]
            }
            repaintBoard(boardState); 
        };
        const board = document.getElementsByClassName('board')[0];
        board.classList.add('rotated');
    }

    menu.appendChild(inputId);
    menu.appendChild(sendBtn);

}