"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';

const initialHostels = [
  { id: '1', name: 'Downtown Hostel', address: '123 Main St', totalBeds: 100, occupiedBeds: 85 },
  { id: '2', name: 'City Center PG', address: '456 Park Ave', totalBeds: 80, occupiedBeds: 62 },
  { id: '3', name: 'Riverside Hostel', address: '789 River Rd', totalBeds: 60, occupiedBeds: 43 },
];

export default function HostelsPage() {
  const [hostels, setHostels] = useState(initialHostels);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', address: '' });

  const resetForm = () => {
    setForm({ name: '', address: '' });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.address.trim()) return;
    if (editingId) {
      setHostels((prev) => prev.map((h) => (h.id === editingId ? { ...h, name: form.name, address: form.address } : h)));
    } else {
      setHostels((prev) => [
        ...prev,
        { id: String(prev.length + 1), name: form.name, address: form.address, totalBeds: 0, occupiedBeds: 0 },
      ]);
    }
    setShowForm(false);
    resetForm();
  };

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
                <Th>Beds</Th>
                <Th>Occupancy</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {hostels.map((h) => (
                <Tr key={h.id}>
                  <Td>{h.name}</Td>
                  <Td className="text-muted-foreground">{h.address}</Td>
                  <Td>{h.totalBeds}</Td>
                  <Td>{Math.round((h.occupiedBeds / h.totalBeds || 1) * 100)}%</Td>
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
              ))}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


