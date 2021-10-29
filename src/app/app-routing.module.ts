import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/base/admin.component';
import { DifficultyComponent } from './difficulty/difficulty.component';
import { FormComponent } from './form/form.component';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { PrincipeComponent } from './principe/principe.component';
import { AuthenticatedGuard } from './services/authenticated.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'form', component: FormComponent },
  { path: 'difficulty', component: DifficultyComponent },
  { path: 'principe', component: PrincipeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'play', component: PlayComponent },
  { path: 'training', component: PlayComponent},
  { path: 'admin', component: AdminComponent, canActivate: [AuthenticatedGuard]},
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
