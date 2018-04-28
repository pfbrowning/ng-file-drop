import { Component, Input, Output, OnInit, EventEmitter, ViewChild, forwardRef } from '@angular/core';

@Component({
  selector: 'drag-drop-handler',
  templateUrl: './drag-drop-handler.component.html'
})

export class DragDropHandlerComponent {
    @Output('filesDropped') filesDropped = new EventEmitter<File[]>();
    private dragCounter : number = 0;

    /*
    In order to maintain the state of whether the user is currently dragging a file
    over the file drop input in a cross-browser manner, we need to maintain a counter
    and increment/decrement it accordingly with each dragenter and dragleave event.
    https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
    */
    public get draggingOver() : boolean {
        return this.dragCounter > 0;
    }

    onDragEnter(event) {
        event.preventDefault();
        this.dragCounter++;
    }

    onDragLeave(event) {
        this.decrementDragCounter();
    }

    /*
    Take extra care to not decrement dragCounter below 0 because some browsers will fire both
    dragleave AND drop when the user drops a file.
    */
    private decrementDragCounter() {
        if(this.dragCounter > 0)
        this.dragCounter--;
    }

    onDrop(event) {
        event.preventDefault();
        this.decrementDragCounter();
        this.filesDropped.emit(Array.from(event.dataTransfer.files));
    }

    onDragOver(event) {
        event.preventDefault();
    }
}