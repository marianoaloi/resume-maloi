const electronInstaller = require('electron-winstaller');
(async() => {
  try {
    d=new Date()
    await electronInstaller.createWindowsInstaller({
      appDirectory: './dist_resume/resume-maloi-win32-x64',
      outputDirectory: 'dist_resume/installers/',
      authors: 'Mariano Aloi',
      version:`${d.getYear()+1900}.${d.getMonth()+1}.${d.getDate()}.${("0" + d.getHours()).slice(-2) }${ ("0" + d.getMinutes()).slice(-2)}${  ("0" + d.getSeconds()).slice(-2)}`,
      exe: 'resume-maloi.exe'
    });
    console.log('It worked!');
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }

  })();
