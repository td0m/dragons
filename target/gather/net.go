package gather

import (
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"strings"

	"github.com/d0minikt/dragons/lib"
)

func GetIPs() (private string, public string) {
	// get the private ip
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()
	priv := strings.Split(conn.LocalAddr().String(), ":")[0]

	// get public ip
	url := "https://api.ipify.org?format=text"
	resp, err := http.Get(url)
	if err != nil {
		// get request failed, fallback to returning a blank string
		return priv, ""
	}
	defer resp.Body.Close()
	publ, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	return priv, string(publ)
}

func GetTargetNetDetails() (lib.TargetNetDetails, error) {
	hostName, err := os.Hostname()
	if err != nil {
		return lib.TargetNetDetails{}, err
	}
	private, public := GetIPs()

	return lib.TargetNetDetails{
		Hostname:  hostName,
		PrivateIP: private,
		PublicIP:  public,
	}, nil
}
