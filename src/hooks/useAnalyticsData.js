import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

export default function useAnalyticsData() {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs.map((doc) => {
          const userData = doc.data();
          return {
            id: doc.id,
            createdAt: userData.createdAt?.toDate ? userData.createdAt.toDate() : new Date(),
            city: userData.city || "Unknown",
          };
        });
        setData(usersList);
      } catch (err) {
        console.error("Failed to fetch users for analytics", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { data, loading, error };
}
