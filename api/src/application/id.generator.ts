import { Id } from './id';

export abstract class IdGenerator {
  abstract generate(): Promise<Id>;
}
