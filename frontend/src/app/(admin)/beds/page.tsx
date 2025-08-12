"use client";
import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Label } from '@/components/ui/label';

const initialBeds = [
  { id: 'b1', room: '201', bedNumber: '201-A', status: 'OCCUPIED', rent: 10000 },
  { id: 'b2', room: '201', bedNumber: '201-B', status: 'VACANT', rent: 10000 },
  { id: 'b3', room: '301', bedNumber: '301-A', status: 'MAINTENANCE', rent: 12000 },
];

export default function BedsPage() {
  const [beds, setBeds] = useState(initialBeds);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ room: '', bedNumber: '', status: 'VACANT', rent: 0 });

  const filtered = useMemo(
    () => beds.filter((b) => `${b.room} ${b.bedNumber} ${b.status}`.toLowerCase().includes(query.toLowerCase())),
    [beds, query]
  );

  const resetForm = () => {
    setForm({ room: '', bedNumber: '', status: 'VACANT', rent: 0 });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.room.trim() || !form.bedNumber.trim()) return;
    if (editingId) {
      setBeds((prev) => prev.map((b) => (b.id === editingId ? { ...b, ...form } : b)));
    } else {
      setBeds((prev) => [
        ...prev,
        { id: `b${prev.length + 1}`, room: form.room, bedNumber: form.bedNumber, status: form.status as any, rent: Number(form.rent) || 0 },
      ]);
    }
    setShowForm(false);
    resetForm();
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
            <Label htmlFor="room">Room</Label>
            <Input id="room" value={form.room} onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))} />
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
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((b) => (
                <Tr key={b.id}>
                  <Td>{b.room}</Td>
                  <Td>{b.bedNumber}</Td>
                  <Td>
                    <span className="inline-flex items-center rounded border px-2 py-0.5 text-xs">{b.status}</span>
                  </Td>
                  <Td>₹{b.rent.toLocaleString()}</Td>
                  <Td>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(b.id);
                        setForm({ room: b.room, bedNumber: b.bedNumber, status: b.status as any, rent: b.rent });
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


