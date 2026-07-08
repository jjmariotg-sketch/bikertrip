import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { 
  initializeFirestore, 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";

// The config from firebase-applet-config.json
const firebaseConfig = {
  projectId: "ai-studio-applet-webapp-d0caa",
  appId: "1:1011555219842:web:3c1644d5167d76cae3b79b",
  apiKey: "AIzaSyBhIDFpGDHF5eOScvRUb-2HAn_R--arOOI",
  authDomain: "ai-studio-applet-webapp-d0caa.firebaseapp.com",
  storageBucket: "ai-studio-applet-webapp-d0caa.firebasestorage.app",
  messagingSenderId: "1011555219842"
};

// Initialize firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// In AI Studio, we need to handle specific Firestore DB if firestoreDatabaseId is provided
let db;
try {
  db = getFirestore(app, "ai-studio-bikertrip-199f0f1f-854f-441b-af0a-d17a6f83600e");
} catch (e) {
  try {
    db = initializeFirestore(app, {
      databaseId: "ai-studio-bikertrip-199f0f1f-854f-441b-af0a-d17a6f83600e"
    } as any);
  } catch (err) {
    db = getFirestore(app);
  }
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  app, 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
};

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Types for Trips and Bookings
export interface Trip {
  id?: string;
  name: string;
  days: number;
  difficulty: "Iniciación" | "Intermedio" | "Media" | "Avanzado" | "Duro" | "Fácil";
  price: number;
  bookedSeats: number;
  totalSeats: number;
  image: string;
  description: string;
  location: string;
  startDate?: string;
  featured?: boolean;
  duration?: string;
  distance?: string;
  bookedByUserIds?: string[];
  startLocationName?: string;
  startLatLng?: { lat: number; lng: number };
  endLocationName?: string;
  endLatLng?: { lat: number; lng: number };
}

export interface Booking {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  tripId: string;
  tripName: string;
  bookingDate: string;
  status: "Confirmado" | "Pendiente" | "Cancelado";
  seats: number;
  priceTotal: number;
}

export interface Review {
  id?: string;
  tripId: string;
  tripName: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  ratingRoute: number; // 1 to 5 stars
  ratingGuide: number; // 1 to 5 stars
  comment: string;
  createdAt: string;
}

// Initial seed trips: Only the administrator-configured single route as requested
export const INITIAL_TRIPS: Trip[] = [
  {
    name: "Alpujarra",
    days: 1,
    difficulty: "Media",
    price: 120,
    bookedSeats: 0,
    totalSeats: 6,
    location: "Alpujarra",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800",
    description: "Espectacular ruta por la Alpujarra granadina. Curvas infinitas, asfalto impecable y vistas majestuosas a Sierra Nevada. Distancia: 150km, Duración aproximada: 8h, Máximo 6 pilotos.",
    duration: "8h",
    distance: "150km",
    bookedByUserIds: [],
    startLocationName: "Granada (Inicio)",
    startLatLng: { lat: 37.1773, lng: -3.5986 },
    endLocationName: "Trevélez (Fin)",
    endLatLng: { lat: 36.9011, lng: -3.2661 }
  }
];

// Helper to seed Firestore database on load if it's empty
export async function seedDatabaseIfEmpty() {
  const path = "trips";
  try {
    const tripsCol = collection(db, path);
    const snapshot = await getDocs(tripsCol);
    
    // Check if the Alpujarra trip is already seeded
    let alpujarraExists = false;
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (data.name === "Alpujarra") {
        alpujarraExists = true;
      } else {
        // Remove any other/invented routes as requested
        await deleteDoc(doc(db, "trips", docSnap.id));
      }
    }
    
    if (!alpujarraExists) {
      await addDoc(tripsCol, INITIAL_TRIPS[0]);
      console.log("Seeded default Alpujarra route successfully.");
    }
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

// Functions to query/manipulate Trips in Firestore
export async function fetchTrips(): Promise<Trip[]> {
  const path = "trips";
  try {
    const tripsCol = collection(db, path);
    const snapshot = await getDocs(tripsCol);
    const list: Trip[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Trip);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function addTrip(trip: Trip): Promise<string> {
  const path = "trips";
  try {
    const tripsCol = collection(db, path);
    const docRef = await addDoc(tripsCol, trip);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateTrip(tripId: string, updates: Partial<Trip>): Promise<void> {
  const path = `trips/${tripId}`;
  try {
    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteTrip(tripId: string): Promise<void> {
  const path = `trips/${tripId}`;
  try {
    const tripRef = doc(db, "trips", tripId);
    await deleteDoc(tripRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Functions to query/manipulate Bookings in Firestore
export async function fetchUserBookings(userId: string): Promise<Booking[]> {
  if (!userId) {
    return [];
  }
  const path = "bookings";
  try {
    const bookingsCol = collection(db, path);
    const q = query(bookingsCol, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const list: Booking[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Booking);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function addBooking(booking: Booking): Promise<string> {
  const path = "bookings";
  try {
    const bookingsCol = collection(db, path);
    const docRef = await addDoc(bookingsCol, booking);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteBooking(bookingId: string): Promise<void> {
  const path = `bookings/${bookingId}`;
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await deleteDoc(bookingRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Functions to query/manipulate Reviews in Firestore
export async function fetchReviews(): Promise<Review[]> {
  const path = "reviews";
  try {
    const reviewsCol = collection(db, path);
    // Sort reviews by creation date descending
    const q = query(reviewsCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const list: Review[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Review);
    });
    return list;
  } catch (error) {
    // Fallback if orderBy requires index or fails, just fetch unsorted
    try {
      const reviewsCol = collection(db, path);
      const snapshot = await getDocs(reviewsCol);
      const list: Review[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Review);
      });
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch (innerError) {
      handleFirestoreError(innerError, OperationType.GET, path);
    }
  }
}

export async function addReview(review: Review): Promise<string> {
  const path = "reviews";
  try {
    const reviewsCol = collection(db, path);
    const docRef = await addDoc(reviewsCol, review);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
