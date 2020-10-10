import { Injectable } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UiService } from './shared/ui.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuth = false;
  authChange = new Subject<boolean>();
  firestoreAuthSub: Subscription;

  constructor(
    private router: Router,
    private firestoreAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService
  ) {}

  initAuthListener(): void {
    // method that can be used to listen to any change in the authentication status which is called in ngOninit of AppComponent
    this.firestoreAuthSub = this.firestoreAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuth = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelAllFirebaseSubOnSignout();
        this.isAuth = false;
        this.authChange.next(false);
        // this.router.navigate(['/']);
      }
    });
  }
  registerUser(authData: AuthData): void {
    this.uiService.loadingStateChanged.next(true); // start spinner
    this.firestoreAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
        console.log(error);
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }
  login(authData: AuthData): void {
    this.uiService.loadingStateChanged.next(true);
    this.firestoreAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
        console.log(error);
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }
  logout(): void {
    this.firestoreAuth.signOut();
    this.router.navigate(['/']);
  }
  isAuthenticated(): boolean {
    return this.isAuth;
  }
  cancelFirestoreAuthSub(): void {
    if (this.firestoreAuthSub) {
      this.firestoreAuthSub.unsubscribe();
    }
  }
}
