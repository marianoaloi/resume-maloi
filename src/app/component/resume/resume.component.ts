import { Component, ElementRef, Input, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Moment } from 'moment-timezone';
import { ElectronService } from 'ngx-electron';
import * as moment from 'moment-timezone';
import { MatSnackBar } from '@angular/material/snack-bar';
import { resume } from 'src/app/temp';

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
    this.save()
  }
  save() {

    if (this._electronService.isElectronApp) {
      let valueResume = JSON.stringify(this.profileForm.value, null, 4)
      let autosave = this.autosave.nativeElement.checked
      this._electronService.ipcRenderer.send('save', valueResume, autosave);

      this._electronService.ipcRenderer.once('fileTosave', (event, message) => {
        // console.log(message)

        this.openSnackBar(message, 'saveSnack')
      })
    } else {
      console.log("no Electron")

      this.openSnackBar("no Electron", 'saveSnack')
    }
  }
  open() {
    if (this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('open', new Date().toISOString());

      this._electronService.ipcRenderer.once('fileToOpen', (event, resumeObject) => {

        this.clearskills(); this.resetskills();
        this.clearsocialmedias(); this.resetsocialmedias();
        this.clearhistoricals(); this.resethistoricals();
        this.cleareducations(); this.reseteducations();
        this.clearcertificates(); this.resetcertificates();

        this.autosave.nativeElement.checked = true
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
                case 'addlanguages': this.addlanguages(); break;
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
      duration: 500,
      panelClass: panelClass,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  mockJson(): object {
    return resume;
  }
  profileForm = this.fb.group({
    name: ['', Validators.required],
    telephone: ['', Validators.required],
    location: ['', Validators.required],
    email: ['', Validators.required],
    possition: ['', Validators.required],
    presentation: ['', Validators.required],
    socialmedias: this.fb.array([]),
    skills: this.fb.array([]),
    languages: this.fb.array([]),
    historicals: this.fb.array([]),
    educations: this.fb.array([]),
    certificates: this.fb.array([]),

  });

  constructor(private fb: FormBuilder, private _electronService: ElectronService, private _snackBar: MatSnackBar, public dialog: MatDialog) {

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
    this.confirmDelete("skills", this.skills, index)
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
      name: ["", Validators.required],
      url: ["", Validators.required],
    })
    this.socialmedias.push(socialmediaComponent);
  }
  deletesocialmedia(index: number) {
    this.confirmDelete("socialmedias", this.socialmedias, index)
  }
  resetsocialmedias() {
    this.socialmedias.reset()
  }
  clearsocialmedias() {
    this.socialmedias.clear()
  }

  /* Language */
  get languages(): FormArray {
    return this.profileForm.get('languages') as FormArray
  }
  addlanguages() {
    const languageComponent = this.fb.group({
      name: ["", Validators.required],
      value: ["", Validators.required],
    })
    this.languages.push(languageComponent);
  }
  deletelanguage(index: number) {
    this.confirmDelete("languages", this.languages, index)
  }
  resetlanguages() {
    this.languages.reset()
  }
  clearlanguages() {
    this.languages.clear()
  }


  /* historical */
  get historicals(): FormArray {
    return this.profileForm.get('historicals') as FormArray
  }
  addhistoricals() {
    const historicalComponent = this.fb.group({
      company: ["", Validators.required],
      start: ["", Validators.required],
      end: [""],
      tecnical: [""],
      manager: [""],
      project: [""],
      tecnical_short: [""],
      manager_short: [""],
      project_short: [""],
    })
    this.historicals.push(historicalComponent);
  }
  deletehistorical(index: number) {
    this.confirmDelete("historicals", this.historicals, index)
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
      school: ["", Validators.required],
      degree: ["", Validators.required],
      start: ["", Validators.required],
      end: [""],
    })
    this.educations.push(educationComponent);
  }
  deleteeducation(index: number) {
    this.confirmDelete("educations", this.educations, index)
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
      name: ["", Validators.required],
      institute: ["", Validators.required],
      credential: [""],
      issued: ["", Validators.required],
      url: [""],

    })
    this.certificates.push(certificateComponent);
  }
  deletecertificate(index: number) {
    this.confirmDelete("certificates", this.certificates, index)
  }
  confirmDelete(whatDelete: string, action: any, index: number) {
    let result = false
    const dialogRef = this.dialog.open(DeleteDialog, {
      data: { component: whatDelete }

    })

    dialogRef.afterClosed().subscribe(resultd => {
      console.log('The dialog was closed');
      if (resultd) action.removeAt(index);
    });
  }
  resetcertificates() {
    this.certificates.reset()
  }
  clearcertificates() {
    this.socialmedias.clear()
  }

  onFormSubmit() {
    // console.log(JSON.stringify(this.profileForm.value))
    this.save()
  }
}

export interface DialogData {
  component: string;
  result: boolean;
}
@Component({
  selector: 'dialog-delete',
  templateUrl: 'confirmdelete.html',
})
export class DeleteDialog {
  deleteComponent() {
    this.data.result = true

    this.dialogRef.close(true);
  }
  onNoClick() {
    this.data.result = false
    this.dialogRef.close(false);
  }
  constructor(public dialogRef: MatDialogRef<DeleteDialog>
    ,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
}