package main

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func queryParse(r *http.Request) (int, string) {
	params := r.URL.Query()
	if len(params) == 0 {
		return 0, "no query"
	}
	boardId, err := strconv.Atoi(params["id"][0])
	if err != nil {
		return 0, "NaN"
	}

	isFirst := params["first"][0]
	return boardId, isFirst
}

var room = make(map[int][]*websocket.Conn)

func broadcast(conns []*websocket.Conn, msgType int, msg []byte) {
	for _, conn := range conns {
		if err := conn.WriteMessage(msgType, msg); err != nil {
			return
		}
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	boardId, isFirst := queryParse(r)
	if isFirst == "NaN" {
		return
	}

	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Upgrading error")
	}
	if _, ok := room[boardId]; ok && len(room[boardId]) == 1 && isFirst == "false" {
		room[boardId] = append(room[boardId], conn)
		broadcast(room[boardId], 1, []byte("hello"))
	} else if !ok && isFirst == "true" {
		room[boardId] = append(room[boardId], conn)
	}

	for {
		// Read message from browser
		msgType, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Reading error", err)
			return
		}

		// fmt.Printf("%s sent: %s\n", conn.RemoteAddr(), string(msg))

		broadcast(room[boardId], msgType, msg)
	}
}

func main() {
	http.HandleFunc("/ws", wsHandler)

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.ListenAndServe(":"+port, nil)
}
