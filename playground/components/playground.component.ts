import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { FileDropModule }  from '../../dist';

@Component({
  selector: 'playground',
  templateUrl: 'components/playground.component.html',
  styleUrls: ['components/playground.component.css']
})
export class PlaygroundComponent {}