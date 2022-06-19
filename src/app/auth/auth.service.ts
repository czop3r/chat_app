import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Subject } from 'rxjs';

import { User } from './user';
import { AuthData } from './auth-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new BehaviorSubject<boolean>(false);
  user: User;
  userId: string;
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private af: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  registerUser(authData: AuthData) {
    this.afAuth
    .createUserWithEmailAndPassword(authData.email, authData.password)
    .then(result => {
      const user: User = {
        email: authData.email,
        userId: result.user.uid,
        dateCreate: new Date(),
        status: true
      }
      this.af.collection('users').doc(result.user.uid).set(user);
      localStorage.setItem('chatData', JSON.stringify(user));
      this.onLoginSuccessfully();
      this.router.navigate(['/chat']);
      })
      .catch(error => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        const user: User = {
          email: result.user.email,
          userId: result.user.uid,
          status: true,
          token: result.user.refreshToken
        }
        this.userId = result.user.uid
        localStorage.setItem('chatData', JSON.stringify(user));
        // this.user.next(user);
        this.onLoginSuccessfully();
        this.router.navigate(['/chat']);
      })
      .catch(error => {
        console.log(error);
      });
  }

  onLoginSuccessfully() {
    this.user = JSON.parse(localStorage.getItem('chatData'));
    // this.af.collection('users').doc(this.userId).update({status: true});
    this.authChange.next(true);
    this.isAuthenticated = true;
  }

  onAutoLogin(): void {
    const user: User = JSON.parse(localStorage.getItem('chatData'));
    if(!user) {
      return;
    }

    this.user = JSON.parse(localStorage.getItem('chatData'));

    if(user.token) {
      this.userId = user.userId;
      this.authChange.next(true);
      // this.user.next(user);
      this.isAuthenticated = true;
    }
  }

  onLogout() {
    localStorage.removeItem('chatData');
    // this.af.collection('users').doc(this.userId).update({status: false});
    this.authChange.next(false);
    // this.user.next(null);
    this.router.navigate(['/']);
    this.isAuthenticated = false;
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }

  getToken() {
    this.afAuth.idTokenResult.subscribe(
      sub => console.log(sub)
    )
  }

}
