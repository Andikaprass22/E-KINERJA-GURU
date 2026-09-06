import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "./uploadthing";

export const { useUploadThing, uploadFiles, createUpload } = generateReactHelpers<OurFileRouter>({
  url: "/api/uploadthing",
});

