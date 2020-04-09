import { Comment } from './comment';
import { Party } from './party';

export class Law {
  law_type: string;
  institution: string;
  tier: number;
  area: string[];
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
  positiveParties: Party[];
  negativeParties: Party[];
  abstentionParties: Party[];
  comments: Comment[];
}
