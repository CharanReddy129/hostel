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

// Backend types
export type Room = { id: string; hostelId: string; roomNumber: string; capacity: number };
export type Hostel = { id: string; name: string };
export type Bed = { id: string; roomId: string; status: 'VACANT'|'OCCUPIED'|'MAINTENANCE' };

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ hostelId: '', roomNumber: '', capacity: 1 });

  const filtered = useMemo(
    () => rooms.filter((r) => `${r.roomNumber}`.toLowerCase().includes(query.toLowerCase())),
    [rooms, query]
  );

  const resetForm = () => {
    setForm({ hostelId: '', roomNumber: '', capacity: 1 });
    setEditingId(null);
  };

  async function fetchHostels() {
    const res = await fetch(`${API_URL}/hostels?limit=1000`);
    const json = await res.json();
    if (json.success) setHostels(json.data.hostels);
  }

  async function fetchRooms() {
    const res = await fetch(`${API_URL}/rooms?limit=1000`);
    const json = await res.json();
    if (json.success) setRooms(json.data.rooms);
  }

  async function fetchBeds() {
    const res = await fetch(`${API_URL}/beds?limit=10000`);
    const json = await res.json();
    if (json.success) setBeds(json.data.beds as Bed[]);
  }

  useEffect(() => {
    fetchHostels();
    fetchRooms();
    fetchBeds();
  }, []);

  const occupancyByRoom = useMemo(() => {
    const map: Record<string, { total: number; occ: number; vac: number }> = {};
    for (const b of beds) {
      const m = (map[b.roomId] ||= { total: 0, occ: 0, vac: 0 });
      m.total += 1;
      if (b.status === 'OCCUPIED') m.occ += 1;
      if (b.status === 'VACANT') m.vac += 1;
    }
    return map;
  }, [beds]);

  const handleSubmit = async () => {
    if (!form.hostelId || !form.roomNumber.trim()) return;
    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/rooms/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomNumber: form.roomNumber, capacity: Number(form.capacity) }),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        const res = await fetch(`${API_URL}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hostelId: form.hostelId, roomNumber: form.roomNumber, capacity: Number(form.capacity) }),
        });
        if (!res.ok) throw new Error(await res.text());
      }
      setShowForm(false);
      resetForm();
      await Promise.all([fetchRooms(), fetchBeds()]);
    } catch (e) {
      console.error('Failed to save room', e);
      alert('Failed to save room');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Rooms</h1>
          <p className="text-sm text-muted-foreground">Manage rooms across hostels</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm((s) => !s); }}>
          {showForm ? 'Close' : 'New Room'}
        </Button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          resetForm();
        }}
        title={editingId ? 'Edit Room' : 'Create Room'}
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="hostel">Hostel</Label>
            <Select id="hostel" value={form.hostelId} onChange={(e) => setForm((f) => ({ ...f, hostelId: e.target.value }))}>
              <option value="">Select hostel</option>
              {hostels.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input id="roomNumber" value={form.roomNumber} onChange={(e) => setForm((f) => ({ ...f, roomNumber: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" min={1} value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))} />
            </div>
          </div>
        </div>
      </Modal>

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Input placeholder="Search rooms by number, hostel or type" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Table>
            <Thead>
              <Tr>
                <Th>Hostel</Th>
                <Th>Room</Th>
                                <Th>Capacity</Th>
                <Th>Occupied</Th>
                <Th>Vacant</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((r) => {
                const o = occupancyByRoom[r.id] || { total: 0, occ: 0, vac: 0 };
                return (
                  <Tr key={r.id}>
                    <Td>{hostels.find((h) => h.id === r.hostelId)?.name || r.hostelId}</Td>
                    <Td>{r.roomNumber}</Td>
                                        <Td>{r.capacity}</Td>
                    <Td>{o.occ}</Td>
                    <Td>{o.vac}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
