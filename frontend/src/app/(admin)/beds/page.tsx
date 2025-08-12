"use client";
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Label } from '@/components/ui/label';
import { API_URL } from '@/lib/constants';

// Backend models
export type Bed = { id: string; roomId: string; bedNumber: string; status: 'VACANT'|'OCCUPIED'|'MAINTENANCE'; monthlyRent: number };
export type Room = { id: string; roomNumber: string };

export default function BedsPage() {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ roomId: '', bedNumber: '', status: 'VACANT', rent: 0 });

  const filtered = useMemo(
    () => beds.filter((b) => `${b.bedNumber} ${b.status}`.toLowerCase().includes(query.toLowerCase())),
    [beds, query]
  );

  const resetForm = () => {
    setForm({ roomId: '', bedNumber: '', status: 'VACANT', rent: 0 });
    setEditingId(null);
  };

  async function fetchRooms() {
    const res = await fetch(`${API_URL}/rooms?limit=1000`);
    const json = await res.json();
    if (json.success) setRooms(json.data.rooms.map((r: any) => ({ id: r.id, roomNumber: r.roomNumber })));
  }

  async function fetchBeds() {
    const res = await fetch(`${API_URL}/beds`);
    const json = await res.json();
    if (json.success) setBeds(json.data.beds);
  }

  useEffect(() => {
    fetchRooms();
    fetchBeds();
  }, []);

  const handleSubmit = async () => {
    if (!form.roomId || !form.bedNumber.trim()) return;
    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/beds/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bedNumber: form.bedNumber, status: form.status, monthlyRent: Number(form.rent) }),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        const res = await fetch(`${API_URL}/beds`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId: form.roomId, bedNumber: form.bedNumber, monthlyRent: Number(form.rent) }),
        });
        if (!res.ok) throw new Error(await res.text());
      }
      setShowForm(false);
      resetForm();
      await fetchBeds();
    } catch (e) {
      console.error('Failed to save bed', e);
      alert('Failed to save bed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Beds</h1>
          <p className="text-sm text-muted-foreground">Manage bed inventory</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm((s) => !s); }}>
          {showForm ? 'Close' : 'New Bed'}
        </Button>
      </div>
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); resetForm(); }}
        title={editingId ? 'Edit Bed' : 'Create Bed'}
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="roomId">Room</Label>
            <Select id="roomId" value={form.roomId} onChange={(e) => setForm((f) => ({ ...f, roomId: e.target.value }))}>
              <option value="">Select room</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>{r.roomNumber}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="bedNumber">Bed Number</Label>
              <Input id="bedNumber" value={form.bedNumber} onChange={(e) => setForm((f) => ({ ...f, bedNumber: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select id="status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                <option value="VACANT">VACANT</option>
                <option value="OCCUPIED">OCCUPIED</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rent">Monthly Rent</Label>
            <Input id="rent" type="number" min={0} value={form.rent} onChange={(e) => setForm((f) => ({ ...f, rent: Number(e.target.value) }))} />
          </div>
        </div>
      </Modal>
      <Card>
        <CardContent>
          <div className="mb-3">
            <Input placeholder="Search by bed number, room or status" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Table>
            <Thead>
              <Tr>
                <Th>Room</Th>
                <Th>Bed</Th>
                <Th>Status</Th>
                <Th>Monthly Rent</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((b) => (
                <Tr key={b.id}>
                  <Td>{rooms.find((r) => r.id === b.roomId)?.roomNumber || b.roomId}</Td>
                  <Td>{b.bedNumber}</Td>
                  <Td>
                    <span className="inline-flex items-center rounded border px-2 py-0.5 text-xs">{b.status}</span>
                  </Td>
                  <Td>₹{(b.monthlyRent ?? 0).toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
