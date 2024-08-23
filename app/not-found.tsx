'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.push('/?redirect=' + encodeURIComponent(window.location.pathname));
  }, [router]);

  return null;
}