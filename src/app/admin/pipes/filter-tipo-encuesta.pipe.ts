import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTipoEncuesta',
  pure: false
})
export class FilterTipoEncuestaPipe implements PipeTransform {

  transform(respuestas: any[], filter: string): any {
    if (!respuestas || !filter) {
      return respuestas;
    }
    const array = respuestas.filter(item => item.identificador == filter);
    const preguntasKey = 'pregunta';
    const preguntasUniqueByKey = [...new Map(array.map(item => [item[preguntasKey], item])).values()];
    return preguntasUniqueByKey;
  }

}
