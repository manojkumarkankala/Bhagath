import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import { AdminPageHeader, AdminCard, Modal, FormField, SaveButton, AddButton, EditButton, DeleteButton, ImageUpload } from './AdminComponents';
import { useToast } from '@/hooks/useToast';
import { getAboutSections, createAbout, updateAbout, deleteAbout } from '@/services/dataService';
import { uploadFile } from '@/lib/storage';
import type { AboutSection } from '@/types';

const emptyForm = { title: '', content: '', image_url: '', video_url: '', sort_order: 0 };

export function AdminAbout() {
  const { showToast } = useToast();
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AboutSection | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => getAboutSections().then(setSections);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (s: AboutSection) => { setEditing(s); setForm({ title: s.title, content: s.content, image_url: s.image_url || '', video_url: s.video_url || '', sort_order: s.sort_order }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.title || !form.content) { showToast('Title and content are required', 'error'); return; }
    setSaving(true);
    const { error } = editing ? await updateAbout(editing.id, form) : await createAbout(form);
    setSaving(false);
    if (error) { showToast('Failed to save', 'error'); return; }
    showToast(editing ? 'Section updated' : 'Section added', 'success');
    setModalOpen(false); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this section?')) return;
    const { error } = await deleteAbout(id);
    showToast(error ? 'Delete failed' : 'Section deleted', error ? 'error' : 'success');
    load();
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const { url, error } = await uploadFile(file, 'portfolio-images', 'about');
    setUploading(false);
    if (error) { showToast('Upload failed', 'error'); return; }
    setForm({ ...form, image_url: url });
    showToast('Image uploaded', 'success');
  };

  return (
    <div>
      <AdminPageHeader title="About Management" description="Manage your about section content" action={<AddButton onClick={openAdd} label="Add Section" />} />
      <div className="space-y-4">
        {sections.map((s) => (
          <AdminCard key={s.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{s.content}</p>
                {s.image_url && <img src={s.image_url} alt={s.title} className="mt-3 w-32 h-32 object-cover rounded-lg" />}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <EditButton onClick={() => openEdit(s)} />
                <DeleteButton onClick={() => handleDelete(s.id)} />
              </div>
            </div>
          </AdminCard>
        ))}
        {sections.length === 0 && <p className="text-center py-12 text-slate-500">No sections yet. Click "Add Section" to create one.</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Section' : 'Add Section'}>
        <div className="space-y-5">
          <FormField label="Title" required>
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>
          <FormField label="Content" required>
            <textarea rows={5} className="input-field resize-none" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </FormField>
          <FormField label="Video URL">
            <input className="input-field" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://..." />
          </FormField>
          <FormField label="Sort Order">
            <input type="number" className="input-field" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
          </FormField>
          <ImageUpload label="Section Image" currentUrl={form.image_url} uploading={uploading} onUpload={handleImageUpload} />
          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <SaveButton onClick={handleSave} saving={saving} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
