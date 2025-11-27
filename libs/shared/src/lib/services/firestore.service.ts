import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  QueryConstraint,
  Firestore,
} from 'firebase/firestore';

// Helper function to remove undefined values from an object
const removeUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
};

export class FirestoreService {
  constructor(private db: Firestore) {}

  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(this.db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }

  async getAll<T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    try {
      const q = query(collection(this.db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  async create<T extends { id?: string }>(
    collectionName: string,
    data: Omit<T, 'id'>
  ): Promise<T> {
    try {
      // Remove undefined values before sending to Firestore
      const cleanedData = removeUndefined(data);
      const docRef = await addDoc(collection(this.db, collectionName), {
        ...cleanedData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return { id: docRef.id, ...data } as T;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  async update<T>(
    collectionName: string,
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, id);
      // Remove undefined values before sending to Firestore
      const cleanedData = removeUndefined(data);
      await updateDoc(docRef, {
        ...cleanedData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }

  async query<T>(
    collectionName: string,
    constraints: QueryConstraint[]
  ): Promise<T[]> {
    try {
      const q = query(collection(this.db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  }
}

// Helper functions for common query constraints
export const firestoreHelpers = {
  where: (field: string, operator: any, value: any) =>
    where(field, operator, value),
  orderBy: (field: string, direction?: 'asc' | 'desc') =>
    orderBy(field, direction),
  limit: (count: number) => firestoreLimit(count),
};

