import { Component, Input, Output, OnInit, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DragDropHandlerComponent } from './drag-drop-handler.component';
import { RejectionReasons } from '../models/rejection-reasons.model';
import { FileRejection } from '../models/file-rejection.model';
import { Utils } from 'shared/utils';
import * as lodash from "lodash";

@Component({
  selector: 'file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true
    }
  ]
})

export class FileInputComponent implements ControlValueAccessor {
  @Input() allowedExtensions : string = "pdf,doc,docx,xls,xlsx,json";
  @Output('blur') blur = new EventEmitter();
  @Output('selectionChanged') selectionChanged = new EventEmitter<File[]>();
  @Output('filesRejected') filesRejected = new EventEmitter<FileRejection[]>();
  @ViewChild('fileInput') fileInputViewChild;
  @ViewChild('dragDropHandler') dragDropHandler : DragDropHandlerComponent;
  private _selectedFiles : File[] = new Array<File>();
  private maxFileSize : number = 4194304;

  public get selectedFiles() : File[] {
    return this._selectedFiles;
  }

  public get draggingOver() : boolean {
    return this.dragDropHandler.draggingOver;
  }

  private get allowedExtensionsArray() : string[] {
    return this.allowedExtensions.split(',');
  }

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  onBlur() {
      this.propagateTouched();
      this.blur.emit();
  }

  writeValue(newFiles : File[]) {
    newFiles = newFiles != null ? newFiles : new Array<File>();
    this.selectFilesFromArray(newFiles);
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
    this.selectFilesFromArray(files);
  }

  private selectFilesFromFileList(fileList : FileList) : void {
    this.selectFilesFromArray(Array.from(fileList));
  }

  /**
   * Adds to selectedFiles each provided file which doesn't already exist in selectedFiles
   * @param files FileList to iterate through for new Files to add
   */
  private selectFilesFromArray(filesToSelect : File[]) {
    var selectedLengthBeforeSelection = this.selectedFiles.length;
    var rejectedFiles = new Array<FileRejection>();

    filesToSelect.forEach(file => {
      /*
      It's necessary to compare each file for equality because modern browsers will fire both the
      drop event and the change event when the user drops files, so we need to ensure we're not
      adding duplicate file entries.
      */
      if(!lodash.some(this.selectedFiles, selectedFile => Utils.areFilesEquivalent(file, selectedFile))) {
        //If the file is too large, then reject it.
        if(file.size > this.maxFileSize) {
          rejectedFiles.push(new FileRejection(file, RejectionReasons.FileSize));
        }
        //If the file doesn't match an allowed extension, then reject it.
        else if (!lodash.some(this.allowedExtensionsArray, extension => file.name.endsWith('.' + extension))) {
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
    this.selectFilesFromFileList(this.fileInput.files);
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
