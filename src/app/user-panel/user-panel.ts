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
  currentUserId: string | null = null;
  myBookedDeskIds: number[] = [];

  constructor(private router: Router, private deskService: DeskService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.checkIfAdmin();
    this.loadDesks()
    if (this.currentUserId) {
      this.loadMyBookings();
    }
  }

  checkIfAdmin() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
        
        this.isAdmin = (roleClaim === 'Admin');
        this.currentUserId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.nameid;
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
        this.loadMyBookings();
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
  loadMyBookings() {
    if (!this.currentUserId) return;

    this.deskService.getUserBookings(this.currentUserId).subscribe({
      next: (bookings) => {
        this.myBookedDeskIds = bookings.map(b => b.deskId || b.DeskId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Błąd pobierania rezerwacji użytkownika', err);
      }
    });
  }
  checkoutDesk(desk: Desk) {
    this.deskService.checkoutDesk(desk.id).subscribe({
      next: () => {
        this.reservedDeskMessage = `Zwolniono biurko nr ${desk.name}`;
        this.loadDesks();
        this.loadMyBookings(); 
        this.cdr.detectChanges();

        setTimeout(() => {
          this.reservedDeskMessage = null;
          this.cdr.detectChanges();
        }, 5000);
      },
      error: (err) => {
        console.error('Błąd zwalniania biurka', err);
        alert('Nie udało się zwolnić biurka.');
      }
    });
  }

  goToAdminPanel() {
    this.router.navigate(['/admin']);
  }
}
