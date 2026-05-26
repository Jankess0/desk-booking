import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-panel',
  imports: [],
  templateUrl: './user-panel.html',
  styleUrl: './user-panel.css',
})
export class UserPanel implements OnInit {
  isAdmin: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkIfAdmin();
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

  goToAdminPanel() {
    this.router.navigate(['/admin']);
  }
}
