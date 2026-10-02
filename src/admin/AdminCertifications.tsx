import { useEffect, useState } from 'react';
import { AdminPageHeader, AdminCard, Modal, FormField, SaveButton, AddButton, EditButton, DeleteButton, ImageUpload, FileUpload } from './AdminComponents';
import { useToast } from '@/hooks/useToast';
import { getCertifications, createCertification, updateCertification, deleteCertification } from '@/services/dataService';
import { uploadFile } from '@/lib/storage';
import type { Certification } from '@/types';

const emptyForm = { title: '', organization: '', issue_date: '', description: '', image_url: '', pdf_url: '', certificate_url: '', sort_order: 0 };

export function AdminCertifications() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Certification[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => getCertifications().then(setItems);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (c: Certification) => {
    setEditing(c);
    setForm({ title: c.title, organization: c.organization, issue_date: c.issue_date || '', description: c.description || '', image_url: c.image_url || '', pdf_url: c.pdf_url || '', certificate_url: c.certificate_url || '', sort_order: c.sort_order });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.organization) { showToast('Title and organization are required', 'error'); return; }
    setSaving(true);
    const { error } = editing ? await updateCertification(editing.id, form) : await createCertification(form);
    setSaving(false);
    if (error) { showToast('Failed to save', 'error'); return; }
    showToast(editing ? 'Updated' : 'Added', 'success');
    setModalOpen(false); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    const { error } = await deleteCertification(id);
    showToast(error ? 'Delete failed' : 'Deleted', error ? 'error' : 'success');
    load();
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const { url, error } = await uploadFile(file, 'portfolio-images', 'certifications');
    setUploading(false);
    if (error) { showToast('Upload failed', 'error'); return; }
    setForm({ ...form, image_url: url });
    showToast('Image uploaded', 'success');
  };

  const handlePdfUpload = async (file: File) => {
    setUploading(true);
    const { url, error } = await uploadFile(file, 'portfolio-documents', 'certifications');
    setUploading(false);
    if (error) { showToast('Upload failed', 'error'); return; }
    setForm({ ...form, pdf_url: url });
    showToast('PDF uploaded', 'success');
  };

  return (
    <div>
      <AdminPageHeader title="Certifications Management" description="Add, edit, and delete certifications" action={<AddButton onClick={openAdd} label="Add Certification" />} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <AdminCard key={c.id}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{c.title}</h3>
                <p className="text-sm text-primary-500">{c.organization}</p>
                {c.issue_date && <p className="text-xs text-slate-500 mt-1">{c.issue_date}</p>}
              </div>
              <div className="flex gap-1">
                <EditButton onClick={() => openEdit(c)} />
                <DeleteButton onClick={() => handleDelete(c.id)} />
              </div>
            </div>
            {c.image_url && <img src={c.image_url} alt={c.title} className="w-full h-32 object-cover rounded-lg mt-2" />}
          </AdminCard>
        ))}
        {items.length === 0 && <p className="text-center py-12 text-slate-500 col-span-full">No certifications yet.</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Certification' : 'Add Certification'}>
        <div className="space-y-5">
          <FormField label="Title" required>
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>
          <FormField label="Organization" required>
            <input className="input-field" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Issue Date">
              <input className="input-field" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} placeholder="e.g. March 2024" />
            </FormField>
            <FormField label="Sort Order">
              <input type="number" className="input-field" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </FormField>
          </div>
          <FormField label="Description">
            <textarea rows={3} className="input-field resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <FormField label="Certificate URL">
            <input className="input-field" value={form.certificate_url} onChange={(e) => setForm({ ...form, certificate_url: e.target.value })} placeholder="https://..." />
          </FormField>
          <ImageUpload label="Certificate Image" currentUrl={form.image_url} uploading={uploading} onUpload={handleImageUpload} />
          <FileUpload label="Certificate PDF" currentUrl={form.pdf_url} uploading={uploading} accept=".pdf" onUpload={handlePdfUpload} />
          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <SaveButton onClick={handleSave} saving={saving} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
