import { create } from 'zustand';

export type Hostel = { id: string; name: string; address: string; totalBeds: number; occupiedBeds: number };

type HostelsState = {
  hostels: Hostel[];
  setHostels: (hostels: Hostel[]) => void;
  addHostel: (hostel: Hostel) => void;
  updateHostel: (hostel: Hostel) => void;
};

export const useHostelsStore = create<HostelsState>((set) => ({
  hostels: [
    { id: '1', name: 'Downtown Hostel', address: '123 Main St', totalBeds: 100, occupiedBeds: 85 },
    { id: '2', name: 'City Center PG', address: '456 Park Ave', totalBeds: 80, occupiedBeds: 62 },
  ],
  setHostels: (hostels) => set({ hostels }),
  addHostel: (hostel) => set((state) => ({ hostels: [...state.hostels, hostel] })),
  updateHostel: (hostel) =>
    set((state) => ({ hostels: state.hostels.map((h) => (h.id === hostel.id ? { ...h, ...hostel } : h)) })),
}));


