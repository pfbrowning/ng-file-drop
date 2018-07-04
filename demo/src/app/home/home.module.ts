import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FileDropModule  } from '@browninglogic/ng-file-drop';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        CommonModule,
        FileDropModule,
        HomeRoutingModule,
    ],
    declarations: [HomeComponent],
})
export class HomeModule { }
