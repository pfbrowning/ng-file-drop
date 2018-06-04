import { TestBed, getTestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FileDropModule } from '../index';
import { FileInputComponent } from './file-input.component';


describe('File Input Component', () => {
    let injector : TestBed;
    let handlerFixture: ComponentFixture<FileInputComponent>;
    let handlerInstance: FileInputComponent;
    let selectionChangedSpy : jasmine.Spy;
    let filesRejectedSpy : jasmine.Spy;

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
        handlerFixture = TestBed.createComponent(FileInputComponent);
        handlerInstance = handlerFixture.componentInstance;

        //Spy on the selection changed and filesRejected event emitters
        selectionChangedSpy = spyOn(handlerInstance.selectionChanged, 'emit').and.callThrough();
        filesRejectedSpy = spyOn(handlerInstance.filesRejected, 'emit').and.callThrough();
    });

    it('should properly handle basic file selection', (done) => {
        //Mock up a test file https://stackoverflow.com/questions/24488985/how-to-mock-file-in-javascript
        let testFileBlob = new Blob([''], {type: 'text/plain'});
        testFileBlob['name'] = 'testfile2.txt';
        let testFile : File = <File> testFileBlob;

        handlerInstance.selectionChanged.subscribe(selectedFiles => {
            //Ensure that the file emitted matches the file that was dropped
            expect(selectedFiles.length).toBe(1);
            expect(selectedFiles[0].name).toBe('testfile2.txt');
            //Explicitly call done to ensure that these tests were actually hit
            done()
        });

        //Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();

        //Select some files
        handlerInstance.selectFiles([testFile]);

        //Check the state of the component after file selection 
        expect(handlerInstance.selectedFiles.length).toBe(1);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(filesRejectedSpy).not.toHaveBeenCalled();
    });
});


