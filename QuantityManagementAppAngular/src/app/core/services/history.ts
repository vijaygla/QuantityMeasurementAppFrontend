import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, orderBy, Timestamp } from '@angular/fire/firestore';
import { AuthService } from './auth';

export interface CalculationHistory {
  userId: string;
  type: string;
  action: string;
  value1: number;
  fromUnit: string;
  value2: number;
  toUnit: string;
  result: string | number;
  timestamp: any; // Can be Timestamp or { seconds, nanoseconds }
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private firestore: Firestore = inject(Firestore);
  private auth: AuthService = inject(AuthService);

  async addHistory(data: Omit<CalculationHistory, 'userId' | 'timestamp'>) {
    const user = this.auth.user();
    if (!user) {
      console.warn("User not logged in, cannot save history");
      return;
    }

    try {
      const historyRef = collection(this.firestore, 'history');
      const docData = {
        ...data,
        userId: user.uid,
        timestamp: Timestamp.now()
      };
      console.log("Attempting to save to Firestore:", docData);
      const docRef = await addDoc(historyRef, docData);
      console.log("History saved successfully with ID:", docRef.id);
    } catch (err) {
      console.error("CRITICAL: Firestore Save Error:", err);
      // Let the user know via a standard alert for now so we can see the error
      alert("Database Error: " + (err as any).message);
      throw err;
    }
  }

  async getHistory() {
    const user = this.auth.user();
    if (!user) return [];

    try {
      const historyRef = collection(this.firestore, 'history');
      // Note: If this fails, you may need to create an index in Firebase console.
      // If it fails, I'll fallback to sorting in memory.
      const q = query(
        historyRef,
        where('userId', '==', user.uid)
      );
      
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => doc.data() as CalculationHistory);
      
      // Sort in memory to avoid index requirement issues for now
      return results.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
    } catch (err) {
      console.error("Error fetching history:", err);
      return [];
    }
  }
}
