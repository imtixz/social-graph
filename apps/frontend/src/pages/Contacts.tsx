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
                    onClick={() => {
                      const confirmDelete = confirm(
                        "Proceed with deleting this contact parmanently?"
                      );
                      if (confirmDelete) {
                        console.log("deleted the things");
                      }
                    }}
                  >
                    <MdDeleteOutline size={22} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
