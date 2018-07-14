import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileInputComponent } from './components/file-input.component';

export { FileInputComponent } from './components/file-input.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    FileInputComponent
  ],
  exports: [
    FileInputComponent
  ]
})
export class FileDropModule {}
