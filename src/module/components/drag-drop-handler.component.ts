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
        console.log('dragenter', event.target);

        /*
        Explicitly ignore drag events fired from child text nodes because
        Firefox behaves strangely.  We can ignore these because the main
        drag events that we care about are the dragenter and dragleave on the
        parent div, which obviously is not a text node.
        In particular, Firefox will sometimes emit a dragenter event on a
        child text node after the dragleave was emitted from the parent
        element, which messes up our state management by putting
        the component in a 'dragging' state immediately after the
        drag finished.
        */
        if (event.target.nodeType === 3) {
            return;
        }
        console.log('incrementing');
        this.dragCounter++;
    }

    onDragLeave(event) {
        console.log('dragleave', event.target);

        /*
        Explicitly ignore drag events fired from child text nodes,
        as noted within onDragEnter
        */
        if (event.target.nodeType === 3) {
            return;
        }

        console.log('decrementing');
        this.dragCounter--;
    }

    // When the user drops a file
    onDrop(event) {
        // Tell the browser not to do its default thing
        event.preventDefault();
        // Reset the drag counter
        this.dragCounter = 0;
        // Emit the dragged files via the filesDropped event
        this.filesDropped.emit(Array.from(event.dataTransfer.files));
    }

    onDragOver(event) {
        event.preventDefault();
    }
}
