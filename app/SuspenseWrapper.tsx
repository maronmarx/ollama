'use client';

import React, { Suspense } from 'react';
import Home from '../components/Home';
export default function acceuil() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  );
}
