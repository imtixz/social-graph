import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router";
import axios from "axios";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("sample@mail.com");

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:3000/api/profile",
      {
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status) {
      alert("Successfully modified profile data.");
    }
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get("http://localhost:3000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.contacts);
        setName(response.data.user.name);
        setEmail(response.data.user.email);
      } else {
        console.error("No token found in localStorage");
      }
    })();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
    }
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex gap-x-4 h-full font-mono">
      <Sidebar />
      <div className="font-mono mt-12 w-[512px] mx-auto flex flex-col gap-y-4">
        <p className="font-bold">Edit Profile Data</p>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Name</p>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="w-full rounded p-2 border border-gray-200 mt-2"
            placeholder="Your name"
          />
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Email</p>
          <input
            value={email}
            readOnly
            className="w-full rounded p-2 border border-gray-200 mt-2 bg-gray-100 cursor-not-allowed"
            placeholder="Your email"
          />
        </div>
        <p
          className="px-4 py-2 border rounded border-stone-300 hover:border-stone-700 cursor-pointer my-3 text-center"
          onClick={() => navigate("/profile/change-password")}
        >
          Change Password
        </p>

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
