import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IForm} from "./form.model";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get<IForm[]>('https://jsonplaceholder.typicode.com/posts');
  }

  editData(id: number, value) {
    return this.http.put('https://jsonplaceholder.typicode.com/posts/' + id, value);
  }

  deleteData(id: number) {
    return this.http.delete('https://jsonplaceholder.typicode.com/posts/' + id, {});
  }
}
