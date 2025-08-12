import Link from 'next/link';

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/hostels', label: 'Hostels' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/beds', label: 'Beds' },
  { href: '/tenants', label: 'Tenants' },
  { href: '/notices', label: 'Notices' },
  { href: '/reports', label: 'Reports' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:block md:w-60 border-r bg-white">
      <nav className="p-4 space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}


