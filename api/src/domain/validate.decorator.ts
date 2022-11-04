import { validateSync, ValidationError } from 'class-validator';
import 'reflect-metadata';
import { MessageCode, MessageSourceArea } from '../message';
import { BaseException } from '../error';

export const Validate = (ctor: any) => {
  const originalCtor = ctor;
  const constructorDecorator: any = function (...args: any[]) {
    const instance = new originalCtor(...args);
    const validationErrors = validateSync(instance);

    if (validationErrors.length) {
      const errors = validationErrors.flatMap((error: ValidationError) =>
        Object.values({ o: error.constraints as any }),
      );
      throw new ValidationException(
        MessageCode.VALIDATION_ERROR,
        ctor.name,
        errors,
      );
    }
    return instance;
  };
  constructorDecorator.prototype = originalCtor.prototype;
  return constructorDecorator;
};

export class ValidationException extends BaseException {
  constructor(messageKey: MessageCode, clazz: string, errors?: string[]) {
    super({
      messageKey: messageKey || MessageCode.VALIDATION_ERROR,
      sourceArea: MessageSourceArea.VALIDATION,
      args: {
        errors: errors?.join(','),
        clazz,
      },
    });
  }
}
