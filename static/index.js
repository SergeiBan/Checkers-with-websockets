import { flowControl } from "./flowControl.js";
import { startNewGame, inviteSecondPlayer, join, loginRegister } from "./newGameBtn.js";

export const board = [
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

export const defaultBoard = [
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
const boardElement = document.getElementById("board");

export const boardState = {
    color: 'W',
    mustAttack: false,
    isPicked: false,
    boardNow: board,
    pickedButton: 0,
    buttonPosition: 0,
    attackScenarios: [],
    isRemote: false,
    moveNumber: 0,
}

export const defaultBoardState = {
    color: 'W',
    mustAttack: false,
    isPicked: false,
    boardNow: defaultBoard,
    pickedButton: 0,
    buttonPosition: 0,
    attackScenarios: [],
    isRemote: false,
    moveNumber: 0
}


let men = document.querySelectorAll('[data-x]');
for (let i = 0; i < board.length*board.length; i++) {
        const man = men[i];
        man.onclick = function() {
            boardState.buttonPosition = man;
            flowControl(boardState);
        }
}
const gameMenu = document.getElementsByClassName('game-menu')[0];

document.getElementById('sameDeviceBtn').onclick = startNewGame;

document.getElementById('firstDevicesBtn').onclick = inviteSecondPlayer;

document.getElementById('secondDeviceBtn').onclick = join;

document.getElementById('loginRegisterBtn').onclick = loginRegister;