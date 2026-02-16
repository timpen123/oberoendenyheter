import { postMakeWithUpload } from "@/modules/admin/articles/controllers/make-with-upload.controller";

export async function POST(request: Request) {
  return postMakeWithUpload(request);
}
