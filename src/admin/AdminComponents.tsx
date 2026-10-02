import { useState, type ReactNode } from 'react';
import { Save, Trash2, Plus, X, Edit3 } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}

interface AdminCardProps {
  children: ReactNode;
  className?: string;
}

export function AdminCard({ children, className = '' }: AdminCardProps) {
  return <div className={`glass-card p-6 ${className}`}>{children}</div>;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 glass border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
}

export function FormField({ label, children, required }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

interface SaveButtonProps {
  onClick: () => void;
  saving?: boolean;
  label?: string;
}

export function SaveButton({ onClick, saving, label = 'Save' }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <Save className="w-4 h-4" />
      {saving ? 'Saving...' : label}
    </button>
  );
}

interface DeleteButtonProps {
  onClick: () => void;
  label?: string;
}

export function DeleteButton({ onClick, label = 'Delete' }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
      {label}
    </button>
  );
}

interface AddButtonProps {
  onClick: () => void;
  label?: string;
}

export function AddButton({ onClick, label = 'Add New' }: AddButtonProps) {
  return (
    <button onClick={onClick} className="btn-primary">
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

interface EditButtonProps {
  onClick: () => void;
}

export function EditButton({ onClick }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-500/10 transition-colors"
    >
      <Edit3 className="w-4 h-4" />
      Edit
    </button>
  );
}

interface ImageUploadProps {
  onUpload: (file: File) => void;
  currentUrl?: string | null;
  label?: string;
  uploading?: boolean;
}

export function ImageUpload({ onUpload, currentUrl, label = 'Upload Image', uploading }: ImageUploadProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">{label}</label>
      <div className="flex items-center gap-4">
        {currentUrl && (
          <img src={currentUrl} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
        )}
        <label className="cursor-pointer btn-secondary">
          {uploading ? 'Uploading...' : 'Choose File'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </div>
  );
}

interface FileUploadProps {
  onUpload: (file: File) => void;
  currentUrl?: string | null;
  label?: string;
  uploading?: boolean;
  accept?: string;
}

export function FileUpload({ onUpload, currentUrl, label = 'Upload File', uploading, accept = '*' }: FileUploadProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">{label}</label>
      <div className="flex items-center gap-4">
        {currentUrl && (
          <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-500 hover:underline">
            View current file
          </a>
        )}
        <label className="cursor-pointer btn-secondary">
          {uploading ? 'Uploading...' : 'Choose File'}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </div>
  );
}

interface StringListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholder?: string;
}

export function StringListEditor({ items, onChange, label, placeholder = 'Add item...' }: StringListEditorProps) {
  const [input, setInput] = useState('');

  const addItem = () => {
    if (input.trim()) {
      onChange([...items, input.trim()]);
      setInput('');
    }
  };

  const removeItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">{label}</label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
          className="input-field"
          placeholder={placeholder}
        />
        <button type="button" onClick={addItem} className="btn-secondary flex-shrink-0">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 p-3 rounded-lg glass">
            <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{item}</span>
            <button type="button" onClick={() => removeItem(idx)} className="p-1 rounded hover:bg-red-500/10 text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
