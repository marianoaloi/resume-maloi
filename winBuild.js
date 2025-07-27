const electronInstaller = require('electron-winstaller');
const fs = require('fs');
const path = require('path');

(async() => {
  try {
    // Read version from package.json for SemVer compatibility
    let version = '1.0.0'; // Default version
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.version) {
        // Extract just the first 3 parts for SemVer (MAJOR.MINOR.PATCH)
        const versionParts = packageJson.version.split('.');
        version = `${versionParts[0] || '1'}.${versionParts[1] || '0'}.${versionParts[2] || '0'}`;
      }
    }
    
    await electronInstaller.createWindowsInstaller({
      appDirectory: './dist_resume/resume-maloi-win32-x64',
      outputDirectory: 'dist_resume/installers/',
      authors: 'Mariano Aloi',
      version: version,
      exe: 'resume-maloi.exe',
      setupExe: `resume-maloi-setup-${version}.exe`,
      noMsi: true // Disable MSI generation to avoid version binding issues
    });
    console.log(`It worked! Version: ${version}`);
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }

  })();
