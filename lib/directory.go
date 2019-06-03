package lib

import (
	"io/ioutil"
	"os"
)

func GetFileType(file os.FileInfo) string {
	if file.Name() == "\\" {
		return "ROOT"
	}
	if file.IsDir() {
		return "DIR"
	}
	return "FILE"
}

func GetDirectoryFiles(path string) ([]FileInfo, error) {
	rawFiles, err := ioutil.ReadDir(path)
	files := []FileInfo{}

	if err != nil {
		return []FileInfo{}, err
	}

	for _, f := range rawFiles {
		files = append(files, FileInfo{
			Name: f.Name(),
			Type: GetFileType(f),
		})
	}
	return files, nil
}

func GetDirectory(path string) (DirectoryInfo, error) {
	f, err := os.Stat(path)
	if err != nil {
		return DirectoryInfo{}, err
	}
	files, err := GetDirectoryFiles(path)
	if err != nil {
		return DirectoryInfo{}, err
	}
	return DirectoryInfo{
		Path:   path,
		Type:   GetFileType(f),
		Drives: []string{"C"},
		Files:  files,
	}, nil
}
