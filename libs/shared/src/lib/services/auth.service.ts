import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { Auth } from 'firebase/auth';
import type { User, UserRole } from '../types';

export class AuthService {
  constructor(private auth: Auth) {}

  async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Extract role from custom claims (would need to be set server-side)
        // For now, defaulting to 'viewer' - this should be enhanced with custom claims
        const role: UserRole =
          (firebaseUser as any).customClaims?.role || 'viewer';

        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined,
          role,
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }
}

