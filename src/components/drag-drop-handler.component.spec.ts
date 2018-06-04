import { TestBed, getTestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FileDropModule } from '../index';
import { DragDropHandlerComponent } from './drag-drop-handler.component';


describe('Drag & Drop Handler Component', () => {
    let injector : TestBed;
    let handlerFixture: ComponentFixture<DragDropHandlerComponent>;
    let handlerInstance: DragDropHandlerComponent;
    let filesDroppedSpy : jasmine.Spy;
    let dropHandlerContainerDiv;

    //Asynchronously fetch and compile the components
    beforeEach(async(() => {
        //Init the testbed
        TestBed.configureTestingModule({
            imports: [ FileDropModule ]
        })
        .compileComponents();
    }));

    //Once the component has been compiled, synchronously initialize stuff before each test
    beforeEach(() => {
        injector = getTestBed();

        //Store references to the testing fixture and the component instance
        handlerFixture = TestBed.createComponent(DragDropHandlerComponent);
        handlerInstance = handlerFixture.componentInstance;

        //Query to find the handler container div
        dropHandlerContainerDiv  = handlerFixture.debugElement.query(By.css('div')).nativeElement;

        //Spy on the file drop emitter
        filesDroppedSpy = spyOn(handlerInstance.filesDropped, 'emit').and.callThrough();

        // //Initiate the component
        // handlerFixture.detectChanges();
    });

    it('should properly handle a file drop event', (done) => {
        //Mock up a test file https://stackoverflow.com/questions/24488985/how-to-mock-file-in-javascript
        let testFileBlob = new Blob([''], {type: 'text/plain'});
        //testFileBlob["lastModified"] = "";
        testFileBlob['name'] = 'testfile.txt';
        let testFile : File = <File> testFileBlob;

        //Mock up a file drop event
        let dropEvent = new Event('drop');
        dropEvent['dataTransfer'] = { files: [ testFile ]};

        handlerInstance.filesDropped.subscribe(files => {
            //Ensure that the file emitted matches the file that was dropped
            expect(files.length).toBe(1);
            expect(files[0].name).toBe('testfile.txt');
            //Explicitly call done to ensure that these tests were actually hit
            done()
        });

        //Simulate a file being dropped on the container div
        dropHandlerContainerDiv.dispatchEvent(dropEvent);

        //Ensure that the file drop event was emitted exactly once
        expect(filesDroppedSpy).toHaveBeenCalledTimes(1);
    });
});


