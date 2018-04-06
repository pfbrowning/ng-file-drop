import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropHandlerComponent } from './components/drag-drop-handler.component';
import { FileInputComponent } from './components/file-input.component';

export * from './components/drag-drop-handler.component';
export * from './components/file-input.component';

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

// import { NgModule, ModuleWithProviders } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { SampleComponent } from './sample.component';
// import { SampleDirective } from './sample.directive';
// import { SamplePipe } from './sample.pipe';
// import { SampleService } from './sample.service';

// export * from './sample.component';
// export * from './sample.directive';
// export * from './sample.pipe';
// export * from './sample.service';

// @NgModule({
//   imports: [
//     CommonModule
//   ],
//   declarations: [
//     SampleComponent,
//     SampleDirective,
//     SamplePipe
//   ],
//   exports: [
//     SampleComponent,
//     SampleDirective,
//     SamplePipe
//   ]
// })
// export class SampleModule {
//   static forRoot(): ModuleWithProviders {
//     return {
//       ngModule: SampleModule,
//       providers: [SampleService]
//     };
//   }
// }