import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumeComponent } from './component/resume/resume.component';

const routes: Routes = [

  {
    path: 'r',
    component: ResumeComponent
  },

  { path: '', redirectTo: '/r', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
