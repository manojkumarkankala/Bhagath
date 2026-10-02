import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AdminPageHeader, AdminCard, Modal, FormField, SaveButton, AddButton, EditButton, DeleteButton, ImageUpload, FileUpload, StringListEditor } from './AdminComponents';
import { useToast } from '@/hooks/useToast';
import { getProjects, createProject, updateProject, deleteProject } from '@/services/dataService';
import { uploadFile } from '@/lib/storage';
import type { Project } from '@/types';

const emptyForm = {
  title: '', description: '', technologies: [] as string[], images: [] as string[],
  video_url: '', github_url: '', live_url: '', pdf_url: '', project_date: '',
  features: [] as string[], status: 'completed', sort_order: 0,
};

export function AdminProjects() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageInput, setImageInput] = useState('');

  const load = () => getProjects().then(setItems);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description, technologies: p.technologies, images: p.images,
      video_url: p.video_url || '', github_url: p.github_url || '', live_url: p.live_url || '',
      pdf_url: p.pdf_url || '', project_date: p.project_date || '', features: p.features,
      status: p.status, sort_order: p.sort_order,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description) { showToast('Title and description are required', 'error'); return; }
    setSaving(true);
    const { error } = editing ? await updateProject(editing.id, form) : await createProject(form);
    setSaving(false);
    if (error) { showToast('Failed to save', 'error'); return; }
    showToast(editing ? 'Updated' : 'Added', 'success');
    setModalOpen(false); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const { error } = await deleteProject(id);
    showToast(error ? 'Delete failed' : 'Deleted', error ? 'error' : 'success');
    load();
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const { url, error } = await uploadFile(file, 'portfolio-images', 'projects');
    setUploading(false);
    if (error) { showToast('Upload failed', 'error'); return; }
    setForm({ ...form, images: [...form.images, url] });
    showToast('Image uploaded', 'success');
  };

  const handleVideoUpload = async (file: File) => {
    setUploading(true);
    const { url, error } = await uploadFile(file, 'portfolio-videos', 'projects');
    setUploading(false);
    if (error) { showToast('Upload failed', 'error'); return; }
    setForm({ ...form, video_url: url });
    showToast('Video uploaded', 'success');
  };

  const handlePdfUpload = async (file: File) => {
    setUploading(true);
    const { url, error } = await uploadFile(file, 'portfolio-documents', 'projects');
    setUploading(false);
    if (error) { showToast('Upload failed', 'error'); return; }
    setForm({ ...form, pdf_url: url });
    showToast('PDF uploaded', 'success');
  };

  const removeImage = (idx: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <AdminPageHeader title="Projects Management" description="Add, edit, and delete portfolio projects" action={<AddButton onClick={openAdd} label="Add Project" />} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <AdminCard key={p.id}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">{p.title}</h3>
              <div className="flex gap-1">
                <EditButton onClick={() => openEdit(p)} />
                <DeleteButton onClick={() => handleDelete(p.id)} />
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{p.description}</p>
            {p.images.length > 0 && <img src={p.images[0]} alt={p.title} className="w-full h-32 object-cover rounded-lg mt-2" />}
            <div className="flex flex-wrap gap-1 mt-2">
              {p.technologies.map((t) => <span key={t} className="px-2 py-0.5 rounded bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs">{t}</span>)}
            </div>
            <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold ${p.status === 'completed' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'}`}>{p.status}</span>
          </AdminCard>
        ))}
        {items.length === 0 && <p className="text-center py-12 text-slate-500 col-span-full">No projects yet.</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Add Project'}>
        <div className="space-y-5">
          <FormField label="Title" required>
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>
          <FormField label="Description" required>
            <textarea rows={4} className="input-field resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <StringListEditor label="Technologies" items={form.technologies} onChange={(technologies) => setForm({ ...form, technologies })} placeholder="e.g. Python, Machine Learning" />
          <StringListEditor label="Features / Key Contributions" items={form.features} onChange={(features) => setForm({ ...form, features })} placeholder="Add a feature..." />

          {/* Project images */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Project Images</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Project ${idx}`} className="w-full h-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1 rounded bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <ImageUpload label="Add Image" currentUrl={null} uploading={uploading} onUpload={handleImageUpload} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="GitHub URL">
              <input className="input-field" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
            </FormField>
            <FormField label="Live Demo URL">
              <input className="input-field" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." />
            </FormField>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <FormField label="Project Date">
              <input className="input-field" value={form.project_date} onChange={(e) => setForm({ ...form, project_date: e.target.value })} placeholder="e.g. 2024" />
            </FormField>
            <FormField label="Status">
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
            </FormField>
            <FormField label="Sort Order">
              <input type="number" className="input-field" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </FormField>
          </div>

          <ImageUpload label="Project Video" currentUrl={null} uploading={uploading} onUpload={handleVideoUpload} />
          {form.video_url && <p className="text-sm text-slate-500">Video uploaded. URL: {form.video_url}</p>}
          <FileUpload label="Project PDF" currentUrl={form.pdf_url} uploading={uploading} accept=".pdf" onUpload={handlePdfUpload} />

          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <SaveButton onClick={handleSave} saving={saving} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
