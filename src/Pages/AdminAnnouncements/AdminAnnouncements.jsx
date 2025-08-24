import { useState } from "react";
import { db } from "../../firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import {
  Megaphone,
  MessageSquareText,
  FolderClosed,
  SendHorizonal,
} from "lucide-react";
import BlurText from "../../components/ui/blurTxt/BlurText";

export default function AdminAnnouncements() {
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [loading, setLoading] = useState(false);

  const adminId = "circle"; // your single admin

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      return toast.error("Please fill out all fields.");
    }

    setLoading(true);
    try {
      // Add announcement under your admin document
      await addDoc(
        collection(db, "admins", adminId, "announcements"),
        {
          title: title.trim(),
          message: message.trim(),
          type,
          createdAt: serverTimestamp(),
          target: "all",
        }
      );

      toast.success(" Announcement sent!");
      setTitle("");
      setMessage("");
      setType("info");
    } catch (err) {
      console.error(err);
      toast.error(" Failed to send announcement.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="text-center p-6 text-white">Loading user...</div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[100vh] px-4 bg-[var(--color-input-bg)] backdrop-blur-md shadow-lg pt-18 border border-[var(--shadow-glass)] transition-all duration-500 bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)]">
      <section className="w-full max-w-3xl bg-transparent backdrop-blur-md shadow-lg rounded-[var(--rounded-rounded)] p-8 border border-[var(--shadow-glass)] transition-all duration-500">
        <div className="mb-10">
          <BlurText
            text="Create Admin Announcement"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-3xl font-bold text-white text-shadow-soft"
          />
          <p className="text-sm text-white/70 mt-1 flex items-center gap-1">
            <Megaphone className="w-4 h-4" />
            Notify users with updates, warnings, or events
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-white">
              <MessageSquareText className="w-4 h-4" />
              Title
            </label>
            <input
              type="text"
              className="w-full input-bg placeholder:text-white/70 focus:ring-2 focus:ring-[var(--gradient-to)] focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., New Feature Launch"
              maxLength={100}
            />
          </div>

          {/* Message */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-white">
              <MessageSquareText className="w-4 h-4" />
              Message
            </label>
            <textarea
              rows="5"
              className="w-full input-bg placeholder:text-white/70 focus:ring-2 focus:ring-[var(--gradient-to)] focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="We’re launching new features next week! Stay tuned."
              maxLength={1000}
            />
          </div>

          {/* Type */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-white">
              <FolderClosed className="w-4 h-4" />
              Announcement Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-3xl px-3 py-2  focus:ring-2 focus:ring-[var(--gradient-to)] focus:outline-none"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="update">Update</option>
              <option value="event">Event</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--rounded-pill)] font-semibold transition duration-300 shadow-md bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] text-white ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg"
              }`}
            >
              <SendHorizonal className="w-5 h-5" />
              {loading ? "Sending..." : "Send Announcement"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
