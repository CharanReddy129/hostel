"use client";
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { API_URL } from '@/lib/constants';

// Types aligned with backend responses
// GET /api/v1/tenants returns TenantStay with include { user, bed }
type TenantStay = {
  id: string;
  status: 'ACTIVE' | 'COMPLETED';
  checkInDate: string;
  checkOutDate?: string | null;
  user: { id: string; firstName: string; lastName: string; email: string; phone?: string | null };
  bed: { id: string; bedNumber: string };
};

// GET /api/v1/rooms -> Room list
type Room = { id: string; roomNumber: string };
// GET /api/v1/beds -> Bed list
type Bed = { id: string; bedNumber: string; monthlyRent?: number };

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantStay[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', roomId: '', bedId: '', checkInDate: '' });

  const fullName = (t: TenantStay) => `${t.user.firstName} ${t.user.lastName}`.trim();

  const filtered = useMemo(
    () =>
      tenants.filter((t) =>
        `${fullName(t)} ${t.user.email} ${t.user.phone ?? ''} ${t.bed.bedNumber}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [tenants, query]
  );

  const resetForm = () => {
    setForm({ firstName: '', lastName: '', email: '', phone: '', roomId: '', bedId: '', checkInDate: '' });
    setBeds([]);
  };

  async function fetchTenants() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tenants`);
      const json = await res.json();
      if (json.success) {
        setTenants(json.data.tenants as TenantStay[]);
      } else {
        console.error('Failed to fetch tenants', json);
      }
    } catch (e) {
      console.error('Error fetching tenants', e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRooms() {
    try {
      const res = await fetch(`${API_URL}/rooms?limit=1000`);
      const json = await res.json();
      if (json.success) {
        const list = (json.data.rooms as any[]).map((r) => ({ id: r.id, roomNumber: r.roomNumber })) as Room[];
        setRooms(list);
      }
    } catch (e) {
      console.error('Error fetching rooms', e);
    }
  }

  function selectedBed() {
    return beds.find((b) => b.id === form.bedId);
  }

  async function fetchBedsForRoom(roomId: string) {
    if (!roomId) {
      setBeds([]);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/beds?limit=1000&roomId=${encodeURIComponent(roomId)}&status=VACANT`);
      const json = await res.json();
      if (json.success) {
        const list = (json.data.beds as any[]).map((b) => ({ id: b.id, bedNumber: b.bedNumber, monthlyRent: b.monthlyRent })) as Bed[];
        setBeds(list);
      } else {
        setBeds([]);
      }
    } catch (e) {
      console.error('Error fetching beds', e);
      setBeds([]);
    }
  }

  useEffect(() => {
    fetchTenants();
    fetchRooms();
  }, []);

  // When room changes, reset bed and load only VACANT beds for that room
  useEffect(() => {
    if (form.roomId) {
      setForm((f) => ({ ...f, bedId: '' }));
      fetchBedsForRoom(form.roomId);
    } else {
      setBeds([]);
      setForm((f) => ({ ...f, bedId: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.roomId]);

  async function handleCreate() {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.bedId || !form.roomId) return;
    try {
      const res = await fetch(`${API_URL}/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone || undefined,
          bedId: form.bedId,
          checkInDate: form.checkInDate || undefined,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        alert(`Failed to create tenant: ${msg}`);
        return;
      }
      setShowForm(false);
      resetForm();
      await fetchTenants();
    } catch (e) {
      console.error('Create tenant failed', e);
      alert('Failed to create tenant');
    }
  }

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
        title="Create Tenant"
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="roomId">Room</Label>
              <Select id="roomId" value={form.roomId} onChange={(e) => setForm((f) => ({ ...f, roomId: e.target.value }))}>
                <option value="">Select a room</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>{r.roomNumber}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bedId">Bed</Label>
              <Select id="bedId" value={form.bedId} onChange={(e) => setForm((f) => ({ ...f, bedId: e.target.value }))} disabled={!form.roomId}>
                <option value="">{form.roomId ? 'Select a bed' : 'Select a room first'}</option>
                {beds.length === 0 && form.roomId ? (
                  <option value="" disabled>No vacant beds available</option>
                ) : (
                  beds.map((b) => (
                    <option key={b.id} value={b.id}>{b.bedNumber}</option>
                  ))
                )}
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="checkInDate">Check-in date</Label>
            <Input id="checkInDate" type="date" value={form.checkInDate} onChange={(e) => setForm((f) => ({ ...f, checkInDate: e.target.value }))} />
          </div>
          {form.bedId && (
            <div className="text-sm text-muted-foreground">Monthly Rent: ₹{(selectedBed()?.monthlyRent ?? 0).toLocaleString()}</div>
          )}
        </div>
      </Modal>

      <Card>
        <CardContent>
          <div className="mb-3">
            <Input placeholder="Search tenants by name, email, phone or bed number" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Bed</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr><Td colSpan={5}>Loading...</Td></Tr>
              ) : filtered.length === 0 ? (
                <Tr><Td colSpan={5}>No tenants</Td></Tr>
              ) : (
                filtered.map((t) => (
                  <Tr key={t.id}>
                    <Td>{fullName(t)}</Td>
                    <Td className="text-muted-foreground">{t.user.email}</Td>
                    <Td>{t.user.phone || '-'}</Td>
                    <Td>{t.bed.bedNumber}</Td>
                    <Td>{t.status}</Td>
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
