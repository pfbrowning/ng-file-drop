import { Component } from '@angular/core';
import { FileRejection } from '@browninglogic/ng-file-drop';
import { RejectionReasons } from '@browninglogic/ng-file-drop';

@Component({
  selector: 'nfd-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {
  onFilesRejected(rejectedFiles : Array<FileRejection>) {
    /* Provide a rudimentary notification in order to alert the user
    that a file was rejected in order to demonstrate how the file
    rejection logic works. */
    const rejectionPrintout = rejectedFiles
      .map(rejection => `${rejection.file.name} | ${RejectionReasons[rejection.rejectionReason]}`)
      .join('\n');
    alert(`Files Rejected:\n${rejectionPrintout}`);
  }
}
