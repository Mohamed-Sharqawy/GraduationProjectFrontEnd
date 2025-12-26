import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './Services/Auth-Service/auth-service';
import { Footer } from './Components/footer/footer';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HomeyUI');
  protected readonly authService = inject(AuthService);

  logout() {
    this.authService.logout();
    // Optional: Redirect to login or home after logout if needed, 
    // but the requirement just says "logout button to use to logout"
    // The auth service clears the signal which will update the UI.
  }
}
