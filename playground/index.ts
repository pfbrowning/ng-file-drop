/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PlaygroundComponent } from './components/playground.component';
import { FileDropModule }  from '../dist';

@NgModule({
  bootstrap: [ PlaygroundComponent ],
  declarations: [ PlaygroundComponent ],
  imports: [ BrowserModule, FileDropModule ]
})
class PlaygroundModule {}

platformBrowserDynamic().bootstrapModule(PlaygroundModule);
