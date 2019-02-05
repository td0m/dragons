package platform

import (
	"syscall"
	"unsafe"
)

var (
	procGetWindow           = user32.NewProc("GetForegroundWindow")
	procGetWindowText       = user32.NewProc("GetWindowTextW")
	procGetWindowTextLength = user32.NewProc("GetWindowTextLengthW")
)

func getWindowTextLength(hwnd HWND) int {
	ret, _, _ := procGetWindowTextLength.Call(uintptr(hwnd))
	return int(ret)
}

func getWindowText(hwnd HWND) string {
	textLen := getWindowTextLength(hwnd) + 1

	buf := make([]uint16, textLen)
	procGetWindowText.Call(
		uintptr(hwnd),
		uintptr(unsafe.Pointer(&buf[0])),
		uintptr(textLen))

	return syscall.UTF16ToString(buf)
}

func GetCurrentWindow() string {
	hwnd, _, _ := procGetWindow.Call()
	if hwnd == 0 {
		return ""
	}
	title := getWindowText(HWND(hwnd))
	return title
}
