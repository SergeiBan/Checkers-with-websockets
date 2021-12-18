import { flowControl } from "./flowControl.js";
import { repaintBoard } from "./repaintBoard.js";

const board = [
    ['V', 'B', 'V', 'B', 'V', 'B', 'V', 'B', 'V', 'B'],
    ['B', 'V', 'B', 'V', 'B', 'V', 'B', 'V', 'B', 'V'],
    ['V', 'B', 'V', 'B', 'V', 'B', 'V', 'B', 'V', 'B'],
    ['B', 'V', 'B', 'V', 'B', 'V', 'B', 'V', 'B', 'V'],
    ['V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V'],
    ['V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V'],
    ['V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W'],
    ['W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V'],
    ['V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W'],
    ['W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V']
];

const defaultBoard = [
    ['V', 'B', 'V', 'B', 'V', 'B', 'V', 'B', 'V', 'B'],
    ['B', 'V', 'B', 'V', 'B', 'V', 'B', 'V', 'B', 'V'],
    ['V', 'B', 'V', 'B', 'V', 'B', 'V', 'B', 'V', 'B'],
    ['B', 'V', 'B', 'V', 'B', 'V', 'B', 'V', 'B', 'V'],
    ['V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V'],
    ['V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V'],
    ['V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W'],
    ['W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V'],
    ['V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W'],
    ['W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V']
];

const boardElement = document.createElement("div");
boardElement.classList.add("board");
document.body.appendChild(boardElement);

export const boardState = {
    color: 'W',
    mustAttack: false,
    isPicked: false,
    boardNow: board,
    pickedButton: 0,
    buttonPosition: 0,
    attackScenarios: [],
    isRemote: true,
    moveNumber: 0
}

const defaultBoardState = {
    color: 'W',
    mustAttack: false,
    isPicked: false,
    boardNow: board,
    pickedButton: 0,
    buttonPosition: 0,
    attackScenarios: [],
    isRemote: false,
    moveNumber: 0
}

for (let row = 0; row < board.length; row++) {
    for (let man = 0; man < board.length; man++) {
        let btn = document.createElement("button");
        btn.classList.add(board[row][man]);
        btn.setAttribute('data-y', row);
        btn.setAttribute('data-x', man);
        btn.onclick = function() {
            boardState.buttonPosition = btn;
            flowControl(boardState, btn);
        }
        boardElement.appendChild(btn);
    }
}
const gameMenu = document.getElementsByClassName('game-menu')[0];

document.getElementById('sameDeviceBtn').onclick = function() {
    for (let key of Object.keys(defaultBoardState)) {
        boardState[key] = defaultBoardState[key]
    }
    repaintBoard(defaultBoardState);
    gameMenu.classList.add("invisible", "underlayer");
}

document.getElementById('differentDevicesBtn').onclick = function() {
    boardState.isRemote = true;
}

document.getElementsByClassName('toggle-game-menu')[0].onclick = function() {
    gameMenu.classList.remove("invisible", "underlayer");
}