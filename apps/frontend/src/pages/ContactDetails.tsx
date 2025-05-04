import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { useParams } from "react-router";

export default function ContactDetails() {
  const [contactDetails, setContactDetails] = useState<any>(null);

  const { contactId } = useParams();

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
          {/* <div className="border p-4 rounded-xl border-gray-200 w-[500px] max-w-[500px]">
            <p className="font-bold">Notes</p>
            <div className="flex flex-col gap-y-2 mt-3">
              <div className="p-2 border border-stone-200 rounded">
                this is a sample note hehehehhe
              </div>
              <div className="p-2 border border-stone-200 rounded">
                This is a sample note hehehehe
              </div>
              <p className="border px-4 py-2 rounded border-stone-200 cursor-pointer hover:text-white hover:bg-stone-800 w-fit mt-4 text-sm">
                + New Note
              </p>
            </div>
          </div> */}
          <div className="border p-4 rounded-xl border-gray-200 w-[600px] max-w-[700px]">
            <p className="font-bold">Interactions</p>
            <div className="flex flex-col gap-y-2 mt-3">
              <div className="p-2 border border-stone-200 rounded flex flex-row justify-between">
                <div>
                  <p>got introduced to him at the career fest</p>
                  <p className="text-sm text-stone-500 mt-3">15th June, 2024</p>
                </div>
                <p>
                  <MdDeleteOutline
                    size={20}
                    color="oklch(50.5% 0.213 27.518)"
                    className="cursor-pointer"
                  />
                </p>
              </div>
              <div className="p-2 border border-stone-200 rounded flex flex-row justify-between">
                <div>
                  <p>
                    met him at the attention network movie night. talked about
                    openings at Bangladesh Angel Network
                  </p>
                  <p className="text-sm text-stone-500 mt-3">15th June, 2024</p>
                </div>
                <p>
                  <MdDeleteOutline
                    size={20}
                    color="oklch(50.5% 0.213 27.518)"
                    className="cursor-pointer"
                  />
                </p>
              </div>
              <p className="border px-4 py-2 rounded border-stone-200 cursor-pointer hover:text-white hover:bg-stone-800 w-fit mt-4 text-sm">
                + New Interaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
