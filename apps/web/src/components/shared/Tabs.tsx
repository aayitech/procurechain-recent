'use client';

import { useState } from 'react';

export interface TabDef {
  id: string;
  label: string;
  disabled?: boolean;
  content: React.ReactNode;
}

export function Tabs({ tabs }: { tabs: TabDef[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-border-subtle">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`relative px-3 py-2.5 text-sm transition-colors ${
              activeTab?.id === tab.id
                ? 'text-ink'
                : tab.disabled
                  ? 'text-ink-faint/60'
                  : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
            {tab.disabled && <span className="ml-1.5 text-[9px] uppercase text-ink-faint">soon</span>}
            {activeTab?.id === tab.id && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-6">{activeTab?.content}</div>
    </div>
  );
}
