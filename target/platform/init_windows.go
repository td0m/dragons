package platform

import (
	"syscall"
)

var (
	user32 = syscall.NewLazyDLL("user32.dll")
)

type (
	DWORD     uint32
	WPARAM    uintptr
	LPARAM    uintptr
	LRESULT   uintptr
	HANDLE    uintptr
	HINSTANCE HANDLE
	HHOOK     HANDLE
	HWND      HANDLE
)
