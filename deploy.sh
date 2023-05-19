## ./bash

sed -i 's/\(^[^\/]*Remote\)/\/\/\1/g'  ./node_modules/ngx-electron/lib/electron.service.d.ts
npm run build
rm -r ../resume-executable/
mkdir ../resume-executable/
sleep 3
cp dist/resume-maloi/* ../resume-executable/
cp *.js  ../resume-executable/
cp package.json  ../resume-executable/
sed -i 's/\/dist\/resume-maloi/./g' ../resume-executable/app.js
sed -i 's/.*openDevTools.*/\/\//g' ../resume-executable/app.js
python3 ../cleanNPMFile.py ../resume-executable/package.json
cd ../resume-executable/
npm install --save-dev electron
npm install --save-dev electron-context-menu
npm install --save-dev electron-packager
npm install --save-dev electron-installer-debian
npm run buildele
npm run deb64