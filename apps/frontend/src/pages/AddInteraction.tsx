import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router";

export default function AddInteraction() {
  const [interactionWith, setInteractionWith] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [contactList, setContactList] = useState<any[]>([]);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log({
      interactionWith,
      description,
      date,
    });
    const token = localStorage.getItem("token");
    if (token) {
      const _date = new Date(date);
      console.log(
        `${String(_date.getMonth() + 1).padStart(2, "0")}-${String(
          _date.getDate()
        ).padStart(2, "0")}-${_date.getFullYear()}`
      );
      await axios.post(
        `http://localhost:3000/api/contact/interaction/add`,
        {
          contactId: interactionWith,
          description,
          date: `${String(_date.getMonth() + 1).padStart(2, "0")}-${String(
            _date.getDate()
          ).padStart(2, "0")}-${_date.getFullYear()}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Successfully added the interaction");
      navigate(`/contacts/${interactionWith}`);
    } else {
      console.error("No token found in localStorage");
    }
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get("http://localhost:3000/api/contact", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.contacts);
        setContactList(response.data.contacts);
      } else {
        console.error("No token found in localStorage");
      }
    })();
  }, []);

  return (
    <div className="flex gap-x-8 h-full">
      <Sidebar />
      <div className="font-mono mt-12 w-[512px] mx-auto flex flex-col gap-y-4">
        <p className="font-bold">Log An Interaction</p>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Interaction With</p>
          <select
            value={interactionWith}
            onChange={(e) => {
              setInteractionWith(e.target.value);
            }}
            className="w-full rounded p-2 border border-gray-200 mt-2"
          >
            <option value="" disabled>
              Select an option
            </option>
            {contactList.map((contact) => (
              <option value={contact.id}>{contact.name}</option>
            ))}
          </select>
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Description</p>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className="w-full rounded p-2 border border-gray-200 mt-2"
            placeholder="Describe the interaction"
          />
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Date</p>
          <input
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
            type="date"
            className="w-full rounded p-2 border border-gray-200 mt-2"
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
