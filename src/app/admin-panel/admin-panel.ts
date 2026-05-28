import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanel implements OnInit {
  users: any[] = [];
  desks: any[] = [];
  rooms: any[] = [];

  newUser = { email: '', password: '', firstName: '', lastName: '' };
  newDesk = { name: '', description: '', deskType: 'Standard', roomId: 0 };

  constructor(private adminService: AdminService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadUsers();
    this.loadDesks();
    this.loadRooms();
  }

loadUsers() {
    this.adminService.getUsers().subscribe(data => {
      this.users = data;
      this.cdr.detectChanges();
    });
  }

  loadDesks() {
    this.adminService.getDesks().subscribe(data => {
      this.desks = data;
      this.cdr.detectChanges(); 
    });
  }

  loadRooms() {
    this.adminService.getRooms().subscribe(data => {
      this.rooms = data;
      if (this.rooms.length > 0) {
        this.newDesk.roomId = this.rooms[0].id; 
      }
      this.cdr.detectChanges(); 
    });
  }

  addUser() {
    this.adminService.addUser(this.newUser).subscribe(() => {
      this.loadUsers(); 
      this.newUser = { email: '', password: '', firstName: '', lastName: '' }; 
    });
  }
  
  deleteUser(id: number) {
    if(confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      this.adminService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }

 
  addDesk() {
    this.newDesk.roomId = Number(this.newDesk.roomId); 
    
    this.adminService.addDesk(this.newDesk).subscribe(() => {
      this.loadDesks(); 
      this.newDesk = { name: '', description: '', deskType: 'Standard', roomId: this.rooms[0]?.id || 0 }; 
    });
  }
  
  deleteDesk(id: number) {
    if(confirm('Czy na pewno chcesz usunąć to biurko?')) {
      this.adminService.deleteDesk(id).subscribe(() => this.loadDesks());
    }
  }

  goBack() {
    this.router.navigate(['/user']);
  }
}