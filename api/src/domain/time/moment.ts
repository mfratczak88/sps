export interface MomentInTime {
  toString(): string;
  isBefore(other: MomentInTime): boolean;
}
