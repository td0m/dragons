package main

import (
	"flag"

	"github.com/kardianos/service"

	"github.com/d0minikt/dragons/target/src"
)

var (
	logger     service.Logger
	debug      bool
	addr       string
	publicAddr = "dragons-land.herokuapp.com"
)

func init() {
	flag.BoolVar(&debug, "debug", false, "Debug mode")
	flag.StringVar(&addr, "addr", publicAddr, "Address of the server.")
}

func main() {
	flag.Parse()

	if debug && addr == publicAddr {
		addr = "0.0.0.0"
	}

	serviceConfig := &service.Config{
		Name:        "ServiceName",
		DisplayName: "Service Name",
		Description: "Description",
	}

	program := &target.Program{
		Address: addr,
	}
	s, err := service.New(program, serviceConfig)
	if err != nil {
		panic(err)
	}
	logger, err = s.Logger(nil)
	if err != nil {
		panic(err)
	}
	err = s.Run()
	if err != nil {
		panic(err)
	}
}
