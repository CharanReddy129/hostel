"use client";
import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Label } from '@/components/ui/label';
import { useHostelsStore } from '@/store/hostels-store';

const initialRooms = [
  { id: 'r1', hostel: 'Downtown Hostel', roomNumber: '201', floor: '2', type: 'DOUBLE', capacity: 2, occupied: 1 },
  { id: 'r2', hostel: 'City Center PG', roomNumber: '301', floor: '3', type: 'TRIPLE', capacity: 3, occupied: 2 },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState(initialRooms);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ hostel: '', roomNumber: '', floor: '', type: 'DOUBLE', capacity: 1 });
  const hostels = useHostelsStore((s) => s.hostels);

  const filtered = useMemo(
    () => rooms.filter((r) => `${r.hostel} ${r.roomNumber} ${r.type}`.toLowerCase().includes(query.toLowerCase())),
    [rooms, query]
  );

  const resetForm = () => {
    setForm({ hostel: '', roomNumber: '', floor: '', type: 'DOUBLE', capacity: 1 });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.hostel.trim() || !form.roomNumber.trim()) return;
    if (editingId) {
      setRooms((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
    } else {
      setRooms((prev) => [
        ...prev,
        {
          id: `r${prev.length + 1}`,
          hostel: form.hostel,
          roomNumber: form.roomNumber,
          floor: form.floor,
          type: form.type as any,
          capacity: Number(form.capacity) || 1,
          occupied: 0,
        },
      ]);
    }
    setShowForm(false);
    resetForm();
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
            <Select id="hostel" value={form.hostel} onChange={(e) => setForm((f) => ({ ...f, hostel: e.target.value }))}>
              <option value="">Select hostel</option>
              {hostels.map((h) => (
                <option key={h.id} value={h.name}>{h.name}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input id="roomNumber" value={form.roomNumber} onChange={(e) => setForm((f) => ({ ...f, roomNumber: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="floor">Floor</Label>
              <Input id="floor" value={form.floor} onChange={(e) => setForm((f) => ({ ...f, floor: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="type">Type</Label>
              <Select id="type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                <option value="SINGLE">SINGLE</option>
                <option value="DOUBLE">DOUBLE</option>
                <option value="TRIPLE">TRIPLE</option>
                <option value="DORMITORY">DORMITORY</option>
              </Select>
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
                <Th>Floor</Th>
                <Th>Type</Th>
                <Th>Capacity</Th>
                <Th>Occupied</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((r) => (
                <Tr key={r.id}>
                  <Td>{r.hostel}</Td>
                  <Td>{r.roomNumber}</Td>
                  <Td>{r.floor}</Td>
                  <Td>{r.type}</Td>
                  <Td>{r.capacity}</Td>
                  <Td>{r.occupied}</Td>
                  <Td>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(r.id);
                        setForm({ hostel: r.hostel, roomNumber: r.roomNumber, floor: r.floor, type: r.type as any, capacity: r.capacity });
                        setShowForm(true);
                      }}
                      className="h-8 px-3"
                    >
                      Edit
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


