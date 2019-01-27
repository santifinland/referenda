import { Comment } from './comment';

export class Law {
  law_type: string;
  institution: string;
  tier: number;
  headline: string;
  slug: string;
  short_description: string;
  long_description: string;
  link: string;
  pub_date: Date;
  vote_start: Date;
  vote_end: Date;
  positive: number;
  negative: number;
  abstention: number;
  official_positive: number;
  official_negative: number;
  official_abstention: number;
  featured: boolean;
  positiveWidth: string;
  negativeWidth: string;
  abstentionWidth: string;
  officialPositiveWidth: string;
  officialNegativeWidth: string;
  officialAbstentionWidth: string;
  comments: Comment[];
}
