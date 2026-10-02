import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { AdminPageHeader, AdminCard, Modal, FormField, SaveButton, AddButton, EditButton, DeleteButton } from './AdminComponents';
import { useToast } from '@/hooks/useToast';
import { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '@/services/dataService';
import type { SocialLink } from '@/types';

const emptyForm = { platform: '', url: '', icon: '', sort_order: 0 };

export function AdminSocialLinks() {
  const { showToast } = useToast();
  const [items, setItems] = useState<SocialLink[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => getSocialLinks().then(setItems);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (s: SocialLink) => {
    setEditing(s);
    setForm({ platform: s.platform, url: s.url, icon: s.icon || '', sort_order: s.sort_order });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.platform || !form.url) { showToast('Platform and URL are required', 'error'); return; }
    setSaving(true);
    const { error } = editing ? await updateSocialLink(editing.id, form) : await createSocialLink(form);
    setSaving(false);
    if (error) { showToast('Failed to save', 'error'); return; }
    showToast(editing ? 'Updated' : 'Added', 'success');
    setModalOpen(false); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this social link?')) return;
    const { error } = await deleteSocialLink(id);
    showToast(error ? 'Delete failed' : 'Deleted', error ? 'error' : 'success');
    load();
  };

  return (
    <div>
      <AdminPageHeader title="Social Links" description="Manage your social media links" action={<AddButton onClick={openAdd} label="Add Link" />} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s) => (
          <AdminCard key={s.id}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{s.platform}</h3>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-500 hover:underline truncate block max-w-[200px]">{s.url}</a>
              </div>
              <div className="flex gap-1">
                <EditButton onClick={() => openEdit(s)} />
                <DeleteButton onClick={() => handleDelete(s.id)} />
              </div>
            </div>
          </AdminCard>
        ))}
        {items.length === 0 && <p className="text-center py-12 text-slate-500 col-span-full">No social links yet. Add your LinkedIn, GitHub, etc.</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Link' : 'Add Link'}>
        <div className="space-y-5">
          <FormField label="Platform" required>
            <input className="input-field" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="LinkedIn, GitHub, Instagram, YouTube, etc." />
          </FormField>
          <FormField label="URL" required>
            <input className="input-field" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Icon (text)">
              <input className="input-field" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Optional" />
            </FormField>
            <FormField label="Sort Order">
              <input type="number" className="input-field" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </FormField>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <SaveButton onClick={handleSave} saving={saving} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
