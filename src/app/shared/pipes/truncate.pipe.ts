import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

    transform(value: string | undefined, limit: number) {
        if (!value) return '';

        if (value.length <= limit) {
            return value;
        } else {
            return value.substring(0, limit) + '...';
        }
    }

}