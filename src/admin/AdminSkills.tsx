import { useEffect, useState } from 'react';
import { AdminPageHeader, AdminCard, Modal, FormField, SaveButton, AddButton, EditButton, DeleteButton } from './AdminComponents';
import { useToast } from '@/hooks/useToast';
import { getSkills, createSkill, updateSkill, deleteSkill } from '@/services/dataService';
import type { Skill } from '@/types';

const emptyForm = { name: '', category: '', proficiency: 0, icon: '', sort_order: 0 };

export function AdminSkills() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Skill[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => getSkills().then(setItems);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (s: Skill) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, proficiency: s.proficiency, icon: s.icon || '', sort_order: s.sort_order });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.category) { showToast('Name and category are required', 'error'); return; }
    setSaving(true);
    const { error } = editing ? await updateSkill(editing.id, form) : await createSkill(form);
    setSaving(false);
    if (error) { showToast('Failed to save', 'error'); return; }
    showToast(editing ? 'Updated' : 'Added', 'success');
    setModalOpen(false); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    const { error } = await deleteSkill(id);
    showToast(error ? 'Delete failed' : 'Deleted', error ? 'error' : 'success');
    load();
  };

  const grouped = items.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div>
      <AdminPageHeader title="Skills Management" description="Add, edit, and delete technical skills" action={<AddButton onClick={openAdd} label="Add Skill" />} />
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, skills]) => (
          <div key={category}>
            <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-200">{category}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((s) => (
                <AdminCard key={s.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{s.name}</span>
                    <div className="flex gap-1">
                      <EditButton onClick={() => openEdit(s)} />
                      <DeleteButton onClick={() => handleDelete(s.id)} />
                    </div>
                  </div>
                  {s.proficiency > 0 && (
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${s.proficiency}%` }} />
                    </div>
                  )}
                  {s.proficiency > 0 && <p className="mt-1 text-xs text-slate-500">{s.proficiency}%</p>}
                </AdminCard>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center py-12 text-slate-500">No skills yet.</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill' : 'Add Skill'}>
        <div className="space-y-5">
          <FormField label="Skill Name" required>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Category" required>
            <input className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Programming Languages, Soft Skills, etc." />
          </FormField>
          <FormField label="Proficiency (%)">
            <input type="range" min="0" max="100" className="w-full" value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) })} />
            <span className="text-sm text-slate-500">{form.proficiency}%</span>
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
