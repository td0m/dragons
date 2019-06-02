package lib

type Action struct {
	Type string `json:"type"`
}

type DataAction struct {
	Type    string `json:"type"`
	Payload Data   `json:"payload"`
}
type Data struct {
	Targets []string `json:"targets"`
}

type ConnectTargetAction struct {
	Type    string        `json:"type"`
	Payload TargetDetails `json:"payload"`
}

type StringAction struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
}

type SendAction struct {
	Type    string            `json:"type"`
	Payload map[string]string `json:"payload"`
	To      string            `json:"to"`
}
type SentFromClientAction struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
	From    string `json:"from"`
}

type QueryAction struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
	To      string      `json:"to"`
	From    string      `json:"from"`
}

type TargetConnectedAction struct {
	Type    string        `json:"type"`
	Payload TargetDetails `json:"payload"`
	Key     string        `json:"key"`
}
