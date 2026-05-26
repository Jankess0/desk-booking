import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DeskService, Desk } from './desk.service';

@Component({
  selector: 'app-user-panel',
  imports: [],
  templateUrl: './user-panel.html',
  styleUrl: './user-panel.css',
})
export class UserPanel implements OnInit {
  isAdmin: boolean = false;
  desks: Desk[] = [];

  constructor(private router: Router, private deskService: DeskService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.checkIfAdmin();
    this.loadDesks()
  }

  checkIfAdmin() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
        
        this.isAdmin = (roleClaim === 'Admin');
      } catch (e) {
        console.error('Błąd dekodowania tokena', e);
      }
    }
  }

loadDesks() {
    this.deskService.getDesks().subscribe({
      next: (data) => {
        this.desks = data;
        console.log('Biurka odebrane przez komponent:', data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Nie udało się pobrać biurek', err);
      }
    });
  }

  goToAdminPanel() {
    this.router.navigate(['/admin']);
  }
}
