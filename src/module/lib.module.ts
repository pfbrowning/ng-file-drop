import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileInputComponent } from './components/file-input.component';

export { FileRejection } from './models/file-rejection.model';
export { RejectionReasons } from './models/rejection-reasons.model';

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
