import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

export default function ContactDetails() {
  const [contactDetails, setContactDetails] = useState<any>(null);
  const [interactions, setInteractions] = useState<any[]>([]);

  const { contactId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          `http://localhost:3000/api/contact/${contactId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setContactDetails(response.data);
      } else {
        console.error("No token found in localStorage");
      }
    })();

    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          `http://localhost:3000/api/contact/${contactId}/interactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setInteractions(response.data.interactions);
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
      <div className="flex flex-row justify-center w-full mt-8">
        <div className="flex flex-col gap-y-4">
          <p className="font-bold">Contact Details</p>
          <div className="border p-4 rounded-xl border-gray-200 w-[600px] max-w-[700px]">
            <p>
              <p className="font-bold mt-3">Name:</p>{" "}
              {contactDetails?.contact.name}
            </p>
            <p>
              <p className="font-bold mt-3">Date of Birth:</p>{" "}
              {contactDetails?.contact.date_of_birth!.substring(0, 10)}
            </p>
            <p>
              <p className="font-bold mt-3">Address:</p>{" "}
              {contactDetails?.contact.address}
            </p>
          </div>
          <div className="border p-4 rounded-xl border-gray-200 w-[600px] max-w-[700px]">
            <p className="font-bold my-2">Phones:</p>
            {contactDetails?.phones.map((p: any) => {
              return <p>{p?.phone}</p>;
            })}
            <div className="border-b border-b-stone-200 my-4 mx-2"></div>
            <p className="font-bold my-2">Emails:</p>
            {contactDetails?.emailAddresses.map((e: any) => {
              return <p>{e?.email}</p>;
            })}
          </div>
          <div className="border p-4 rounded-xl border-gray-200 w-[600px] max-w-[700px]">
            <p className="font-bold my-2">Socials:</p>
            {contactDetails?.socials.map((s: any) => {
              return (
                <p>
                  -{" "}
                  <a href={s.link}>
                    {`[${s.type}]: `}
                    {s.link.substring(s.link.lastIndexOf("/") + 1)}
                  </a>
                </p>
              );
            })}
          </div>
          <div className="border p-4 rounded-xl border-gray-200 w-[600px] max-w-[700px]">
            <p className="font-bold mb-3">Timeline</p>
            <div className="flex flex-col gap-y-2">
              {interactions.map((interaction) => (
                <div className="p-2 border border-stone-200 rounded flex flex-row justify-between">
                  <div>
                    <p>{interaction.description}</p>
                    <p className="text-sm text-stone-500 mt-3">
                      {new Date(interaction.date)
                        .toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                        .replace(
                          /(\d+)(?=\s)/,
                          (day: any) =>
                            `${day}${
                              ["th", "st", "nd", "rd"][
                                day % 10 > 3 ||
                                Math.floor((day % 100) / 10) === 1
                                  ? 0
                                  : day % 10
                              ]
                            }`
                        )}
                    </p>
                  </div>
                  <p
                    onClick={async () => {
                      const confirmDelete = confirm(
                        "Proceed with deleting this interaction parmanently?"
                      );
                      if (confirmDelete) {
                        const token = localStorage.getItem("token");
                        const res = await axios.delete(
                          `http://localhost:3000/api/contact/interaction/${interaction.id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );

                        setInteractions(res.data.interactions);
                        alert("Successfully deleted the interaction!");
                      }
                    }}
                  >
                    <MdDeleteOutline
                      size={20}
                      color="oklch(50.5% 0.213 27.518)"
                      className="cursor-pointer"
                    />
                  </p>
                </div>
              ))}
            </div>
            <p
              className="border px-4 py-2 rounded border-stone-200 cursor-pointer hover:text-white hover:bg-stone-800 w-fit mt-4 text-sm"
              onClick={() => {
                navigate("/interactions/add");
              }}
            >
              + New Interaction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
