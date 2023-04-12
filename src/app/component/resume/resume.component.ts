import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.less']
})
export class ResumeComponent {
  save() {

    if (this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('save', this.profileForm.value);

      this._electronService.ipcRenderer.once('fileTosave', (event, sum) => {
        console.log(sum)
      })
    } else {
      console.log("no Electron")
    }
  }
  open() {
    // if (this._electronService.isElectronApp) {
    //   this._electronService.ipcRenderer.send('open', new Date().toISOString());

    //   this._electronService.ipcRenderer.once('fileToOpen', (event, resumeObject) => {
    //     console.log(resumeObject)
    //   })
    // } else {
    //   console.log("no Electron")
    // }
    this.transformJsonForm(this.mockJson(), Object.entries(this.profileForm.controls))
  }
  transformJsonForm(json: any, formObj: any[] | any) {
    if (formObj instanceof Array)
      formObj.forEach(
        obj => {
          let key = obj[0]
          if (obj[1] instanceof FormControl) {
            console.log(obj, json[key])
            obj[1].setValue(json[key])
          } else if (obj[1] instanceof FormArray) {

            const methodKey = 'add' + key
            let valueArray = json[key]
            for (let index = 0; index < valueArray.length; index++) {
              switch (methodKey) {
                case 'addskills': this.addskills(); break;
                case 'addsocialmedias': this.addsocialmedias(); break;
                case 'addhistoricals': this.addhistoricals(); break;
                case 'addeducations': this.addeducations(); break;
                case 'addcertificates': this.addcertificates(); break;

                default:
                  break;
              }
              // Object.
              const elementForm = obj[1].controls[index];
              const elementJson = valueArray[index];
              this.transformJsonForm(elementJson, Object.entries((<FormGroup>elementForm).controls))

            }
          }
        }
      )
  }
  mockJson(): object {
    return {
      "name": "Mariano Aloi",
      "telephone": "+55 (21) 98222-4739",
      "presentation": "Ola eu sou o Malkoi",
      "socialmedias": [
        {
          "name": "Linkedin",
          "url": "https://www.linkedin.com/in/maloi/"
        },
        {
          "name": "Github",
          "url": "https://github.com/marianoaloi"
        }
      ],
      "historicals": [
        {
          "company": "Vale S.A.",
          "start": "2014-02-10",
          "end": "2023-03-16",
          "tecnical": "",
          "manager": "",
          "tecnical_short": "",
          "manager_short": ""
        }
      ],
      "educations": [
        {
          "school": "Estácio de Sá",
          "degree": "Bachelor of Laws",
          "start": "2015-02-01",
          "end": "2020-01-01"
        }
      ],
      "certificates": [
        {
          "name": "Project Management Professional (PMP®)",
          "institute": "Project Management Institute (PMI)",
          "credential": "PMP® #1532364",
          "issued": "08/2012"
        }
      ],
      "skills": [

        { "name": "Java", "value": 100 },
        { "name": "Python", "value": 100 },
        { "name": "NodeJS", "value": 100 },
        { "name": "Kubernates", "value": 100 },
        { "name": "Docker", "value": 100 },
        { "name": "Unix", "value": 100 },
        { "name": "Project Manager", "value": 100 },
        { "name": "Scrum", "value": 100 },
        { "name": "DevOps", "value": 100 },
        { "name": "Tensorflow", "value": 30 },
        { "name": "(Py)Torch", "value": 30 },
        { "name": "Azure", "value": 70 },
        { "name": "GCP", "value": 70 }

      ]
    };
  }
  profileForm = this.fb.group({
    name: ['', Validators.required],
    telephone: ['', Validators.required],
    presentation: ['', Validators.required],
    socialmedias: this.fb.array([]),
    skills: this.fb.array([]),
    historicals: this.fb.array([]),
    educations: this.fb.array([]),
    certificates: this.fb.array([]),

  });

  constructor(private fb: FormBuilder, private _electronService: ElectronService) {

  }

  formatLabel(value: number): string {

    return `${value}`;
  }

  /* Skill */
  get skills(): FormArray {
    return this.profileForm.get('skills') as FormArray
  }
  addskills() {
    const skillComponent = this.fb.group({
      name: ["", Validators.required],
      value: ["", Validators.required],
    })
    this.skills.push(skillComponent);
  }
  deleteskill(index: number) {
    this.skills.removeAt(index)
  }
  resetskills() {
    this.skills.reset()
  }
  clearskills() {
    this.skills.clear()
  }

  /* socialmedia */
  get socialmedias(): FormArray {
    return this.profileForm.get('socialmedias') as FormArray
  }
  addsocialmedias() {
    const socialmediaComponent = this.fb.group({
      name: [""],
      url: [""],
    })
    this.socialmedias.push(socialmediaComponent);
  }
  deletesocialmedia(index: number) {
    this.socialmedias.removeAt(index)
  }
  resetsocialmedias() {
    this.socialmedias.reset()
  }
  clearsocialmedias() {
    this.socialmedias.clear()
  }

  /* historical */
  get historicals(): FormArray {
    return this.profileForm.get('historicals') as FormArray
  }
  addhistoricals() {
    const historicalComponent = this.fb.group({
      company: [""],
      start: [""],
      end: [""],
      tecnical: [""],
      manager: [""],
      tecnical_short: [""],
      manager_short: [""],
    })
    this.historicals.push(historicalComponent);
  }
  deletehistorical(index: number) {
    this.historicals.removeAt(index)
  }
  resethistoricals() {
    this.historicals.reset()
  }
  clearhistoricals() {
    this.historicals.clear()
  }

  /* education */
  get educations(): FormArray {
    return this.profileForm.get('educations') as FormArray
  }
  addeducations() {
    const educationComponent = this.fb.group({
      school: [""],
      degree: [""],
      start: [""],
      end: [""],
    })
    this.educations.push(educationComponent);
  }
  deleteeducation(index: number) {
    this.educations.removeAt(index)
  }
  reseteducations() {
    this.educations.reset()
  }
  cleareducations() {
    this.educations.clear()
  }

  /* certificate */
  get certificates(): FormArray {
    return this.profileForm.get('certificates') as FormArray
  }
  addcertificates() {
    const certificateComponent = this.fb.group({
      name: [""],
      institute: [""],
      credential: [""],
      issued: [""],
    })
    this.certificates.push(certificateComponent);
  }
  deletecertificate(index: number) {
    this.certificates.removeAt(index)
  }
  resetcertificates() {
    this.certificates.reset()
  }
  clearcertificates() {
    this.socialmedias.clear()
  }

  onFormSubmit() {
    console.log(JSON.stringify(this.profileForm.value))
    this.save()
  }
}
