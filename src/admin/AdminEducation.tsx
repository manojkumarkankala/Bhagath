import { useEffect, useState } from 'react';
import { AdminPageHeader, AdminCard, Modal, FormField, SaveButton, AddButton, EditButton, DeleteButton, ImageUpload } from './AdminComponents';
import { useToast } from '@/hooks/useToast';
import { getEducation, createEducation, updateEducation, deleteEducation } from '@/services/dataService';
import { uploadFile } from '@/lib/storage';
import type { Education } from '@/types';

const emptyForm = { degree: '', institution: '', start_year: '', end_year: '', gpa: '', logo_url: '', description: '', sort_order: 0 };

export function AdminEducation() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Education[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => getEducation().then(setItems);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (e: Education) => {
    setEditing(e);
    setForm({ degree: e.degree, institution: e.institution, start_year: e.start_year, end_year: e.end_year, gpa: e.gpa || '', logo_url: e.logo_url || '', description: e.description || '', sort_order: e.sort_order });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.degree || !form.institution || !form.start_year) { showToast('Degree, institution, and start year are required', 'error'); return; }
    setSaving(true);
    const { error } = editing ? await updateEducation(editing.id, form) : await createEducation(form);
    setSaving(false);
    if (error) { showToast('Failed to save', 'error'); return; }
    showToast(editing ? 'Updated' : 'Added', 'success');
    setModalOpen(false); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this education record?')) return;
    const { error } = await deleteEducation(id);
    showToast(error ? 'Delete failed' : 'Deleted', error ? 'error' : 'success');
    load();
  };

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    const { url, error } = await uploadFile(file, 'portfolio-images', 'education');
    setUploading(false);
    if (error) { showToast('Upload failed', 'error'); return; }
    setForm({ ...form, logo_url: url });
    showToast('Logo uploaded', 'success');
  };

  return (
    <div>
      <AdminPageHeader title="Education Management" description="Add, edit, and delete education records" action={<AddButton onClick={openAdd} label="Add Education" />} />
      <div className="space-y-4">
        {items.map((e) => (
          <AdminCard key={e.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{e.degree}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{e.institution}</p>
                <p className="text-sm text-primary-500 font-medium mt-1">{e.start_year} – {e.end_year} {e.gpa && `| GPA: ${e.gpa}`}</p>
              </div>
              <div className="flex gap-2">
                <EditButton onClick={() => openEdit(e)} />
                <DeleteButton onClick={() => handleDelete(e.id)} />
              </div>
            </div>
          </AdminCard>
        ))}
        {items.length === 0 && <p className="text-center py-12 text-slate-500">No education records yet.</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Education' : 'Add Education'}>
        <div className="space-y-5">
          <FormField label="Degree" required>
            <input className="input-field" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
          </FormField>
          <FormField label="Institution" required>
            <input className="input-field" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Start Year" required>
              <input className="input-field" value={form.start_year} onChange={(e) => setForm({ ...form, start_year: e.target.value })} />
            </FormField>
            <FormField label="End Year" required>
              <input className="input-field" value={form.end_year} onChange={(e) => setForm({ ...form, end_year: e.target.value })} />
            </FormField>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="GPA">
              <input className="input-field" value={form.gpa} onChange={(e) => setForm({ ...form, gpa: e.target.value })} placeholder="7.1/10" />
            </FormField>
            <FormField label="Sort Order">
              <input type="number" className="input-field" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </FormField>
          </div>
          <FormField label="Description">
            <textarea rows={3} className="input-field resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <ImageUpload label="Institution Logo" currentUrl={form.logo_url} uploading={uploading} onUpload={handleLogoUpload} />
          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <SaveButton onClick={handleSave} saving={saving} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
