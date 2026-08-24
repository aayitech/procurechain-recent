export type ResourceType = 'Guide' | 'Article' | 'PDF' | 'Video';

export interface KnowledgeResource {
  title: string;
  source: string;
  type: ResourceType;
  url: string;
  whatYouWillLearn: string;
  whyItMatters: string;
  verifiedAt: string;
}

export interface LearningPathStep {
  title: string;
  detail: string;
}

export interface RelatedTool {
  label: string;
  href: string;
}

export interface LearningPathListEntry {
  slug: string;
  title: string;
  objective: string;
  relatedDimension: string;
  resourceCount: number;
  comingSoon: boolean;
}

export interface LearningPathDetail {
  slug: string;
  title: string;
  objective: string;
  whoItIsFor: string;
  whenToUseIt: string;
  steps: LearningPathStep[];
  commonMistakes: string[];
  relatedTools: RelatedTool[];
  relatedDimension: string;
  resources: KnowledgeResource[];
}

export interface RecommendedPath {
  slug: string;
  title: string;
  objective: string;
}
