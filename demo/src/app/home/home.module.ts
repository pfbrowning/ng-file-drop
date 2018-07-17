import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDropModule } from '@browninglogic/ng-file-drop';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components/home/home.component';
import { DemoComponent } from './components/demo/demo.component';
import { DiagnosticsBoxComponent } from './components/diagnostics-box/diagnostics-box.component';

@NgModule({
    imports: [
        CommonModule,
        FileDropModule,
        HomeRoutingModule,
    ],
    declarations: [HomeComponent, DemoComponent, DiagnosticsBoxComponent],
})
export class HomeModule { }
