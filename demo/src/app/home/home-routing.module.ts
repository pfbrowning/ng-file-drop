import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    imports: [RouterModule.forChild([
      { path: 'home', component: HomeComponent }
    ])],
    exports: [RouterModule]
  })
export class HomeRoutingModule {}