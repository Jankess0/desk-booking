import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Desk {
  id: number;
  name: string;
  description: string;
  status: string;
  deskType: string;
  roomNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeskService {
  private apiUrl = 'https://b3nympfxi9.eu-central-1.awsapprunner.com/api/Desk'; 

  constructor(private http: HttpClient) { }

  getDesks(): Observable<Desk[]> {
    let token = localStorage.getItem('token');
    
    let headers = new HttpHeaders();
    if (token) {
      token = token.replace(/^"(.*)"$/, '$1');
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<Desk[]>(this.apiUrl, { headers });
  }

  reserveDesk(deskId: number): Observable<any> {
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    
    if (token) {
      token = token.replace(/^"(.*)"$/, '$1').trim();
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const url = `https://b3nympfxi9.eu-central-1.awsapprunner.com/api/Desk/${deskId}/checkin`;
    
    return this.http.post(url, {}, { headers });
  }
  
}