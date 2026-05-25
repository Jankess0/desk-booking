import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginData = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: (token) => {
        // Zapisujemy token, żeby potem dodawać go do kłódek (autoryzacji)
        localStorage.setItem('token', token);
        alert('Zalogowano pomyślnie!');
        
        // Dla uproszczenia: jeśli mail ma "admin", idziemy do panelu admina
        if (this.loginData.email.includes('admin')) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: (err) => {
        alert('Błąd logowania. Sprawdź dane.');
        console.error(err);
      }
    });
  }
}
