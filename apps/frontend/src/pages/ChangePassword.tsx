import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:3000/api/profile/change-password",
      {
        password: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status) {
      alert("Successfully changed the password.");
      navigate("/profile");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
    }
  }, []);

  return (
    <div className="flex gap-x-4 h-full font-mono">
      <Sidebar />
      <div className="font-mono mt-12 w-[512px] mx-auto flex flex-col gap-y-4">
        <p className="font-bold">Change Password</p>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">New Password</p>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            className="w-full rounded p-2 border border-gray-200 mt-2"
            placeholder="Enter new password"
          />
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Confirm New Password</p>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            className="w-full rounded p-2 border border-gray-200 mt-2"
            placeholder="Confirm new password"
          />
        </div>
        <button
          className="px-6 py-2 cursor-pointer border mb-12 border-gray-200 hover:bg-stone-800 hover:text-white rounded"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
}
