import { Component } from '@angular/core';
import { FileRejection, RejectionReasons } from 'projects/ng-file-drop/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-file-drop-demo';

  onFilesRejected(rejectedFiles: Array<FileRejection>) {
    /* Provide a rudimentary notification in order to alert the user
    that a file was rejected in order to demonstrate how the file
    rejection logic works. */
    const rejectionPrintout = rejectedFiles
      .map(rejection => `${rejection.file.name} | ${RejectionReasons[rejection.rejectionReason]}`)
      .join('\n');
    alert(`Files Rejected:\n${rejectionPrintout}`);
  }
}
