export class VoteResponse {
  positive: number;
  negative: number;
  abstention: number;

  constructor(positive: number, negative: number, abstention: number) {
    this.positive = positive;
    this.negative = negative;
    this.abstention = abstention;
  }
}
