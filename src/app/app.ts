import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './Services/Auth-Service/auth-service';
import { Footer } from './Components/footer/footer';
import { UserRole } from './Models/user-role';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HomeyUI');
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  /**
   * Check if current user is an Agent
   */
  isAgent(): boolean {
    return this.authService.currentUser()?.role === UserRole.Agent;
  }

  /**
   * Check if current user is an Owner
   */
  isOwner(): boolean {
    return this.authService.currentUser()?.role === UserRole.Owner;
  }
}
