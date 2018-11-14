import { Component, ViewChild } from '@angular/core';
import { FileRejection, RejectionReasons, FileInputComponent } from '@browninglogic/ng-file-drop';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('fileInput') fileInput: FileInputComponent;

  constructor(private messageService: MessageService) {}
  
  onFilesRejected(rejectedFiles: Array<FileRejection>) {
    /* Provide a toaster notification in order to alert the user
    that a file was rejected in order to demonstrate how the file
    rejection logic works. */
    this.messageService.addAll(rejectedFiles.map(rejection => {
      return {severity:'warn', summary:'File Rejected', detail:`${rejection.file.name} | ${RejectionReasons[rejection.rejectionReason]}`};
    }));
  }

  public get diagnosticsInfo(): object {
    return {
      'dragging': this.fileInput.dragging,
      'filesSelected': this.fileInput.filesSelected,
      'selectedFiles': this.fileInput.selectedFiles.map(file => file.name),
      'maxFileSize': this.fileInput.maxFileSize,
      'allowedExtensions': this.fileInput.allowedExtensionsArray
    };
  }
}
