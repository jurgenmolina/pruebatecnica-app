import { Component, HostListener, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { User } from '../../model/user';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, map, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, NgClass, NgIf, MatMenuModule, MatDividerModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isHandset$: Observable<boolean>;
  routerActive: string = "activelink";
  search: boolean = false;
  userLoginOn: boolean = false;
  userData: User | null = null;
  isScrolled = false;

  constructor(
    private loginService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,

  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
        if (userLoginOn) {
          this.getUserData();
        } else {
          this.userData = null;
        }
      }
    });
  }

  private getUserData(): void {
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (error) => {
        console.error('Error al obtener los datos del usuario:', error);
        this.handleUserDataError(error);
      }
    });
  }

  private handleUserDataError(error: any): void {
    // Aquí puedes personalizar el manejo de errores según tus necesidades
    if (error.status === 401) {
      // Token inválido o expirado
      alert("La sesión ha caducado. Por favor, inicie sesión nuevamente.");
      this.logout();
    } else {
      // Otro tipo de error
      alert("Ha ocurrido un error al obtener los datos del usuario. Por favor, intente nuevamente.");
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }

  navigateToLogin() {
    this.router.navigate(['/iniciar-sesion']);
  }

 

}