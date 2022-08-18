import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { appDataSource } from 'src/data-source';
import {
  DataSource,
  EntityNotFoundError,
  getConnection,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export function Exists(
  entityClass: any,
  field = 'id',
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Exists',
      constraints: [entityClass, field],
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'Exists', async: true })
export class ExistsRule implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    if (!value) {
      return false;
    }
    try {
      const [entityClass, field] = args.constraints;
      let repository: Repository<ObjectLiteral>;
      if (!appDataSource.isInitialized) {
        const db = await appDataSource.initialize();
        repository = db.getRepository(entityClass);
      } else {
        repository = appDataSource.getRepository(entityClass);
      }

      const result = await repository.findOneBy({
        [field]: value,
      });
      if (!result) {
        throw new EntityNotFoundError(entityClass, value);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} not found`;
  }
}
