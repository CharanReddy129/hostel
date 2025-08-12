"use client";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { API_URL } from '@/lib/constants';

type Hostel = { id: string; name: string; address: string };

type ListResponse = { success: boolean; data: { hostels: Hostel[]; pagination: any } };

type CreatePayload = { name: string; address: string; contactInfo?: any };

export default function HostelsPage() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(false);

  async function fetchHostels() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/hostels`);
      const json: ListResponse = await res.json();
      if (json.success) setHostels(json.data.hostels);
    } catch (e) {
      console.error('Failed to fetch hostels', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHostels();
  }, []);

  const resetForm = () => {
    setForm({ name: '', address: '' });
    setEditingId(null);
  };

  async function handleSubmit() {
    if (!form.name.trim() || !form.address.trim()) return;
    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/hostels/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, address: form.address }),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        const res = await fetch(`${API_URL}/hostels`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, address: form.address } as CreatePayload),
        });
        if (!res.ok) {
          let msg = 'Failed to save hostel';
          try {
            const data = await res.json();
            msg = data?.error?.message || data?.message || msg;
          } catch {}
          throw new Error(msg);
        }
      }
      setShowForm(false);
      resetForm();
      await fetchHostels();
    } catch (e: any) {
      console.error('Submit hostel failed', e);
      alert(e?.message || 'Failed to save hostel');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hostels</h1>
          <p className="text-sm text-muted-foreground">Manage properties in your organization</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm((s) => !s); }}>
          {showForm ? 'Close' : 'New Hostel'}
        </Button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); resetForm(); }}
        title={editingId ? 'Edit Hostel' : 'Create Hostel'}
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input placeholder="Hostel name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        </div>
      </Modal>

      <Card>
        <CardContent>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Address</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr><Td colSpan={3}>Loading...</Td></Tr>
              ) : hostels.length === 0 ? (
                <Tr><Td colSpan={3}>No hostels</Td></Tr>
              ) : (
                hostels.map((h) => (
                  <Tr key={h.id}>
                    <Td>{h.name}</Td>
                    <Td className="text-muted-foreground">{h.address}</Td>
                    <Td>
                      <Button
                        variant="outline"
                        className="h-8 px-3"
                        onClick={() => {
                          setEditingId(h.id);
                          setForm({ name: h.name, address: h.address });
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
