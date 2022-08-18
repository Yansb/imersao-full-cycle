import {
  buildMessage,
  min,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function MinCallback(
  callback: () => number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'MinCallback',
      constraints: [callback],
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [callback] = args.constraints;
          return typeof value === 'number' && min(value, callback());
        },
        defaultMessage: buildMessage(
          (eachPrefix, args) =>
            `${eachPrefix}$property must be greater than ${args.constraints[0]}`,
          validationOptions,
        ),
      },
    });
  };
}
