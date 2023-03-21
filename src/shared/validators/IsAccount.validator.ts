import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isEmail,
  isMobilePhone,
  isString,
} from 'class-validator';

export function isAccount(value: string): boolean {
  return isString(value) || isMobilePhone(value) || isEmail(value);
}

@ValidatorConstraint()
export class IsAccount implements ValidatorConstraintInterface {
  validate(value: string, validationArguments?: ValidationArguments): boolean {
    return isAccount(value);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return '账户必须是手机号、邮箱、用户名';
  }
}
