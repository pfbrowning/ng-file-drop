import { Component, Input, Output, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DragDropHandlerComponent } from './drag-drop-handler.component';
import { RejectionReasons } from '../models/rejection-reasons.model';
import { FileRejection } from '../models/file-rejection.model';
import { Utils } from '../shared/utils';
import * as lodash from "lodash";

@Component({
  selector: 'file-input',
  templateUrl: './file-input.component.html',
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true
    }
  ]
})

export class FileInputComponent implements ControlValueAccessor {
  /**Allowed extensions can be optionally specified as a comma-separated list*/
  @Input() allowedExtensions : string;
  /**maxFileSize can be optionally specified in bytes*/
  @Input() maxFileSize : number;
  @Output('blur') blur = new EventEmitter();
  @Output('selectionChanged') selectionChanged = new EventEmitter<File[]>();
  @Output('filesRejected') filesRejected = new EventEmitter<FileRejection[]>();
  @ViewChild('fileInput') fileInputViewChild;
  @ViewChild('dragDropHandler') dragDropHandler : DragDropHandlerComponent;
  private _selectedFiles : File[] = new Array<File>();

  /**The files which are currently selected*/
  public get selectedFiles() : File[] {
    return this._selectedFiles;
  }

  /**Tells whether or not any files are currently selected*/
  public get filesSelected() : boolean {
    return this.selectedFiles.length > 0;
  }

  /**Tells whether the user is currently dragging a file over the file-input*/
  public get draggingOver() : boolean {
    return this.dragDropHandler.draggingOver;
  }

  /**User-specified allowedExtensions as an array*/
  private get allowedExtensionsArray() : string[] {
    return this.allowedExtensions != null ? this.allowedExtensions.split(',') : null;
  }

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  onBlur() {
      this.propagateTouched();
      this.blur.emit();
  }

  writeValue(newFiles : File[]) {
    newFiles = newFiles != null ? newFiles : new Array<File>();
    this.selectFiles(newFiles);
  }

  registerOnChange(fn) {
      this.propagateChange = fn;
  }

  registerOnTouched(fn) {
      this.propagateTouched = fn;
  }

  private get fileInput() : HTMLInputElement {
    return this.fileInputViewChild.nativeElement;
  }

  /**
   * Adds the necessary files to the selectedFiles array when dragged by the user
   * @param event the drop event provided by the browser
   */
  onFilesDropped(files : File[]) {
    this.selectFiles(files);
  }

  /**
   * Adds to selectedFiles each valid provided file which doesn't already exist in selectedFiles 
   * and rejects invalid files, where validity is defined by whether the file conflicts with any
   * user-specified maxFileSize or allowedExtensions limitation.
   * @param files FileList to iterate through for new Files to add
   */
  selectFiles(filesToSelect : File[]) {
    var selectedLengthBeforeSelection = this.selectedFiles.length;
    var rejectedFiles = new Array<FileRejection>();

    filesToSelect.forEach(file => {
      /*
      It's necessary to compare each file for equality because modern browsers will fire both the
      drop event and the change event when the user drops files, so we need to ensure we're not
      adding duplicate file entries.
      */
      if(!lodash.some(this.selectedFiles, selectedFile => Utils.areFilesEquivalent(file, selectedFile))) {
        //If a maxFileSize is specified and the file is too large, then reject it.
        if(this.maxFileSize != null && file.size > this.maxFileSize) {
          rejectedFiles.push(new FileRejection(file, RejectionReasons.FileSize));
        }
        //If allowed extensions are specified and the file doesn't match an allowed extension, then reject it.
        else if (this.allowedExtensionsArray != null && !lodash.some(this.allowedExtensionsArray, extension => file.name.endsWith('.' + extension))) {
          rejectedFiles.push(new FileRejection(file, RejectionReasons.FileType));
        }
        //If the file passes the validation checks, then add it to the selection array.
        else {
          this.selectedFiles.push(file);
        }
      }
    })

    if(selectedLengthBeforeSelection != this.selectedFiles.length) {
      this.onSelectionChanged(this.selectedFiles);
    }
    if(rejectedFiles.length > 0) {
      this.filesRejected.emit(rejectedFiles);
    }
  }

  /*
  When the user selects files through the file input, add them
  to selectedFiles and clear the file input
  */
  onChange() {
    this.selectFiles(Array.from(this.fileInput.files));
    this.fileInput.value = null;
  }

  public clearSelection() : void {
    if(this.selectedFiles.length > 0) {
      this._selectedFiles = new Array<File>();
      this.onSelectionChanged(this.selectedFiles);
    }
  }

  private onSelectionChanged(selectedFiles : File[]) : void {
    this.propagateChange(selectedFiles);
    this.selectionChanged.emit(selectedFiles);
  }
}
