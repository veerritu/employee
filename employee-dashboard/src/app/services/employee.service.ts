import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee.model';
import { EmployeeData } from '../models/employee-data';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  employees: Employee[];

  constructor(private http: HttpClient, ) { }
  apiurl = 'api/users';
  headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  httpOptions = {
    headers: this.headers
  };

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }

  getAllEmployees(): Observable<any> {
    return this.http.get<EmployeeData[]>(this.apiurl).pipe(
      tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }

  addEmployee(user: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiurl, user, this.httpOptions).pipe(
      tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }

  updateEmployee(user: Employee): Observable<Employee>{
    const url = `${this.apiurl}/${user.id}`;
    return this.http.put<Employee>(this.apiurl, user, this.httpOptions).pipe(
      map(() => user),
      catchError(this.handleError)
    );
  }

  deleteEmployee(id: number): Observable<Employee> {
    const url = `${this.apiurl}/${id}`;
    return this.http.delete<Employee>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
