package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	cmap "github.com/orcaman/concurrent-map"
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

var clients = cmap.New()
var targets = cmap.New()

func notifyClients() {
	for _, key := range clients.Keys() {
		raw, ok := clients.Get(key)
		if ok {
			client := raw.(Client)
			if client.Socket != nil {
				client.Socket.WriteJSON(StateAction{
					Type: "UPDATE_STATE",
					Payload: State{
						Targets: targets.Keys(),
					},
				})
			}
		}
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
				if target, ok := targets.Get(id); ok && isTarget {
					clientID := (target.(Target)).Client
					if len(clientID) > 0 {
						c, _ := clients.Get(clientID)
						clients.Set(clientID, Client{
							Socket: c.(Client).Socket,
						})
					}
					targets.Remove(id)
					notifyClients()
				} else if client, ok := clients.Get(id); ok && !isTarget {
					targetID := client.(Client).Target
					if len(targetID) > 0 {
						t, _ := targets.Get(targetID)
						targets.Set(targetID, Target{
							Socket: t.(Target).Socket,
						})
					}
					clients.Remove(id)
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
			targets.Set(id, Target{
				Socket: ws,
			})
			notifyClients()
			log.Printf("TARGET CONNECTED %v", len(targets.Keys()))

		case "CONNECT_CLIENT":
			isTarget = false
			id, _ = RandomHex(10)
			clients.Set(id, Client{
				Socket: ws,
			})
			log.Println("CLIENT CONNECTED ", len(clients.Keys()))
		case "CONNECT_TO_TARGET":
			if targetRaw, ok := targets.Get(action.Payload); ok {
				target := targetRaw.(Target)
				if len(target.Client) > 0 {
					if clientRaw, ok := clients.Get(target.Client); ok {
						client := clientRaw.(Client)
						client.Socket.WriteJSON(Action{
							Type: "TARGET_DISCONNECTED",
						})
					}
				}

				c, _ := clients.Get(id)
				clients.Set(id, Client{
					Socket: c.(Client).Socket,
					Target: action.Payload,
				})
				t, _ := targets.Get(action.Payload)
				targets.Set(action.Payload, Target{
					Socket: t.(Target).Socket,
					Client: id,
				})

				target.Socket.WriteJSON(Action{
					Type: "CONNECT_TO_TARGET",
				})
				ws.WriteJSON(Action{
					Type: "TARGET_CONNECTED",
					Payload: action.Payload
				})
			}
		default:
			if isTarget {
				t, _ := targets.Get(id)
				clientID := t.(Target).Client
				if client, ok := clients.Get(clientID); ok {
					client.(Client).Socket.WriteMessage(msgType, message)
				}
			} else {
				c, _ := clients.Get(id)
				targetID := c.(Client).Target
				if target, ok := targets.Get(targetID); ok {
					target.(Target).Socket.WriteMessage(msgType, message)
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
