export abstract class UnitOfWork {
  abstract beginTransaction(): Promise<void>;

  abstract commit(): Promise<void>;

  abstract rollback(): Promise<void>;
}
