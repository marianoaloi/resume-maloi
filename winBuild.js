const electronInstaller = require('electron-winstaller');
(async() => {
  try {
    d=new Date()
    await electronInstaller.createWindowsInstaller({
      appDirectory: './dist_resume/resume-maloi-win32-x64',
      outputDirectory: 'dist_resume/installers/',
      authors: 'Mariano Aloi',
      version:`${d.getYear()+1900}.${d.getMonth()+1}.${("00000" + ((d.getDate()*d.getHours()*d.getMinutes()*d.getSeconds())/65534)).slice(-5) }` ,
      exe: 'resume-maloi.exe'
    });
    console.log('It worked!');
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }

  })();
