import { supabase } from './supabase';

export type StorageBucket = 'portfolio-images' | 'portfolio-videos' | 'portfolio-documents';

export function getBucketForFileType(file: File): StorageBucket {
  if (file.type.startsWith('image/')) return 'portfolio-images';
  if (file.type.startsWith('video/')) return 'portfolio-videos';
  return 'portfolio-documents';
}

export function getCategoryForFileType(file: File): string {
  if (file.type.startsWith('image/')) return 'images';
  if (file.type.startsWith('video/')) return 'videos';
  return 'documents';
}

export async function uploadFile(
  file: File,
  bucket: StorageBucket,
  folder: string = ''
): Promise<{ url: string; path: string; error: string | null }> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: false });

  if (error) {
    return { url: '', path: '', error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return { url: urlData.publicUrl, path: fileName, error: null };
}

export async function deleteFile(bucket: StorageBucket, path: string): Promise<{ error: string | null }> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return { error: error?.message ?? null };
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
