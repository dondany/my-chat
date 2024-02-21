import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../data-access/auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const afAuth = inject(AngularFireAuth);

  return afAuth.authState.pipe(
    map((user) => {
      if (!user) {
        router.navigate(['auth/login']);
        return false;
      }
      return true;
    })
  );
};
