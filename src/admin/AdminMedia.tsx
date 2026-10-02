import { useEffect, useState } from 'react';
import { Upload, Trash2, Copy, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { AdminPageHeader, AdminCard } from './AdminComponents';
import { useToast } from '@/hooks/useToast';
import { getMedia, createMedia, deleteMedia } from '@/services/dataService';
import { uploadFile, formatFileSize, getBucketForFileType, getCategoryForFileType } from '@/lib/storage';
import type { MediaItem } from '@/types';

export function AdminMedia() {
  const { showToast } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = () => getMedia().then(setItems);
  useEffect(() => { load(); }, []);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const bucket = getBucketForFileType(file);
      const category = getCategoryForFileType(file);
      const { url, error } = await uploadFile(file, bucket, 'gallery');
      if (error) { showToast(`Failed to upload ${file.name}`, 'error'); continue; }
      await createMedia({ file_name: file.name, file_type: file.type, file_url: url, file_size: file.size, category });
    }
    setUploading(false);
    showToast('Upload complete', 'success');
    load();
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete ${item.file_name}?`)) return;
    const { error } = await deleteMedia(item.id);
    if (error) { showToast('Delete failed', 'error'); return; }
    showToast('Deleted', 'success');
    load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard', 'success');
  };

  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

  const getIcon = (category: string) => {
    if (category === 'images') return ImageIcon;
    if (category === 'videos') return Video;
    return FileText;
  };

  return (
    <div>
      <AdminPageHeader title="Media Library" description="Upload and manage images, videos, and documents" />

      {/* Upload area */}
      <AdminCard className="mb-6">
        <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
          <Upload className="w-10 h-10 text-primary-500" />
          <p className="text-sm text-slate-600 dark:text-slate-400">{uploading ? 'Uploading...' : 'Click to upload files (images, videos, PDFs)'}</p>
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf"
            className="hidden"
            onChange={(e) => { if (e.target.files?.length) handleUpload(e.target.files); e.target.value = ''; }}
          />
        </label>
      </AdminCard>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['all', 'images', 'videos', 'documents'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-primary-600 text-white' : 'glass hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const Icon = getIcon(item.category);
          return (
            <AdminCard key={item.id} className="p-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 flex items-center justify-center">
                {item.category === 'images' ? (
                  <img src={item.file_url} alt={item.file_name} className="w-full h-full object-cover" />
                ) : item.category === 'videos' ? (
                  <video src={item.file_url} className="w-full h-full object-cover" />
                ) : (
                  <Icon className="w-12 h-12 text-slate-400" />
                )}
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.file_name}</p>
              <p className="text-xs text-slate-500 mt-1">{formatFileSize(item.file_size)}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => copyUrl(item.file_url)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium glass hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Copy className="w-3 h-3" /> Copy URL
                </button>
                <button onClick={() => handleDelete(item)} className="flex items-center justify-center p-2 rounded-lg text-red-500 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </AdminCard>
          );
        })}
      </div>
      {filtered.length === 0 && <p className="text-center py-12 text-slate-500">No media files yet.</p>}
    </div>
  );
}
