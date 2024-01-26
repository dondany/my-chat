import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../data-access/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, switchMap } from 'rxjs';


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
