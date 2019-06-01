$target = ".\target\main.go"
$outputDir = ".\releases"

$clientConfig = (Get-Content '.\client\package.json' | Out-String | ConvertFrom-Json)

$version = $clientConfig.version
$name = $clientConfig.name

# Build Target
Write-Host "Building Target"
Invoke-Expression "go build -o $outputDir\$version\$name-$version.exe $target"