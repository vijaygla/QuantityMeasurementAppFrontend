import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  
  private authUser$ = user(this.auth);
  user = toSignal(this.authUser$);

  constructor() {}

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Google Sign-In Error', err);
    }
  }

  async login(email: string, pass: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, pass);
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Login Error', err);
      throw err;
    }
  }

  async register(email: string, pass: string) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, pass);
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Register Error', err);
      throw err;
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/']);
  }
}
