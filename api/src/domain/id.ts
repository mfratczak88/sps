export type Id = string;
export abstract class IdGenerator {
  abstract generate(): Promise<Id>;
}
