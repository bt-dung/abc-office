export const I_STORAGE_SERVICE = 'IStorageService';

export interface IStorageService {
    uploadFile(file: Express.Multer.File, subfolder: string): Promise<string>;
    deleteFile(path: string): Promise<void>;
}