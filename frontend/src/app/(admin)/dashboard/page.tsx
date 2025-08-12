"use client";
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { API_URL } from '@/lib/constants';

// Backend models (partial)
type Hostel = { id: string; name: string };
type Room = { id: string; hostelId: string; roomNumber: string };
type Bed = { id: string; roomId: string; bedNumber: string; status: 'VACANT'|'OCCUPIED'|'MAINTENANCE' };
type TenantStay = { id: string; createdAt?: string; bed: { bedNumber: string }; user: { firstName: string; lastName: string } };
type Notice = { id: string; title: string; createdAt?: string };

export default function DashboardPage() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [tenants, setTenants] = useState<TenantStay[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  async function fetchAll() {
    try {
      const [hRes, rRes, bRes, tRes, nRes] = await Promise.all([
        fetch(`${API_URL}/hostels?limit=1000`),
        fetch(`${API_URL}/rooms?limit=1000`),
        fetch(`${API_URL}/beds?limit=10000`),
        fetch(`${API_URL}/tenants?limit=5`),
        fetch(`${API_URL}/notices?limit=5`),
      ]);
      const [h, r, b, t, n] = await Promise.all([hRes.json(), rRes.json(), bRes.json(), tRes.json(), nRes.json()]);
      if (h.success) setHostels(h.data.hostels);
      if (r.success) setRooms(r.data.rooms);
      if (b.success) setBeds(b.data.beds);
      if (t.success) setTenants(t.data.tenants);
      if (n.success) setNotices(n.data.notices);
    } catch (e) {
      console.error('Failed to fetch dashboard data', e);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const stats = useMemo(() => {
    const occupied = beds.filter((b) => b.status === 'OCCUPIED').length;
    const vacant = beds.filter((b) => b.status === 'VACANT').length;
    return [
      { label: 'Total Hostels', value: hostels.length },
      { label: 'Total Rooms', value: rooms.length },
      { label: 'Occupied Beds', value: occupied },
      { label: 'Vacant Beds', value: vacant },
    ];
  }, [hostels, rooms, beds]);

  const occupancyByHostel = useMemo(() => {
    const roomToHostel = new Map<string, string>();
    rooms.forEach((r) => roomToHostel.set(r.id, r.hostelId));

    const counts: Record<string, { total: number; occ: number; name: string }> = {};
    hostels.forEach((h) => (counts[h.id] = { total: 0, occ: 0, name: h.name }));
    beds.forEach((b) => {
      const hostelId = roomToHostel.get(b.roomId);
      if (!hostelId) return;
      counts[hostelId] = counts[hostelId] || { total: 0, occ: 0, name: hostels.find((h) => h.id === hostelId)?.name || hostelId };
      counts[hostelId].total += 1;
      if (b.status === 'OCCUPIED') counts[hostelId].occ += 1;
    });
    return Object.values(counts).map((c) => ({ name: c.name, occupancy: c.total ? Math.round((c.occ / c.total) * 100) : 0 }));
  }, [hostels, rooms, beds]);

  const recentActivity = useMemo(() => {
    const noticesList = notices.map((n) => ({ type: 'notice' as const, text: n.title }));
    const tenantsList = tenants.map((t) => ({ type: 'tenant' as const, text: `${t.user.firstName} ${t.user.lastName} checked in to ${t.bed.bedNumber}` }));
    return [...noticesList, ...tenantsList].slice(0, 6);
  }, [notices, tenants]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your organization</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card) => (
          <Card key={card.label}>
            <CardContent>
              <div className="text-sm text-muted-foreground">{card.label}</div>
              <div className="mt-2 text-2xl font-semibold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Occupancy by Hostel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyByHostel} margin={{ left: -15, right: 10 }}>
                  <defs>
                    <linearGradient id="occ" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="occupancy" stroke="#2563eb" fillOpacity={1} fill="url(#occ)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {recentActivity.length === 0 ? (
                <li>No recent activity</li>
              ) : (
                recentActivity.map((a, idx) => <li key={idx}>{a.text}</li>)
              )}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
