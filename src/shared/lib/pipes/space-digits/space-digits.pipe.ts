import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceDigits'
})
export class SpaceDigitsPipe implements PipeTransform {

  transform(number: string): string {
      return new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0 }).format(
          +number,
      );
  }

}
