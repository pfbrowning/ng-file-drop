import { RejectionReasons } from './rejection-reasons.model';

export class FileRejection {
    constructor(
        public readonly file: File,
        public readonly rejectionReason: RejectionReasons
    ) {}
}
