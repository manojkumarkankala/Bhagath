import { useEffect, useState } from 'react';
import { Mail, Phone, Clock, CheckCircle, Circle, Trash2, MessageCircle, MailOpen } from 'lucide-react';
import { AdminPageHeader, AdminCard, Modal } from './AdminComponents';
import { useToast } from '@/hooks/useToast';
import { getMessages, markMessageRead, deleteMessage } from '@/services/dataService';
import type { ContactMessage } from '@/types';

export function AdminMessages() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = () => getMessages().then(setMessages);
  useEffect(() => { load(); }, []);

  const handleMarkRead = async (msg: ContactMessage) => {
    const newRead = !msg.is_read;
    const { error } = await markMessageRead(msg.id, newRead);
    if (error) { showToast('Failed to update', 'error'); return; }
    showToast(newRead ? 'Marked as read' : 'Marked as unread', 'success');
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    const { error } = await deleteMessage(id);
    if (error) { showToast('Delete failed', 'error'); return; }
    showToast('Message deleted', 'success');
    setSelected(null);
    load();
  };

  const formatDate = (date: string) => new Date(date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div>
      <AdminPageHeader title="Messages" description="View and manage contact form submissions" />
      <div className="space-y-3">
        {messages.map((msg) => (
          <AdminCard key={msg.id}>
            <div className="flex items-start gap-4">
              <button onClick={() => handleMarkRead(msg)} className="mt-1 flex-shrink-0">
                {msg.is_read ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-slate-400" />}
              </button>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { setSelected(msg); if (!msg.is_read) handleMarkRead(msg); }}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`font-bold ${msg.is_read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>{msg.name}</h3>
                  <span className="text-xs text-slate-500 flex items-center gap-1 flex-shrink-0"><Clock className="w-3 h-3" /> {formatDate(msg.created_at)}</span>
                </div>
                <p className="text-sm text-primary-500 mt-1">{msg.subject}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{msg.message}</p>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {msg.email}</span>
                  {msg.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {msg.phone}</span>}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="p-2 rounded-lg text-primary-500 hover:bg-primary-500/10" aria-label="Reply by email">
                  <MailOpen className="w-4 h-4" />
                </a>
                {msg.phone && (
                  <a href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-accent-500 hover:bg-accent-500/10" aria-label="Reply by WhatsApp">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => handleDelete(msg.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10" aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
        {messages.length === 0 && <p className="text-center py-12 text-slate-500">No messages yet.</p>}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Message Details">
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">From</p>
              <p className="font-bold text-lg">{selected.name}</p>
              <p className="text-sm text-primary-500">{selected.email}</p>
              {selected.phone && <p className="text-sm text-slate-500">{selected.phone}</p>}
            </div>
            <div>
              <p className="text-sm text-slate-500">Subject</p>
              <p className="font-semibold">{selected.subject}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Message</p>
              <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">{selected.message}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Received</p>
              <p className="text-sm">{formatDate(selected.created_at)}</p>
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-primary"><MailOpen className="w-4 h-4" /> Reply by Email</a>
              {selected.phone && (
                <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-accent"><MessageCircle className="w-4 h-4" /> Reply by WhatsApp</a>
              )}
              <button onClick={() => handleDelete(selected.id)} className="btn-secondary text-red-500"><Trash2 className="w-4 h-4" /> Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
