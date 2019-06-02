package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"reflect"

	"github.com/gorilla/websocket"
)

// RandomHex generates a random hex string
func RandomHex(n int) (string, error) {
	bytes := make([]byte, n)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

var upgrader = websocket.Upgrader{
	// allow cross-origin
	CheckOrigin: func(r *http.Request) bool { return true },
}

// Client struct
type Client struct {
	Socket *websocket.Conn
	Target string
}

// Target struct
type Target struct {
	Socket *websocket.Conn
	Client string
}

// StateAction action
type StateAction struct {
	Type    string `json:"type"`
	Payload State  `json:"payload"`
}

// State struct
type State struct {
	Targets []string `json:"targets"`
}

// Action struct
type Action struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
}

var clients = make(map[string]Client)
var targets = make(map[string]Target)

func notifyClients() {
	keys := reflect.ValueOf(targets).MapKeys()
	strkeys := make([]string, len(keys))
	for i := 0; i < len(keys); i++ {
		strkeys[i] = keys[i].String()
	}

	for _, value := range clients {
		value.Socket.WriteJSON(StateAction{
			Type: "UPDATE_STATE",
			Payload: State{
				Targets: strkeys,
			},
		})
	}
}

func handleWsConnection(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("Upgrade: ", err)
		return
	}
	log.Println("Server Running")
	defer ws.Close()

	// init connection
	var id string
	var isTarget bool

	for {
		// read message
		msgType, message, err := ws.ReadMessage()
		// handle user disconnect
		if err != nil {
			log.Println("Disconnected: ", err)
			if len(id) > 0 {
				if _, ok := targets[id]; ok && isTarget {
					clientID := targets[id].Client
					if len(clientID) > 0 {
						clients[clientID] = Client{
							Socket: clients[clientID].Socket,
						}
					}
					delete(targets, id)
					notifyClients()
				} else if _, ok := clients[id]; ok && !isTarget {
					targetID := targets[id].Client
					if len(targetID) > 0 {
						targets[targetID] = Target{
							Socket: targets[targetID].Socket,
						}
					}
					delete(clients, id)
				}
			}
			break
		}
		action := Action{}
		json.Unmarshal(message, &action)

		switch action.Type {
		case "CONNECT_TARGET":
			isTarget = true
			id, _ = RandomHex(5)
			targets[id] = Target{
				Socket: ws,
			}
			notifyClients()
			log.Printf("TARGET CONNECTED %v", targets)
		case "CONNECT_CLIENT":
			isTarget = false
			id, _ = RandomHex(10)
			clients[id] = Client{
				Socket: ws,
			}
			log.Println("CLIENT CONNECTED %v", clients)
		case "CONNECT_TO_TARGET":
			if target, ok := targets[action.Payload]; ok {
				if len(target.Client) > 0 {
					if c, ok := clients[target.Client]; ok {
						c.Socket.WriteJSON(Action{
							Type: "TARGET_DISCONNECTED",
						})
					}
				}

				clients[id] = Client{
					Socket: clients[id].Socket,
					Target: action.Payload,
				}
				targets[action.Payload] = Target{
					Socket: targets[action.Payload].Socket,
					Client: id,
				}

				target.Socket.WriteJSON(Action{
					Type:    "CONNECT_TO_TARGET",
					Payload: "",
				})
			}
		default:
			log.Println(action.Payload)
			if isTarget {
				clientID := targets[id].Client
				if client, ok := clients[clientID]; ok {
					client.Socket.WriteMessage(msgType, message)
				}
			} else {
				targetID := clients[id].Target
				if target, ok := targets[targetID]; ok {
					target.Socket.WriteMessage(msgType, message)
				}
			}
		}
	}
}

func main() {
	port := "80"
	addr := ("0.0.0.0:" + port)

	http.HandleFunc("/ws", handleWsConnection)

	log.Fatal(http.ListenAndServe(addr, nil))
}
