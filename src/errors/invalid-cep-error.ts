import { ApplicationError } from '@/protocols';

export function invalidCEPError(cep: string): ApplicationCEPError {
  return {
    name: 'InvalidCEPError',
    cep: cep,
    message: `"${cep}" is not a valid CEP!`,
  };
}

export type ApplicationCEPError = ApplicationError & { cep: string };
