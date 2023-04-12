import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.less']
})
export class ResumeComponent {
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

  constructor(private fb: FormBuilder) {

  }

  formatLabel(value: number): string {

    return `${value}`;
  }

  /* Skill */
  get skills(): FormArray {
    return this.profileForm.get('skills') as FormArray
  }
  addskill() {
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
  addsocialmedia() {
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
  addhistorical() {
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
  addeducation() {
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
  addcertificate() {
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
  }
}
