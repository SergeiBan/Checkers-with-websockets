export const pickMan = boardState => {
    boardState.pickedButton = boardState.buttonPosition;
    boardState.isPicked = true;
    console.log(boardState.pickedButton);
}