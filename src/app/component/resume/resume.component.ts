import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment-timezone';
import { ElectronService } from 'ngx-electron';
import * as moment from 'moment-timezone';
import { MatSnackBar } from '@angular/material/snack-bar';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
// import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';


// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.less'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ResumeComponent {
  @ViewChild("autosave") autosave: any;

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, dateField: AbstractControl<any, any> | null) {
    if (!dateField)
      return;
    let ctrlValue = dateField.value!;
    if (!ctrlValue)
      ctrlValue = moment()
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    dateField.setValue(ctrlValue);
    datepicker.close();
  }

  itemChange() {
    console.log("teste");
    
    this.save()
  }
  save() {

    if (this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('save', this.profileForm.value, this.autosave.nativeElement.checked);

      this._electronService.ipcRenderer.once('fileTosave', (event, message) => {
        console.log(message)

        this.openSnackBar(message, 'saveSnack')
      })
    } else {
      console.log("no Electron")

      this.openSnackBar("no Electron", 'saveSnack')
    }
  }
  open() {
    this.clearskills()
    this.clearsocialmedias()
    this.clearhistoricals()
    this.cleareducations()
    this.clearcertificates()
    if (this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('open', new Date().toISOString());

      this._electronService.ipcRenderer.once('fileToOpen', (event, resumeObject) => {
        // console.log(resumeObject)

        this.transformJsonForm(resumeObject, Object.entries(this.profileForm.controls))
      })
    } else {
      console.log("no Electron")
      this.transformJsonForm(this.mockJson(), Object.entries(this.profileForm.controls))
    }
    this.openSnackBar("File Opened", "openSnack")
  }
  transformJsonForm(json: any, formObj: any[] | any) {
    if (formObj instanceof Array)
      formObj.forEach(
        obj => {
          let key = obj[0]
          if (obj[1] instanceof FormControl) {
            // console.log(obj, json[key])
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
  openSnackBar(text: string, panelClass: string) {
    this._snackBar.open(text, 'done', {
      duration: 3 * 1000,
      panelClass: panelClass,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
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
          "issued": "2012-08"
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

  constructor(private fb: FormBuilder, private _electronService: ElectronService, private _snackBar: MatSnackBar) {

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
