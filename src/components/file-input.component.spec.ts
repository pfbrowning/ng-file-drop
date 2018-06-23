import { TestBed, getTestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FileDropModule } from '../index';
import { FileInputComponent } from './file-input.component';
import { FileRejection } from '../models/file-rejection.model';
import { RejectionReasons } from '../models/rejection-reasons.model';


describe('File Input Component', () => {
    let injector : TestBed;
    let handlerFixture: ComponentFixture<FileInputComponent>;
    let handlerInstance: FileInputComponent;
    let selectionChangedSpy : jasmine.Spy;
    let filesRejectedSpy : jasmine.Spy;
    let filesDroppedSpy : jasmine.Spy;
    let testFile1 : File;
    let testFile2 : File;
    let testFileJson : File;
    let testFileBig : File;

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

        //Initialize the spies
        selectionChangedSpy = spyOn(handlerInstance.selectionChanged, 'emit').and.callThrough();
        filesRejectedSpy = spyOn(handlerInstance.filesRejected, 'emit').and.callThrough();
        filesDroppedSpy = spyOn(handlerInstance.dragDropHandler.filesDropped, 'emit').and.callThrough();

        //Mock up a few test files
        let testBlob1 = new Blob(["Test file content 1"], {type: 'text/plain'});
        testBlob1['name'] = 'testfile1.txt';
        testFile1 = <File> testBlob1;

        let testBlob2 = new Blob(["Test blob 2"], {type: 'text/plain'});
        testBlob2['name'] = 'testfile2.txt';
        testFile2 = <File> testBlob2;

        let testBlob3 = new Blob(["{'name':'testObject'}"], {type: 'application/json'});
        testBlob3['name'] = 'testfileJson.json';
        testFileJson = <File> testBlob3;

        let testBlob4 = new Blob(["Dummy text typed out in order to have text that's a little bit longer than the others."], {type: 'text/plain'});
        testBlob4['name'] = 'testfileBig.nfo';
        testFileBig = <File> testBlob4;
    });

    it('should properly handle basic file selection', () => {
        //Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();

        //Select some files
        handlerInstance.selectFiles([testFile1, testFile2]);

        //Check the state of the component after file selection 
        expect(handlerInstance.selectedFiles.length).toBe(2);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(filesRejectedSpy).not.toHaveBeenCalled();

        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFile2]);

        expect(handlerInstance.selectedFiles[0]).toBe(testFile1);
        expect(handlerInstance.selectedFiles[1]).toBe(testFile2);
    });

    it('should reject any files larger than the specified max size', () => {
        //Set a maxFileSize such that all are smaller except for testFileBig
        handlerInstance.maxFileSize = 25;

        //Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();
        expect(filesRejectedSpy).not.toHaveBeenCalled();

        //Select some files
        handlerInstance.selectFiles([testFile1, testFile2, testFileJson, testFileBig]);

        //Check the state of the component after file selection 
        expect(handlerInstance.selectedFiles.length).toBe(3);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(filesRejectedSpy).toHaveBeenCalledTimes(1);

        //Expect that the small files were selected and the big file was rejected
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFile2, testFileJson]);
        expect(filesRejectedSpy).toHaveBeenCalledWith([new FileRejection(testFileBig, RejectionReasons.FileSize)]);
    });

    it("should reject any files which don't match allowedExtensions", () => {
        //Set allowedExtensions such that all files should pass except for testFileJson
        handlerInstance.allowedExtensions = "txt,nfo";

        //Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();
        expect(filesRejectedSpy).not.toHaveBeenCalled();

        //Select some files
        handlerInstance.selectFiles([testFile1, testFile2, testFileJson, testFileBig]);

        //Check the state of the component after file selection 
        expect(handlerInstance.selectedFiles.length).toBe(3);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(filesRejectedSpy).toHaveBeenCalledTimes(1);

        //Expect that all files were selected except for testFileJson
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFile2, testFileBig]);
        expect(filesRejectedSpy).toHaveBeenCalledWith([new FileRejection(testFileJson, RejectionReasons.FileType)]);
    });

    it("should reject different files for different reasons", () => {
        //Set allowedExtensions such the txt files will fail the check
        handlerInstance.allowedExtensions = "json,nfo";
        //Set maxFileSize such that testFileBig will fail the check
        handlerInstance.maxFileSize = 25;

        //Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();
        expect(filesRejectedSpy).not.toHaveBeenCalled();

        //Select some files
        handlerInstance.selectFiles([testFile1, testFile2, testFileJson, testFileBig]);

        //Check the state of the component after file selection 
        expect(handlerInstance.selectedFiles.length).toBe(1);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(filesRejectedSpy).toHaveBeenCalledTimes(1);

        //Expect that all files were selected except for testFileJson
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFileJson]);
        expect(filesRejectedSpy).toHaveBeenCalledWith([
            new FileRejection(testFile1, RejectionReasons.FileType),
            new FileRejection(testFile2, RejectionReasons.FileType),
            new FileRejection(testFileBig, RejectionReasons.FileSize)
        ]);
    });

    it("should clear out previous selections when a new selection is made", () => {
        //Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();

        //Select some files
        handlerInstance.selectFiles([testFile1, testFile2]);

        //Check the state of the component after file selection 
        expect(handlerInstance.selectedFiles.length).toBe(2);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFile2]);

        //Select a different file
        handlerInstance.selectFiles([testFileJson])

        //Check the state of the component after file selection 
        expect(handlerInstance.selectedFiles.length).toBe(1);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(2);
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFileJson]);

        //Select a different set of files

        handlerInstance.selectFiles([testFile1, testFileBig]);

        //Check the state of the component after file selection 
        expect(handlerInstance.selectedFiles.length).toBe(2);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(3);
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFileBig]);
    });

    it("should properly clear the selection when told to do so", () => {
        //Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();

        //Select some files
        handlerInstance.selectFiles([testFile1, testFile2]);

        //Check the state of the component after file selection 
        expect(handlerInstance.selectedFiles.length).toBe(2);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFile2]);

        //Tell the component to clear the selection
        handlerInstance.clearSelection();

        //Ensure that no files are selected
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);

        //Check that selectionChanged was emitted a second time to clear the selection
        expect(selectionChangedSpy).toHaveBeenCalledTimes(2);
    });

    it("should properly select dropped files", () => {
        //Check the state of the component before selecting files
        expect(handlerInstance.selectedFiles.length).toBe(0);
        expect(handlerInstance.filesSelected).toBe(false);
        expect(selectionChangedSpy).not.toHaveBeenCalled();
        expect(filesDroppedSpy).not.toHaveBeenCalled();

        //Simulate the dropping of files
        handlerInstance.dragDropHandler.filesDropped.emit([testFile1, testFile2, testFileBig]);

        //Check the state of the component after file drop
        expect(handlerInstance.selectedFiles.length).toBe(3);
        expect(handlerInstance.filesSelected).toBe(true);
        expect(filesDroppedSpy).toHaveBeenCalledTimes(1);
        expect(selectionChangedSpy).toHaveBeenCalledTimes(1);
        expect(selectionChangedSpy).toHaveBeenCalledWith([testFile1, testFile2, testFileBig]);
    });
});


