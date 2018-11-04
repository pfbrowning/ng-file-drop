import { RejectionReasons } from './rejection-reasons.model';

/**This is a simple object model used to communicate that a specific file was rejected
 * and why it was rejected.  This is provided to the consumer as an array of
 * FileRejection objects emitted from the filesRejected event.
*/
export class FileRejection {
    /**Simple constructor used internally for quick initialization of the model*/
    constructor(
        /**The file that was rejected*/
        public readonly file: File,
        /**The reason why the file was rejected*/
        public readonly rejectionReason: RejectionReasons
    ) {}
}
