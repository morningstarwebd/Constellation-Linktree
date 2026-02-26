'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import ConstellationGroup from '@/components/ConstellationGroup';
import LinkModal from '@/components/LinkModal';
import { constellations } from '@/data/constellations';
import { ConstellationData } from '@/types';

// Three.js must be client-only, no SSR
const StarField = dynamic(() => import('@/components/StarField'), { ssr: false });

export default function Home() {
  const [activeConstellation, setActiveConstellation] = useState<ConstellationData | null>(null);

  return (
    <main className="relative w-screen h-screen overflow-hidden">

      {/* Layer 1: Background image */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 0,
          backgroundImage: "url('/bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Layer 2: Three.js star particles */}
      <StarField />

      {/* Layer 3: Constellations */}
      {constellations.map((c) => (
        <ConstellationGroup
          key={c.id}
          data={c}
          onOpenModal={() => setActiveConstellation(c)}
        />
      ))}

      {/* Layer 4: Modal */}
      <LinkModal
        constellation={activeConstellation}
        onClose={() => setActiveConstellation(null)}
      />

    </main>
  );
}
