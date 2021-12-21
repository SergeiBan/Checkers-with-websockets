from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.requests import Request
from typing import List, Dict

app = FastAPI()


app.mount("/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="templates")


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict() = {}
    
    async def connect(self, websocket: WebSocket, client_id: int):
        await websocket.accept()
        print("websocket accepted", client_id)
        
        if self.active_connections.get(client_id, 'nope') == 'nope':
            self.active_connections[client_id] = []
        self.active_connections[client_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, client_id: int):
        print("websocket id is", client_id)
        self.active_connections[client_id].remove(websocket)
    
    async def send_message(self, message: str, client_id: int):
        for connection in self.active_connections[client_id]:
            await connection.send_text(message)
    
manager = ConnectionManager()


@app.get("/game", response_class=HTMLResponse)
async def get_game(request: Request):
    return templates.TemplateResponse("board.html", {"request": request})

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_message(f'{data}', client_id)
    except WebSocketDisconnect:
        print("websocket closed", client_id)
        manager.disconnect(websocket, client_id)
        await manager.send_message(f'Player {client_id} has left', client_id)