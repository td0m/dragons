package gather

import (
	"strings"

	ps "github.com/bhendo/go-powershell"
)

// GetCPU gets the name of the cpu
func GetCPU(shell ps.Shell) string {
	stdout, _, _ := shell.Execute("gwmi -Class Win32_Processor | Select Name | ft -HideTableHeaders")
	cpu := strings.Split(strings.TrimSpace(stdout), " ")
	cpuName := ""
	for _, word := range cpu {
		if !(word == "Intel(R)" || word == "CPU" || word == "Core(TM)") {
			cpuName += word + " "
		}
	}
	return cpuName
}
