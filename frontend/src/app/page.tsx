import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="container py-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold">Hostel Admin Portal</h1>
        <p className="mt-3 text-muted-foreground">
          This build includes only the Admin-facing interface.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}


