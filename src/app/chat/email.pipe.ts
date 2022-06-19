import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'emailPipe' })
export class EmailPipe implements PipeTransform {
    regularExpression: RegExp = /.*(?=@)/;

    transform(email: string) {
        return this.regularExpression.exec(String(email));
    }
}