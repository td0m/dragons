package gather

import (
	"image/jpeg"
	"io/ioutil"
	"os"
	"syscall"

	"github.com/kbinani/screenshot"
)

var user32 = syscall.NewLazyDLL("user32.dll")

// Screenshot the screen
func Screenshot(fileName string) []byte {
	// set dpi aware to prevent cropping screenshots due to w10 scaling
	user32.NewProc("SetProcessDPIAware").Call()

	// take a screenshot
	bounds := screenshot.GetDisplayBounds(0)
	img, err := screenshot.CaptureRect(bounds)
	if err != nil {
		panic(err)
	}
	// save it
	file, _ := os.Create(fileName)
	defer file.Close()
	jpeg.Encode(file, img, &jpeg.Options{Quality: 80})

	// read it as bytes
	bytes, err := ioutil.ReadFile(fileName)
	if err != nil {
		panic(err)
	}

	go func() {
		os.Remove(fileName)
	}()

	return bytes
}
