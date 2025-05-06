import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

import { MdDeleteOutline } from "react-icons/md";
import { FaRegPenToSquare } from "react-icons/fa6";
import { useNavigate } from "react-router";

export default function Contacts() {
  const [contacts, setContacts] = useState<any[]>([]);

  const navigate = useNavigate();

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
        setContacts(response.data.contacts);
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

  return (
    <div className="flex gap-x-4 h-full font-mono">
      <Sidebar />
      <div className="overflow-auto w-full my-4 ml-4 flex flex-col items-center">
        <div className="w-[500px]">
          <p className="mb-3 font-bold">Your Contacts</p>
          {contacts.map((contact) => {
            return (
              <div className="py-2 px-6 border border-stone-300 border-b-stone-300 border-t-stone-300 my-1 rounded flex justify-between">
                <p
                  className="border-b border-b-stone-300 w-fit cursor-pointer"
                  onClick={() => {
                    navigate(`/contacts/${contact.id}`);
                  }}
                >
                  {contact.name}
                </p>
                <div className="flex flex-row gap-x-2 items-center">
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/contacts/edit/${contact.id}`);
                    }}
                  >
                    <FaRegPenToSquare size={18} />
                  </p>
                  <p
                    className="cursor-pointer"
                    onClick={async () => {
                      const confirmDelete = confirm(
                        "Proceed with deleting this contact's information parmanently?"
                      );
                      if (confirmDelete) {
                        const token = localStorage.getItem("token");
                        const response = await axios.delete(
                          `http://localhost:3000/api/contact/${contact.id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                        console.log(response.data);
                        setContacts(response.data.contacts);
                        alert("Successfully deleted the contact!");
                      }
                    }}
                  >
                    <MdDeleteOutline size={22} />
                  </p>
                </div>
              </div>
            );
          })}
          <p
            className="border px-3 py-1.5 w-fit mt-6 cursor-pointer hover:text-white hover:bg-stone-800 rounded border-stone-300"
            onClick={() => {
              navigate("/contacts/add");
            }}
          >
            + New Contact
          </p>
        </div>
      </div>
    </div>
  );
}
