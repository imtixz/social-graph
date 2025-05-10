import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router";

export default function AddReminder() {
  const [interactionWith, setInteractionWith] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [contactList, setContactList] = useState<any[]>([]);
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    let relevantContacts = [];

    if (typeof interactionWith === "string" && interactionWith.includes(",")) {
      relevantContacts = interactionWith.split(",");
    } else {
      relevantContacts = [interactionWith];
    }
    const token = localStorage.getItem("token");
    const remindOn = new Date(date);
    const response = await axios.post(
      "http://localhost:3000/api/reminder",
      {
        relevantContacts: relevantContacts,
        title,
        body,
        date: `${String(remindOn.getMonth() + 1).padStart(2, "0")}-${String(
          remindOn.getDate()
        ).padStart(2, "0")}-${remindOn.getFullYear()}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status) {
      alert("Successfully added the reminder.");
      navigate("/reminders");
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
    <div className="flex gap-x-4 h-full font-mono">
      <Sidebar />

      <div className="font-mono mt-12 w-[512px] mx-auto flex flex-col gap-y-4">
        <p className="font-bold">Create a Custom Reminder</p>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Select the relevant contacts:</p>

          <div className="flex flex-col gap-y-2 mt-3 max-h-32 overflow-y-auto border-y border-y-stone-200">
            {contactList.map((contact) => (
              <label key={contact.id} className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  value={contact.id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setInteractionWith((prev) =>
                        prev ? `${prev},${contact.id}` : contact.id
                      );
                    } else {
                      setInteractionWith((prev) =>
                        prev
                          .split(",")
                          .filter((id) => id !== contact.id)
                          .join(",")
                      );
                    }
                  }}
                  className="rounded border-gray-200"
                />
                {contact.name}
              </label>
            ))}
          </div>
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Title</p>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="w-full rounded p-2 border border-gray-200 mt-2"
            placeholder="Title of the reminder"
          />
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Body</p>
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
            className="w-full rounded p-2 border border-gray-200 mt-2"
            placeholder="Body of the reminder"
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
