// export class Utils {
//     /**
//      * Determines whether two provided File objects are equivalent
//      * @param fileA First file to compare
//      * @param fileB Second file to compare
//      */
//     public static areFilesEquivalent(fileA : File, fileB : File) : boolean {
//         var equalThusFar = fileA.name == fileB.name && 
//             fileA.size == fileB.size &&
//             fileA.type == fileB.type &&
//             fileA.webkitRelativePath == fileB.webkitRelativePath;

//         //If we already know that the files don't match, then ther's no point in checking last modified
//         if(!equalThusFar)
//             return false;
        
//         /*
//         lastModifiedDate works in IE and Edge, but is deprecated, so it's better to use
//         lastModified when it's available, and fall back to lastModifiedDate when it's not.
//         https://stackoverflow.com/questions/44115976/files-properties-lastmodified-vs-lastmodifieddate
//         */
//         if(fileA['lastModified']) {
//             return fileA['lastModified'] == fileB['lastModified'];
//         }
//         else {
//             return fileA.lastModifiedDate.getTime() == fileB.lastModifiedDate.getTime();
//         }
//     }
// }