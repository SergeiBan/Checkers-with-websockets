export const pickMan = boardState => {
    console.log(boardState.buttonPosition);
    boardState.pickedButton = boardState.buttonPosition;
    boardState.isPicked = true;
}