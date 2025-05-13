import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, setUser);
  }, []);

  if (!user) return null;

  return (
    <div className="p-4 bg-white/10 backdrop-blur rounded-xl text-left max-w-sm">
      <h2 className="text-lg font-bold mb-2">Your Profile</h2>
      <p><strong>Name:</strong> {user.displayName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Wallet Linked:</strong> Not Connected</p>
      <p><strong>Uploaded Models:</strong> 0</p>
    </div>
  );
}
