
Set-Location $PSScriptRoot

npm run build
Remove-Item -Force -Recurse -Path ../resume-executable/
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
node ./cleanNPMFile.js ../resume-executable/package.json
Set-Location ../resume-executable/
npm install --save-dev electron
npm install --save-dev electron-context-menu
npm install --save-dev electron-packager
npm install --save-dev electron-winstaller
npm run buildele
# electron-packager . resume-maloi --platform=win32 --arch=ia32 --overwrite --asar=true --icon=favicon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName="Resume Maloi"
# npm run deb64
npm run winBuild

Set-Location $PSScriptRoot
