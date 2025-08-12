"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const occupancyData = Array.from({ length: 14 }).map((_, i) => ({
  date: `Day ${i + 1}`,
  occupancy: Math.round(70 + Math.random() * 25),
}));

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your organization</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Hostels', value: 3 },
          { label: 'Total Rooms', value: 120 },
          { label: 'Occupied Beds', value: 310 },
          { label: 'Vacant Beds', value: 42 },
        ].map((card) => (
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
            <CardTitle>Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyData} margin={{ left: -15, right: 10 }}>
                  <defs>
                    <linearGradient id="occ" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
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
              <li>John Tenant checked in to 201-A</li>
              <li>Notice posted for Downtown Hostel</li>
              <li>2 rooms updated by Admin</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}


