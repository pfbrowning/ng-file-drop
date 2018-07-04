import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropHandlerComponent } from './components/drag-drop-handler.component';
import { FileInputComponent } from './components/file-input.component';

export { DragDropHandlerComponent } from './components/drag-drop-handler.component';
export { FileInputComponent } from './components/file-input.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    FileInputComponent,
    DragDropHandlerComponent
  ],
  exports: [
    FileInputComponent,
    DragDropHandlerComponent
  ]
})
export class FileDropModule {}