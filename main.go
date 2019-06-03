package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"

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
	Socket   *websocket.Conn
	Client   string
	Password string
}

// StateAction action
type StateAction struct {
	Type    string `json:"type"`
	Payload State  `json:"payload"`
}

// State struct
type State struct {
	Targets []string `json:"targets"`
	Clients []string `json:"clients"`
}

// Action struct
type Action struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
}

type LoginDetails struct {
	ID       string `json:"id"`
	Password string `json:"password"`
}
type ConnectToTargetAction struct {
	Type    string       `json:"type"`
	Payload LoginDetails `json:"payload"`
}

var clients = cmap.New()
var targets = cmap.New()

func printCount() {
	c := len(clients.Keys())
	t := len(targets.Keys())
	log.Println("CLIENTS: ", c, "TARGETS: ", t)
}

func notifyClient(ws websocket.Conn) {
	ws.WriteJSON(StateAction{
		Type: "UPDATE_STATE",
		Payload: State{
			Targets: targets.Keys(),
			Clients: clients.Keys(),
		},
	})
}

func notifyClients() {
	for _, key := range clients.Keys() {
		raw, ok := clients.Get(key)
		if ok {
			client := raw.(Client)
			if client.Socket != nil {
				notifyClient(*client.Socket)
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
	defer ws.Close()

	// init connection
	var id string
	var isTarget bool

	for {
		// read message
		msgType, message, err := ws.ReadMessage()
		// handle user disconnect
		if err != nil {
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
				} else if client, ok := clients.Get(id); ok && !isTarget {
					targetID := client.(Client).Target
					if len(targetID) > 0 {
						t, _ := targets.Get(targetID)
						targets.Set(targetID, Target{
							Socket:   t.(Target).Socket,
							Password: t.(Target).Password,
						})
					}
					clients.Remove(id)
				}
				notifyClients()
				printCount()
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
				Socket:   ws,
				Password: action.Payload,
			})
			notifyClients()
			printCount()

		case "CONNECT_CLIENT":
			isTarget = false
			id, _ = RandomHex(10)
			clients.Set(id, Client{
				Socket: ws,
			})
			notifyClients()
			printCount()
		case "CONNECT_TO_TARGET":
			loginAction := ConnectToTargetAction{}
			json.Unmarshal(message, &loginAction)

			if targetRaw, ok := targets.Get(loginAction.Payload.ID); ok {
				target := targetRaw.(Target)
				passwordsMatch := loginAction.Payload.Password == target.Password
				if len(target.Client) > 0 || !passwordsMatch {
					ws.WriteJSON(Action{
						Type: "TARGET_DISCONNECTED",
					})
				} else {
					c, _ := clients.Get(id)
					clients.Set(id, Client{
						Socket: c.(Client).Socket,
						Target: loginAction.Payload.ID,
					})
					t, _ := targets.Get(loginAction.Payload.ID)
					targets.Set(loginAction.Payload.ID, Target{
						Socket:   t.(Target).Socket,
						Password: t.(Target).Password,
						Client:   id,
					})

					target.Socket.WriteJSON(Action{
						Type: "CONNECT_TO_TARGET",
					})
					ws.WriteJSON(Action{
						Type:    "TARGET_CONNECTED",
						Payload: action.Payload,
					})
				}
			}
		default:
			log.Println(action.Type)
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
	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "80"
	}
	addr := ("0.0.0.0:" + port)

	http.HandleFunc("/v1", handleWsConnection)

	files, _ := ioutil.ReadDir("./client")
	log.Println(files)

	wd, _ := os.Getwd()
	dir := path.Join(wd, "/client/build/")
	fs := http.FileServer(http.Dir(dir))
	http.Handle("/", fs)

	log.Fatal(http.ListenAndServe(addr, nil))
}
