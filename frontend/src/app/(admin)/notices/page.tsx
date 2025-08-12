"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { API_URL } from '@/lib/constants';

// Backend models
type Notice = { id: string; hostelId: string; title: string; content: string; priority: 'LOW'|'MEDIUM'|'HIGH'; createdAt?: string };
type Hostel = { id: string; name: string };

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', priority: 'MEDIUM', hostelId: '' });

  async function fetchHostels() {
    try {
      const res = await fetch(`${API_URL}/hostels?limit=1000`);
      const json = await res.json();
      if (json.success) setHostels(json.data.hostels);
    } catch (e) {
      console.error('Failed to fetch hostels', e);
    }
  }

  async function fetchNotices() {
    try {
      const res = await fetch(`${API_URL}/notices`);
      const json = await res.json();
      if (json.success) setNotices(json.data.notices);
    } catch (e) {
      console.error('Failed to fetch notices', e);
    }
  }

  useEffect(() => {
    fetchHostels();
    fetchNotices();
  }, []);

  const resetForm = () => {
    setForm({ title: '', content: '', priority: 'MEDIUM', hostelId: hostels[0]?.id ?? '' });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.hostelId) return;
    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/notices/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: form.title, content: form.content, priority: form.priority }),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        const res = await fetch(`${API_URL}/notices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: form.title, content: form.content, priority: form.priority, hostelId: form.hostelId }),
        });
        if (!res.ok) throw new Error(await res.text());
      }
      setShowForm(false);
      resetForm();
      await fetchNotices();
    } catch (e) {
      console.error('Failed to save notice', e);
      alert('Failed to save notice');
    }
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
              <Select id="hostel" value={form.hostelId} onChange={(e) => setForm((f) => ({ ...f, hostelId: e.target.value }))}>
                <option value="">Select hostel</option>
                {hostels.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
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
        {notices.length === 0 ? (
          <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">No notices</div>
        ) : (
          notices.map((n) => (
            <div key={n.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{n.title}</h2>
                  <p className="text-sm text-muted-foreground">{hostels.find((h) => h.id === n.hostelId)?.name || n.hostelId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded border px-2 py-0.5 text-xs">{n.priority}</span>
                  <Button
                    variant="outline"
                    className="h-8 px-3"
                    onClick={() => {
                      setEditingId(n.id);
                      setForm({ title: n.title, content: n.content, priority: n.priority, hostelId: n.hostelId });
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{n.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
