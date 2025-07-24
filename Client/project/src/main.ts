import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { HeaderComponent } from './app/components/shared/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 80px);
      background: #fafafa;
    }
  `]
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      (req, next) => {
        const authService = new (class {
          getToken() { return localStorage.getItem('token'); }
        })();
        
        const token = authService.getToken();
        if (token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        
        return next(req);
      }
    ]))
  ]
});