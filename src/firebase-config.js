import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
   addDoc,  orderBy, onSnapshot, serverTimestamp
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAW0f0DzBx3e769VkVdUimATL6-gnW4cTo",
  authDomain: "circle-26a87.firebaseapp.com",
  projectId: "circle-26a87",
  storageBucket: "circle-26a87.appspot.com",
  messagingSenderId: "141731835688",
  appId: "1:141731835688:web:d6007596d6eb3e81eb6a1d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const GoogleProvider = new GoogleAuthProvider();

async function blockReportedUsers() {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("reported", ">=", 5));
  const querySnapshot = await getDocs(q);

  console.log("Users with reported >= 5 found:", querySnapshot.size);

  querySnapshot.forEach(async (userDoc) => {
    const userData = userDoc.data();
    console.log(`Checking user: ${userDoc.id}`, userData);

    if (!userData.isBlocked) {
      console.log(`Blocking user ${userDoc.id} now...`);
      await updateDoc(userDoc.ref, { isBlocked: true });
      console.log(`Blocked user: ${userDoc.id}`);
    } else {
      console.log(`User ${userDoc.id} already blocked.`);
    }
  });
}

blockReportedUsers().catch((err) => {
  console.error("❌ Failed to block users:", err);
});



async function addAnnouncement(adminId, announcementData) {
  try {
    const announcementsRef = collection(db, "admins", adminId, "announcements");
    const docRef = await addDoc(announcementsRef, {
      ...announcementData,
      createdAt: serverTimestamp(),
    });
    console.log("Announcement added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding announcement: ", error);
    throw error;
  }
}
