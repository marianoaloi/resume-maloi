import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.less']
})
export class ResumeComponent {
  socialMediaComponent = this.fb.group({
    name: [""],
    url: [""],
  })
  skillComponent = this.fb.group({
    name: [""],
    value: [""],
  })
  HistoricalWorkComponent = this.fb.group({
    company: [""],
    start: [""],
    Saida: [""],
    Tecnical: [""],
    Manager: [""],
    Tecnical_short: [""],
    Manager_short: [""],
  })
  EducationComponent = this.fb.group({
    school: [""],
    degree: [""],
    start: [""],
    end: [""],
  })
  CertificateComponent = this.fb.group({
    name: [""],
    institute: [""],
    Credential: [""],
    Issued: [""],
  })

  profileForm = this.fb.group({
    name: [''],
    telephone: [''],
    socialMedia: this.fb.array([]),
    skills: this.fb.array([]),

    HistoricalWork: this.fb.array([]),

    Education: this.fb.array([]),

    Certificate: this.fb.array([]),

  });

  constructor(private fb: FormBuilder) {

  }

  get skills(): FormArray {
    return this.profileForm.get('skills') as FormArray
  }

  addSkylls() {
    this.skills.push(this.skillComponent);
  }


  save() {
    throw new Error('Method not implemented.');
  }

  deleteSkyll(index: number) {
    this.skills.removeAt(index)
  }

  onFormSubmit() {
    console.log(JSON.stringify(this.profileForm.value))
  }
}
