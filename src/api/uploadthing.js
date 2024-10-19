import { createUploadthing } from 'uploadthing/client';

const uploadRouter = createUploadthing();
export const { uploadFiles } = uploadRouter;  // Creates uploadFiles here
