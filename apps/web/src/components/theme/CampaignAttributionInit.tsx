'use client';

import { useEffect } from 'react';
import { captureCampaignAttribution } from '@/lib/campaign-attribution';

export function CampaignAttributionInit() {
  useEffect(() => {
    captureCampaignAttribution(window.location.search);
  }, []);

  return null;
}
