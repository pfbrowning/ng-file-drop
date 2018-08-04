import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { RejectionReasons } from '../models/rejection-reasons.model';
import { FileRejection } from '../models/file-rejection.model';
import * as lodash from 'lodash';

/**
 * This class defines the main nfd-file-input component functionality.
 * General usage, examples, and commentary is available
 * [here](https://github.com/pfbrowning/ng-file-drop/blob/master/README.md).*/
@Component({
  selector: 'nfd-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css']
})

export class FileInputComponent {
  /**Optional comma-separated list specifying file extensions to allow*/
  @Input() allowedExtensions: string;
  /**Optional max file size in bytes*/
  @Input() maxFileSize: number;
  /**Emits an array of files when the selection is changed or cleared*/
  @Output() selectionChanged = new EventEmitter<File[]>();
  /**Emits an array of [FileRejection](https://pfbrowning.github.io/ng-file-drop/doc/classes/FileRejection.html)
   * objects which specify the rejected file and the reason for rejection.*/
  @Output() filesRejected = new EventEmitter<FileRejection[]>();
  /**ViewChild handle used interally to clear the file input after
   * the user selects a file from it.*/
  @ViewChild('fileInput') fileInput;
  /**Reference to the Array type so that we can use it in the template
   * https://stackoverflow.com/questions/47586525/parse-array-in-angular-template*/
  public Array = Array;
  /**Member variable which maintains the currently selected files for internal use*/
  private _selectedFiles: File[] = new Array<File>();
  /**Member variable which maintains the dragging state for internal use*/
  private _dragging = false;

  /*
  In order to maintain the state of whether the user is currently dragging a file
  over the file drop input in a cross-browser manner, we need to capture click events
  at the top-level container and disable pointer events on all child elements
  https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
  */

  /**
   * Exposes whether the user is currently dragging a file over the component
   */
  public get dragging(): boolean {
    return this._dragging;
  }

  /**The files which are currently selected*/
  public get selectedFiles(): File[] {
    return this._selectedFiles;
  }

  /**Tells whether or not any files are currently selected*/
  public get filesSelected(): boolean {
    return this.selectedFiles.length > 0;
  }

  /**User-specified allowedExtensions as an array*/
  public get allowedExtensionsArray(): string[] {
    return this.allowedExtensions != null ? this.allowedExtensions.split(',') : null;
  }

  /**
   * Adds to selectedFiles each valid provided file and rejects invalid files,
   * where validity is defined by whether the file conflicts with any
   * user-specified maxFileSize or allowedExtensions limitation.
   * For internal use by the component itself.
   * @param filesToSelect File array to iterate through for new Files to add
   */
  selectFiles(filesToSelect: File[]) {
    const rejectedFiles = new Array<FileRejection>();

    // Clear out any previous selections
    if (this.selectedFiles.length > 0) {
      this._selectedFiles = new Array<File>();
    }

    filesToSelect.forEach(file => {
      // If a maxFileSize is specified and the file is too large, then reject it.
      if (this.maxFileSize != null && file.size > this.maxFileSize) {
        rejectedFiles.push(new FileRejection(file, RejectionReasons.FileSize));
      } else if (this.allowedExtensionsArray != null &&
        // If allowed extensions are specified and the file doesn't match an allowed extension, then reject it.
        !lodash.some(this.allowedExtensionsArray, extension => file.name.endsWith('.' + extension))) {
        rejectedFiles.push(new FileRejection(file, RejectionReasons.FileType));
      } else {
        // If the file passes the validation checks, then add it to the selection array.
        this.selectedFiles.push(file);
      }
    })

    this.selectionChanged.emit(this.selectedFiles);

    if (rejectedFiles.length > 0) {
      this.filesRejected.emit(rejectedFiles);
    }
  }

  /**Handles file selections from the file input by selecting
   * them within the component and clearing the input so that
   * the user can select more files if they'd like.
   * For internal use by the component itself.*/
  onChange(selectedFiles: Array<File>) {
    /*In order to account for the IE11 bug wherein the change event
    is fired when you programmatically clear a file input, we only
    want to handle this event when there were selected files.*/
    if (selectedFiles.length > 0) {
      this.selectFiles(selectedFiles);
      this.fileInput.nativeElement.value = null;
    }
  }

  /**Clears the file selection and emits selectionChanged
   * with an empty array*/
  public clearSelection(): void {
    if (this.selectedFiles.length > 0) {
      this._selectedFiles = new Array<File>();
      this.selectionChanged.emit(this.selectedFiles);
    }
  }

  /**Handles the dragenter event by preventing the default action
   * and setting the dragging state to true.
   * For internal use by the component itself.*/
  onDragEnter(event) {
      event.preventDefault();

      this._dragging = true;
  }

  /**Handles the dragleave event by setting the dragging state to false.
   * For internal use by the component itself.*/
  onDragLeave(event) {
      this._dragging = false;
  }

  /**Prevents the default action for the dragover event.
   * For internal use by the component itself.*/
  onDragOver(event) {
      event.preventDefault();
  }

  /**Handles the drop event by cancelling the browser's
   * default action, setting the dragging state to
   * false, and selecting the eligible dropped files.
   * For internal use by the component itself.*/
  onDrop(event) {
      // Tell the browser not to do its default thing
      event.preventDefault();
      // Reset the draging flag
      this._dragging = false;
      // Pass the dropped files to the file selection handler
      this.selectFiles(Array.from(event.dataTransfer.files));
  }
}
