import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ToLowerCasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || value === null) return value;

    for (const key of Object.keys(value)) {
      if (typeof value[key] === 'string') {
        value[key] = value[key].toLocaleLowerCase();
      }
    }
    return value;
  }
}
