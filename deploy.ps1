
Set-Location $PSScriptRoot

npm install
(Get-Content node_modules/ngx-electron/lib/electron.service.d.ts).replace('readonly remote: Electron.Remote;','') | Set-Content node_modules/ngx-electron/lib/electron.service.d.ts
npm run build
Remove-Item -Force -Recurse -Path ../resume-executable/ -ErrorAction SilentlyContinue
mkdir ../resume-executable/
Start-Sleep 3
Copy-Item dist/resume-maloi/* ../resume-executable/
Copy-Item *.js  ../resume-executable/
Copy-Item package.json  ../resume-executable/
# sed -i 's/\/dist\/resume-maloi/./g' ../resume-executable/app.js
# sed -i 's/.*openDevTools.*/\/\//g' ../resume-executable/app.js
(Get-Content ../resume-executable/app.js).replace('/dist/resume-maloi','.') | Set-Content ../resume-executable/app.js
(Get-Content ../resume-executable/app.js).replace('mainWindow.webContents.openDevTools()','') | Set-Content ../resume-executable/app.js
(Get-Content ../resume-executable/package.json).replace('\"linux\"','\"win32\"') | Set-Content ../resume-executable/package.json
# Read the current package.json to preserve existing version structure
$packageContent = Get-Content ../resume-executable/package.json -Raw | ConvertFrom-Json
# Keep the existing version from package.json (should be SemVer compatible like "0.0.1.24")
# For Windows version strings, we can use 4-part version, but for npm it should be 3-part
$npmVersion = $packageContent.version
if ($npmVersion -match '(\d+)\.(\d+)\.(\d+)') {
    $semverVersion = "$($matches[1]).$($matches[2]).$($matches[3])"
} else {
    $semverVersion = "1.0.0"
}
# Update buildele script with version info - use 4-part version for Windows strings
$win32Version = $packageContent.version
$packageContent.scripts.buildele = "electron-packager . resume-maloi --platform=win32 --arch=x64 --out dist_resume/ --overwrite --asar --icon='favicon.ico' --prune=true --app-version='$semverVersion' --build-version='$win32Version' --version-string.CompanyName='CE' --version-string.FileDescription='Resume Maloi Application' --version-string.ProductName='Resume Maloi' --version-string.ProductVersion='$win32Version' --version-string.FileVersion='$win32Version'"
$packageContent | ConvertTo-Json -Depth 10 | Set-Content ../resume-executable/package.json
node ./cleanNPMFile.js ../resume-executable/package.json
Set-Location ../resume-executable/
npm install --save-dev electron
npm install  electron-context-menu
npm install --save-dev electron-packager
npm install --save-dev electron-winstaller
# (Get-Content node_modules/ngx-electron/lib/electron.service.d.ts).replace('readonly remote: Electron.Remote;','') | Set-Content node_modules/ngx-electron/lib/electron.service.d.ts
npm run buildele
# electron-packager . resume-maloi --platform=win32 --arch=ia32 --overwrite --asar=true --icon=favicon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName="Resume Maloi"
# npm run deb64
npm run winBuild


Start-Sleep 3
Copy-Item ../resume-executable/dist/resume-maloi/* ../resume_maloi/dist/resume_maloi/

Set-Location $PSScriptRoot
