"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useHostelsStore } from '@/store/hostels-store';

const initialNotices = [
  { id: 'n1', title: 'Maintenance Notice', content: 'Water supply interruption on Sunday', priority: 'HIGH', hostel: 'Downtown Hostel' },
  { id: 'n2', title: 'New Rules', content: 'Updated hostel rules effective next week', priority: 'MEDIUM', hostel: 'City Center PG' },
];

export default function NoticesPage() {
  const [notices, setNotices] = useState(initialNotices);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', priority: 'MEDIUM', hostel: 'Downtown Hostel' });
  const hostels = useHostelsStore((s) => s.hostels);

  const resetForm = () => {
    setForm({ title: '', content: '', priority: 'MEDIUM', hostel: 'Downtown Hostel' });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    if (editingId) {
      setNotices((prev) => prev.map((n) => (n.id === editingId ? { ...n, ...form } : n)));
    } else {
      setNotices((prev) => [...prev, { id: String(prev.length + 1), ...form }]);
    }
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notices</h1>
          <p className="text-sm text-muted-foreground">Create and manage announcements</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm((s) => !s); }}>
          {showForm ? 'Close' : 'New Notice'}
        </Button>
      </div>
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          resetForm();
        }}
        title={editingId ? 'Edit Notice' : 'Create Notice'}
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Publish'}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hostel">Hostel</Label>
              <Select id="hostel" value={form.hostel} onChange={(e) => setForm((f) => ({ ...f, hostel: e.target.value }))}>
                {hostels.map((h) => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="content">Content</Label>
            <Input id="content" value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
          </div>
        </div>
      </Modal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((n) => (
          <div key={n.id} className="rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-medium">{n.title}</h2>
                <p className="text-sm text-muted-foreground">{n.hostel}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded border px-2 py-0.5 text-xs">{n.priority}</span>
                <Button
                  variant="outline"
                  className="h-8 px-3"
                  onClick={() => {
                    setEditingId(n.id);
                    setForm({ title: n.title, content: n.content, priority: n.priority, hostel: n.hostel });
                    setShowForm(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


