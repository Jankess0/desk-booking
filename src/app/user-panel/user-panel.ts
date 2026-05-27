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
  reservedDeskMessage: string | null = null;

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

  reserveDesk(desk: Desk) {
    this.deskService.reserveDesk(desk.id).subscribe({
      next: () => {
        this.reservedDeskMessage = `Masz zarezerwowany stolik nr ${desk.name}`;
        
        this.loadDesks();
        
        this.cdr.detectChanges();

        setTimeout(() => {
          this.reservedDeskMessage = null;
          this.cdr.detectChanges();
        }, 5000);
      },
      error: (err) => {
        console.error('Błąd rezerwacji', err);
        alert('Nie udało się zarezerwować biurka. Spróbuj ponownie.');
      }
    });
  }
  

  goToAdminPanel() {
    this.router.navigate(['/admin']);
  }
}
