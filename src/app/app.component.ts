import { Component, ViewChild } from '@angular/core';
import { FileRejection, RejectionReasons, FileInputComponent } from 'projects/ng-file-drop/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-file-drop-demo';
  @ViewChild('fileInput') fileInput: FileInputComponent;

  onFilesRejected(rejectedFiles: Array<FileRejection>) {
    /* Provide a rudimentary notification in order to alert the user
    that a file was rejected in order to demonstrate how the file
    rejection logic works. */
    const rejectionPrintout = rejectedFiles
      .map(rejection => `${rejection.file.name} | ${RejectionReasons[rejection.rejectionReason]}`)
      .join('\n');
    alert(`Files Rejected:\n${rejectionPrintout}`);
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
