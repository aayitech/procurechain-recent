import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BuyerCampaignPage } from '@/components/campaigns/BuyerCampaignPage';
import { BUYER_CAMPAIGNS, getBuyerCampaign } from '@/lib/buyer-campaigns';

export function generateStaticParams() {
  return BUYER_CAMPAIGNS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const campaign = getBuyerCampaign(params.slug);
  if (!campaign) return {};
  return { title: campaign.label, description: campaign.promise, openGraph: { title: campaign.title, description: campaign.promise } };
}

export default function BuyerCampaignLandingPage({ params }: { params: { slug: string } }) {
  const campaign = getBuyerCampaign(params.slug);
  if (!campaign) notFound();
  return <BuyerCampaignPage campaign={campaign} />;
}
