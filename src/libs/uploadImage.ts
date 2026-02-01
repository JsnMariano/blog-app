import { supabase } from "./supabase";

export async function uploadImage(
  file: File,
  bucket: string
): Promise<string> {
  const filePath = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
