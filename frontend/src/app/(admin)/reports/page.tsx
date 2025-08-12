"use client";
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { API_URL } from '@/lib/constants';

// Models
type Hostel = { id: string; name: string };
type Room = { id: string; hostelId: string };
type Bed = { id: string; roomId: string; status: 'VACANT'|'OCCUPIED'|'MAINTENANCE'; monthlyRent?: number };

export default function ReportsPage() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [hRes, rRes, bRes] = await Promise.all([
          fetch(`${API_URL}/hostels?limit=1000`),
          fetch(`${API_URL}/rooms?limit=1000`),
          fetch(`${API_URL}/beds?limit=10000`),
        ]);
        const [h, r, b] = await Promise.all([hRes.json(), rRes.json(), bRes.json()]);
        if (h.success) setHostels(h.data.hostels);
        if (r.success) setRooms(r.data.rooms);
        if (b.success) setBeds(b.data.beds);
      } catch (e) {
        console.error('Failed to fetch reports data', e);
      }
    }
    fetchAll();
  }, []);

  const merged = useMemo(() => {
    const roomToHostel = new Map<string, string>();
    rooms.forEach((r) => roomToHostel.set(r.id, r.hostelId));
    const stats: Record<string, { name: string; total: number; occupied: number; revenue: number }> = {};
    hostels.forEach((h) => (stats[h.id] = { name: h.name, total: 0, occupied: 0, revenue: 0 }));
    beds.forEach((b) => {
      const hid = roomToHostel.get(b.roomId);
      if (!hid) return;
      const s = (stats[hid] ||= { name: hostels.find((h) => h.id === hid)?.name || hid, total: 0, occupied: 0, revenue: 0 });
      s.total += 1;
      if (b.status === 'OCCUPIED') {
        s.occupied += 1;
        s.revenue += Number(b.monthlyRent ?? 0);
      }
    });
    return Object.values(stats).map((s) => ({ hostel: s.name, occupancy: s.total ? Math.round((s.occupied / s.total) * 100) : 0, revenue: s.revenue }));
  }, [hostels, rooms, beds]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">Occupancy and revenue insights</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Occupancy by Hostel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={merged}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hostel" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="occupancy" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Hostel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={merged}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hostel" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
