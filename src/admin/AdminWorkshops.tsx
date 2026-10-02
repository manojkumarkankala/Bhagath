import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AdminPageHeader, AdminCard, Modal, FormField, SaveButton, AddButton, EditButton, DeleteButton, ImageUpload, FileUpload } from './AdminComponents';
import { useToast } from '@/hooks/useToast';
import { getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop } from '@/services/dataService';
import { uploadFile } from '@/lib/storage';
import type { Workshop } from '@/types';

const emptyForm = { title: '', organizer: '', date: '', description: '', images: [] as string[], video_url: '', certificate_url: '', sort_order: 0 };

export function AdminWorkshops() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Workshop[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Workshop | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => getWorkshops().then(setItems);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (w: Workshop) => {
    setEditing(w);
    setForm({ title: w.title, organizer: w.organizer || '', date: w.date || '', description: w.description || '', images: w.images, video_url: w.video_url || '', certificate_url: w.certificate_url || '', sort_order: w.sort_order });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) { showToast('Title is required', 'error'); return; }
    setSaving(true);
    const { error } = editing ? await updateWorkshop(editing.id, form) : await createWorkshop(form);
    setSaving(false);
    if (error) { showToast('Failed to save', 'error'); return; }
    showToast(editing ? 'Updated' : 'Added', 'success');
    setModalOpen(false); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this workshop?')) return;
    const { error } = await deleteWorkshop(id);
    showToast(error ? 'Delete failed' : 'Deleted', error ? 'error' : 'success');
    load();
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const { url } = await uploadFile(file, 'portfolio-images', 'workshops');
    setUploading(false);
    if (url) { setForm({ ...form, images: [...form.images, url] }); showToast('Image uploaded', 'success'); }
  };

  const handleVideoUpload = async (file: File) => {
    setUploading(true);
    const { url } = await uploadFile(file, 'portfolio-videos', 'workshops');
    setUploading(false);
    if (url) { setForm({ ...form, video_url: url }); showToast('Video uploaded', 'success'); }
  };

  const handleCertUpload = async (file: File) => {
    setUploading(true);
    const { url } = await uploadFile(file, 'portfolio-documents', 'workshops');
    setUploading(false);
    if (url) { setForm({ ...form, certificate_url: url }); showToast('Certificate uploaded', 'success'); }
  };

  const removeImage = (idx: number) => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });

  return (
    <div>
      <AdminPageHeader title="Workshops Management" description="Add, edit, and delete workshops" action={<AddButton onClick={openAdd} label="Add Workshop" />} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((w) => (
          <AdminCard key={w.id}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">{w.title}</h3>
              <div className="flex gap-1">
                <EditButton onClick={() => openEdit(w)} />
                <DeleteButton onClick={() => handleDelete(w.id)} />
              </div>
            </div>
            {w.organizer && <p className="text-sm text-primary-500">{w.organizer}</p>}
            {w.date && <p className="text-xs text-slate-500 mt-1">{w.date}</p>}
            {w.images.length > 0 && <img src={w.images[0]} alt={w.title} className="w-full h-32 object-cover rounded-lg mt-2" />}
          </AdminCard>
        ))}
        {items.length === 0 && <p className="text-center py-12 text-slate-500 col-span-full">No workshops yet.</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Workshop' : 'Add Workshop'}>
        <div className="space-y-5">
          <FormField label="Title" required>
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>
          <FormField label="Organizer">
            <input className="input-field" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Date">
              <input className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. March 2024" />
            </FormField>
            <FormField label="Sort Order">
              <input type="number" className="input-field" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </FormField>
          </div>
          <FormField label="Description">
            <textarea rows={3} className="input-field resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Workshop Images</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Workshop ${idx}`} className="w-full h-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1 rounded bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <ImageUpload label="Add Image" currentUrl={null} uploading={uploading} onUpload={handleImageUpload} />
          </div>

          <ImageUpload label="Workshop Video" currentUrl={null} uploading={uploading} onUpload={handleVideoUpload} />
          {form.video_url && <p className="text-sm text-slate-500">Video uploaded</p>}
          <FileUpload label="Workshop Certificate" currentUrl={form.certificate_url} uploading={uploading} onUpload={handleCertUpload} />

          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <SaveButton onClick={handleSave} saving={saving} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
