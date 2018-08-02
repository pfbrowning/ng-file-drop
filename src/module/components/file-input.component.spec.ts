import { TestBed, getTestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FileDropModule } from '../../index';
import { FileInputComponent } from './file-input.component';
import { FileRejection } from '../models/file-rejection.model';
import { RejectionReasons } from '../models/rejection-reasons.model';


describe('File Input Component', () => {
    let injector: TestBed;
    let handlerFixture: ComponentFixture<FileInputComponent>;
    let handlerInstance: FileInputComponent;
    let selectionChangedSpy: jasmine.Spy;
    let filesRejectedSpy: jasmine.Spy;
    let dropHandlerDiv;
    let fileInput;
    let testFile1: File;
    let testFile2: File;
    let testFileJson: File;
    let testFileBig: File;

    // Asynchronously fetch and compile the components
    beforeEach(async(() => {
        // Init the testbed
        TestBed.configureTestingModule({
            imports: [ FileDropModule ]
        })
        .compileComponents();
    }));

    // Once the component has been compiled, synchronously initialize stuff before each test
    beforeEach(() => {
        injector = getTestBed();

        // Store references to the testing fixture and the component instance
        handlerFixture = TestBed.createComponent(FileInputComponent);
        handlerInstance = handlerFixture.componentInstance;

        // Query to find the handler container div
        dropHandlerDiv  = handlerFixture.debugElement.query(By.css('div.nfdDragDropHandler')).nativeElement;
        // Query for the file input
        fileInput = handlerFixture.debugElement.query(By.css('input[type=file]')).nativeElement;

        // Initialize the spies
        selectionChangedSpy = spyOn(handlerInstance.selectionChanged, 'emit').and.callThrough();
        filesRejectedSpy = spyOn(handlerInstance.filesRejected, 'emit').and.callThrough();

        // Mock up a few test files https://stackoverflow.com/questions/24488985/how-to-mock-file-in-javascript
        const testBlob1 = new Blob(['Test file content 1'], {type: 'text/plain'});
        testBlob1['name'] = 'testfile1.txt';
        testFile1 = <File> testBlob1;

        const testBlob2 = new Blob(['Test blob 2'], {type: 'text/plain'});
        testBlob2['name'] = 'testfile2.txt';
        testFile2 = <File> testBlob2;

        const testBlob3 = new Blob(['{\'name\':\'testObject\'}'], {type: 'application/json'});
        testBlob3['name'] = 'testfileJson.json';
        testFileJson = <File> testBlob3;

        const testBlob4 = new Blob(
            ['Dummy text typed out in order to have text that\'s a little bit longer than the others.'],
            {type: 'text/plain'});
        testBlob4['name'] = 'testfileBig.nfo';
        testFileBig = <File> testBlob4;
    });

    it('should properly handle basic file selection', () => {
        // Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();

        // Select some files
        handlerInstance.selectFiles([testFile1, testFile2]);

        // Check the state of the component after file selection
        expect(handlerInstance.selectedFiles.length).toBe(2);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(filesRejectedSpy).not.toHaveBeenCalled();

        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFile2]);

        expect(handlerInstance.selectedFiles[0]).toBe(testFile1);
        expect(handlerInstance.selectedFiles[1]).toBe(testFile2);
    });

    it('should reject any files larger than the specified max size', () => {
        // Set a maxFileSize such that all are smaller except for testFileBig
        handlerInstance.maxFileSize = 25;

        // Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();
        expect(filesRejectedSpy).not.toHaveBeenCalled();

        // Select some files
        handlerInstance.selectFiles([testFile1, testFile2, testFileJson, testFileBig]);

        // Check the state of the component after file selection
        expect(handlerInstance.selectedFiles.length).toBe(3);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(filesRejectedSpy).toHaveBeenCalledTimes(1);

        // Expect that the small files were selected and the big file was rejected
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFile2, testFileJson]);
        expect(filesRejectedSpy).toHaveBeenCalledWith([new FileRejection(testFileBig, RejectionReasons.FileSize)]);
    });

    it('should reject any files which don\'t match allowedExtensions', () => {
        // Set allowedExtensions such that all files should pass except for testFileJson
        handlerInstance.allowedExtensions = 'txt,nfo';

        // Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();
        expect(filesRejectedSpy).not.toHaveBeenCalled();

        // Select some files
        handlerInstance.selectFiles([testFile1, testFile2, testFileJson, testFileBig]);

        // Check the state of the component after file selection
        expect(handlerInstance.selectedFiles.length).toBe(3);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(filesRejectedSpy).toHaveBeenCalledTimes(1);

        // Expect that all files were selected except for testFileJson
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFile2, testFileBig]);
        expect(filesRejectedSpy).toHaveBeenCalledWith([new FileRejection(testFileJson, RejectionReasons.FileType)]);
    });

    it('should reject different files for different reasons', () => {
        // Set allowedExtensions such the txt files will fail the check
        handlerInstance.allowedExtensions = 'json,nfo';
        // Set maxFileSize such that testFileBig will fail the check
        handlerInstance.maxFileSize = 25;

        // Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();
        expect(filesRejectedSpy).not.toHaveBeenCalled();

        // Select some files
        handlerInstance.selectFiles([testFile1, testFile2, testFileJson, testFileBig]);

        // Check the state of the component after file selection
        expect(handlerInstance.selectedFiles.length).toBe(1);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(filesRejectedSpy).toHaveBeenCalledTimes(1);

        // Expect that all files were selected except for testFileJson
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFileJson]);
        expect(filesRejectedSpy).toHaveBeenCalledWith([
            new FileRejection(testFile1, RejectionReasons.FileType),
            new FileRejection(testFile2, RejectionReasons.FileType),
            new FileRejection(testFileBig, RejectionReasons.FileSize)
        ]);
    });

    it('should clear out previous selections when a new selection is made', () => {
        // Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();

        // Select some files
        handlerInstance.selectFiles([testFile1, testFile2]);

        // Check the state of the component after file selection
        expect(handlerInstance.selectedFiles.length).toBe(2);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFile2]);

        // Select a different file
        handlerInstance.selectFiles([testFileJson])

        // Check the state of the component after file selection
        expect(handlerInstance.selectedFiles.length).toBe(1);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(2);
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFileJson]);

        // Select a different set of files

        handlerInstance.selectFiles([testFile1, testFileBig]);

        // Check the state of the component after file selection
        expect(handlerInstance.selectedFiles.length).toBe(2);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(3);
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFileBig]);
    });

    it('should properly clear the selection when told to do so', () => {
        // Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();

        // Select some files
        handlerInstance.selectFiles([testFile1, testFile2]);

        // Check the state of the component after file selection
        expect(handlerInstance.selectedFiles.length).toBe(2);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFile2]);

        // Tell the component to clear the selection
        handlerInstance.clearSelection();

        // Ensure that no files are selected
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);

        // Check that selectionChanged was emitted a second time to clear the selection
        expect(selectionChangedSpy).toHaveBeenCalledTimes(2);
    });

    it('should properly select dropped files', () => {
        // Mock up a file drop event
        const dropEvent = new Event('drop');
        dropEvent['dataTransfer'] = { files: [ testFile1, testFile2, testFileBig ]};

        // Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(handlerInstance.dragging).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();

        // Simulate the start of the drag
        dropHandlerDiv.dispatchEvent(new Event('dragenter'));

        // Ensure that the drag state is being set properly
        expect(handlerInstance.dragging).toBe(true);

        // Simulate a file being dropped on the container div
        dropHandlerDiv.dispatchEvent(dropEvent);

        // Check the state of the component after file drop
        expect(handlerInstance.selectedFiles.length).toBe(3);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(handlerInstance.dragging).toBe(false);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFile2, testFileBig]);
    });

    it('should properly handle a file being dragged over', () => {
        // Check the state of the dragging flag before doing anything
        expect(handlerInstance.dragging).toBe(false);

        // Simulate the user starting to drag a file
        dropHandlerDiv.dispatchEvent(new Event('dragenter'));

        /* The dragover event happens many times during a file drag, 
        so we'll roughly simulate that here*/
        for(let i = 0; i < 10; i++) {
            dropHandlerDiv.dispatchEvent(new Event('dragover'));
        }

        //The component should be in a dragging state after dragenter
        expect(handlerInstance.dragging).toBe(true);

        // Simulate the user dragging the file out of the handler div
        dropHandlerDiv.dispatchEvent(new Event('dragleave'));

        // The component should no longer be in a dragging state after dragleave
        expect(handlerInstance.dragging).toBe(false);

    })
});


