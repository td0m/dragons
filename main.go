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
	"strings"

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
	Socket     *websocket.Conn
	Client     string
	DeviceInfo DeviceInfo
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

// LoginDetails used to Connect to target
type LoginDetails struct {
	ID       string `json:"id"`
	Password string `json:"password"`
}

// ConnectToTargetAction used as CONNECT_TO_TARGET
type ConnectToTargetAction struct {
	Type    string       `json:"type"`
	Payload LoginDetails `json:"payload"`
}

// ConnectTarget used as CONNECT_TARGET
type ConnectTargetAction struct {
	Type    string     `json:"type"`
	Payload DeviceInfo `json:"payload"`
}

type DeviceInfo struct {
	Password string   `json:"password"`
	Name     string   `json:"name"`
	LocalIP  string   `json:"localIp"`
	IP       string   `json:"ip"`
	Features []string `json:"features"`
}

var clients = cmap.New()
var targets = cmap.New()

func CreateIdentifier(name string) string {
	if _, ok := targets.Get(name); !ok {
		return name
	}
	id := name
	if _, ok := targets.Get(name); ok {
		hex, _ := RandomHex(4)
		id = name + " #" + hex
	}
	return id
}

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
							Socket:     t.(Target).Socket,
							DeviceInfo: t.(Target).DeviceInfo,
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
			connectTargetAction := ConnectTargetAction{}
			json.Unmarshal(message, &connectTargetAction)
			isTarget = true
			id = CreateIdentifier(connectTargetAction.Payload.Name)
			info := connectTargetAction.Payload
			targets.Set(id, Target{
				Socket: ws,
				DeviceInfo: DeviceInfo{
					Password: info.Password,
					Name:     id,
					LocalIP:  info.LocalIP,
					IP:       r.RemoteAddr[0:strings.LastIndex(r.RemoteAddr, ":")],
					Features: info.Features,
				},
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
				passwordsMatch := loginAction.Payload.Password == target.DeviceInfo.Password
				if !passwordsMatch {
					ws.WriteJSON(Action{
						Type: "TARGET_DISCONNECTED",
					})
				} else {
					// override currently connected client
					if len(target.Client) > 0 {
						if client, ok := clients.Get(target.Client); ok {
							client.(Client).Socket.WriteJSON(Action{
								Type: "TARGET_DISCONNECTED",
							})
						}
					}

					c, _ := clients.Get(id)
					clients.Set(id, Client{
						Socket: c.(Client).Socket,
						Target: loginAction.Payload.ID,
					})
					t, _ := targets.Get(loginAction.Payload.ID)
					targets.Set(loginAction.Payload.ID, Target{
						Socket:     t.(Target).Socket,
						DeviceInfo: t.(Target).DeviceInfo,
						Client:     id,
					})

					target.Socket.WriteJSON(Action{
						Type: "CONNECT_TO_TARGET",
					})
					ws.WriteJSON(ConnectTargetAction{
						Type:    "TARGET_CONNECTED",
						Payload: target.DeviceInfo,
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
