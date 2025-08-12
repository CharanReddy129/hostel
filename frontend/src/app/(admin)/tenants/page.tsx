"use client";
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Label } from '@/components/ui/label';

const initialTenants = [
  { id: 't1', name: 'John Tenant', email: 'john@example.com', phone: '+1234567890', bed: '201-A', status: 'ACTIVE' },
  { id: 't2', name: 'Jane Doe', email: 'jane@example.com', phone: '+0987654321', bed: '301-B', status: 'INACTIVE' },
];

export default function TenantsPage() {
  const [tenants, setTenants] = useState(initialTenants);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', bed: '-', status: 'ACTIVE' });

  const filtered = useMemo(
    () => tenants.filter((t) => `${t.name} ${t.email} ${t.phone}`.toLowerCase().includes(query.toLowerCase())),
    [tenants, query]
  );

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', bed: '-', status: 'ACTIVE' });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editingId) {
      setTenants((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...form } : t)));
    } else {
      setTenants((prev) => [
        ...prev,
        { id: String(prev.length + 1), ...form },
      ]);
    }
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tenants</h1>
          <p className="text-sm text-muted-foreground">Manage tenants and check-ins</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm((s) => !s); }}>
          {showForm ? 'Close' : 'New Tenant'}
        </Button>
      </div>
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); resetForm(); }}
        title={editingId ? 'Edit Tenant' : 'Create Tenant'}
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bed">Bed</Label>
              <Input id="bed" value={form.bed} onChange={(e) => setForm((f) => ({ ...f, bed: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Input id="status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} />
          </div>
        </div>
      </Modal>
      <Card>
        <CardContent>
          <div className="mb-3">
            <Input placeholder="Search tenants by name, email or phone" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Bed</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((t) => (
                <Tr key={t.id}>
                  <Td>{t.name}</Td>
                  <Td className="text-muted-foreground">{t.email}</Td>
                  <Td>{t.phone}</Td>
                  <Td>{t.bed}</Td>
                  <Td>{t.status}</Td>
                  <Td>
                    <Button
                      variant="outline"
                      className="h-8 px-3"
                      onClick={() => {
                        setEditingId(t.id);
                        setForm({ name: t.name, email: t.email, phone: t.phone, bed: t.bed, status: t.status });
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


