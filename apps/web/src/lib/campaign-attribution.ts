const ATTRIBUTION_KEY = 'procurechain-campaign-attribution';
const ATTRIBUTION_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export type CampaignAttribution = Record<string, string>;

/** Capture campaign context without replacing the first campaign that brought a visitor in. */
export function captureCampaignAttribution(search: string, campaign?: string): CampaignAttribution {
  if (typeof window === 'undefined') return {};

  let saved: CampaignAttribution = {};
  try {
    saved = JSON.parse(window.localStorage.getItem(ATTRIBUTION_KEY) || '{}') as CampaignAttribution;
  } catch {
    saved = {};
  }
  const capturedAt = Number(saved.captured_at);
  if (capturedAt && Date.now() - capturedAt > ATTRIBUTION_MAX_AGE_MS) saved = {};

  const params = new URLSearchParams(search);
  const current: CampaignAttribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) current[key] = value.slice(0, 200);
  }

  const campaignName = params.get('campaign')?.trim() || campaign;
  if (campaignName) current.campaign_name = campaignName.slice(0, 100);

  const firstTouch = Object.fromEntries(
    Object.entries(current).filter(([key]) => key.startsWith('utm_')),
  );
  if (Object.keys(firstTouch).length > 0) {
    for (const [key, value] of Object.entries(firstTouch)) {
      if (!saved[key]) saved[key] = value;
      saved[`last_touch_${key}`] = value;
    }
  }
  if (campaignName) {
    saved.first_campaign_name ||= campaignName.slice(0, 100);
    saved.campaign_name = campaignName.slice(0, 100);
  }
  if (Object.keys(saved).length > 0) saved.captured_at = String(Date.now());

  try {
    window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(saved));
  } catch {
    // Attribution is best effort and must never block an asset or form.
  }
  return saved;
}

export function getCampaignAttribution(): CampaignAttribution {
  if (typeof window === 'undefined') return {};
  try {
    const saved = JSON.parse(window.localStorage.getItem(ATTRIBUTION_KEY) || '{}') as CampaignAttribution;
    const capturedAt = Number(saved.captured_at);
    if (capturedAt && Date.now() - capturedAt > ATTRIBUTION_MAX_AGE_MS) {
      window.localStorage.removeItem(ATTRIBUTION_KEY);
      return {};
    }
    return saved;
  } catch {
    return {};
  }
}

export function leadAttributionFields(attribution: CampaignAttribution, asset: string, campaign?: string): CampaignAttribution {
  return {
    ...attribution,
    ...(campaign ? { campaign_name: campaign } : {}),
    ...(attribution.campaign_name ? {} : { campaign_name: 'organic' }),
    asset_entered_through: asset,
    landing_page: typeof window === 'undefined' ? '' : window.location.pathname,
  };
}
