import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service'; 
import { take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(AuthService);
  const router = inject(Router);

  let userLoginOn: boolean = false;

  loginService.currentUserLoginOn.pipe(take(1)).subscribe({
    next: (isLoggedIn) => {
      userLoginOn = isLoggedIn;
    }
  });
  
  if (userLoginOn) {
    return true;
  } else {
    router.navigate(['/iniciar-sesion']);
    return false;
  }
};
