import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://b3nympfxi9.eu-central-1.awsapprunner.com/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      token = token.replace(/^"(.*)"$/, '$1').trim();
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/User`, { headers: this.getHeaders() });
  }

  addUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/User`, userData, { headers: this.getHeaders() });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/User/${userId}`, { headers: this.getHeaders() });
  }

  getRooms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Room`, { headers: this.getHeaders() });
  }

  addDesk(deskData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Desk`, deskData, { headers: this.getHeaders() });
  }

  deleteDesk(deskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Desk/${deskId}`, { headers: this.getHeaders() });
  }

  getDesks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Desk`, { headers: this.getHeaders() });
  }
}