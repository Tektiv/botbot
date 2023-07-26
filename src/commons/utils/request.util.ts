import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import needle from 'needle';

type RequestOptions = Partial<{
  headers: Record<string, string>;
}>;

export class Request {
  static get(url: string, options: RequestOptions = {}): Observable<any> {
    return from(needle('get', url, { ...options, json: true })).pipe(map((result) => result.body));
  }

  static post(url: string, body: Record<string, any> = {}, options: RequestOptions = {}): Observable<any> {
    return from(needle('post', url, body, { ...options, json: true })).pipe(map((result) => result.body));
  }

  static put(url: string, body: Record<string, any> = {}, options: RequestOptions = {}): Observable<any> {
    return from(needle('put', url, body, { ...options, json: true })).pipe(map((result) => result.body));
  }
}
