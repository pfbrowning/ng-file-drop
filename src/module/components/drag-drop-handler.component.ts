import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nfd-drag-drop-handler',
  templateUrl: './drag-drop-handler.component.html',
  styleUrls: [ './drag-drop-handler.component.css' ]
})

export class DragDropHandlerComponent {
    @Output('filesDropped') filesDropped = new EventEmitter<File[]>();
    private dragCounter = 0;

    /*
    In order to maintain the state of whether the user is currently dragging a file
    over the file drop input in a cross-browser manner, we need to maintain a counter
    and increment/decrement it accordingly with each dragenter and dragleave event.
    https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
    */

    /**
     * Exposes whether the user is currently dragging a file over the component
     */
    public get draggingOver(): boolean {
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
        if (this.dragCounter > 0) {
            this.dragCounter--;
        }
    }

    // When the user drops a file
    onDrop(event) {
        // Tell the browser not to do its default thing
        event.preventDefault();
        // Decrement the drag counter in order to turn off the drag indicator
        this.decrementDragCounter();
        // Emit the dragged files via the filesDropped event
        this.filesDropped.emit(Array.from(event.dataTransfer.files));
    }

    onDragOver(event) {
        event.preventDefault();
    }
}
