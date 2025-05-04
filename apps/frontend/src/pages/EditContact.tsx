import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { DynamicInput } from "../components/DynamicInput";
import axios from "axios";

export default function EditContact() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [facebooks, setFacebooks] = useState<string[]>([]);
  const [instagrams, setInstagrams] = useState<string[]>([]);
  const [twitters, setTwitters] = useState<string[]>([]);
  const [linkedins, setLinkedins] = useState<string[]>([]);

  const navigate = useNavigate();
  const { contactId } = useParams();

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const dob = new Date(dateOfBirth);
    console.log(
      `${dob.getMonth() + 1}-${dob.getDate()}-${dob.getFullYear()}`,
      "<-- this is the dob being sent"
    );
    const response = await axios.post(
      `http://localhost:3000/api/contact/${contactId}`,
      {
        name,
        address,
        dateOfBirth: `${String(dob.getMonth() + 1).padStart(2, "0")}-${String(
          dob.getDate()
        ).padStart(2, "0")}-${dob.getFullYear()}`,
        emailAddresses: emails,
        phones,
        facebooks,
        instagrams,
        twitters,
        linkedins,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status) {
      alert("Successfully updated the contact details.");
      navigate(`/contacts/${contactId}`);
    }
  };

  useEffect(() => {
    // populate the initial values using the data from the backend
    // make a get request for the specific
    const token = localStorage.getItem("token");

    (async () => {
      const response = await axios.get(
        `http://localhost:3000/api/contact/${contactId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      const dob = new Date(response.data.contact.date_of_birth);
      setName(response.data.contact.name);
      setAddress(response.data.contact.address);

      setDateOfBirth(
        `${dob.getFullYear()}-${String(dob.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(dob.getDate()).padStart(2, "0")}`
      );
      setPhones(response.data.phones.map((p: any) => p.phone));
      setEmails(response.data.emailAddresses.map((e: any) => e.email));
      setFacebooks(
        response.data.socials
          .filter((s: any) => s.type === "facebook")
          .map((s: any) => s.link)
      );
      setInstagrams(
        response.data.socials
          .filter((s: any) => s.type === "instagram")
          .map((s: any) => s.link)
      );
      setTwitters(
        response.data.socials
          .filter((s: any) => s.type === "twitter")
          .map((s: any) => s.link)
      );
      setLinkedins(
        response.data.socials
          .filter((s: any) => s.type === "linkedin")
          .map((s: any) => s.link)
      );
    })();
  }, []);

  return (
    <div className="flex gap-x-4 h-full font-mono">
      <Sidebar />
      <div className="font-mono mt-12 w-[512px] mx-auto flex flex-col gap-y-4">
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Name</p>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="w-full rounded p-2 border border-gray-200 mt-2"
            placeholder="Click here to enter name"
          />
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Address</p>
          <textarea
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            className="w-full rounded p-2 border border-gray-200 mt-2"
            placeholder="Click here to enter address"
          />
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Date of Birth</p>
          <input
            value={dateOfBirth}
            onChange={(e) => {
              console.log(e.target.value, "<--- this is the date from input");
              setDateOfBirth(e.target.value);
            }}
            type="date"
            className="w-full rounded p-2 border border-gray-200 mt-2"
          />
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Email Addresses</p>
          <DynamicInput
            values={emails}
            setValues={setEmails}
            fieldName="email address"
          />
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Phone Numbers</p>
          <DynamicInput
            values={phones}
            setValues={setPhones}
            fieldName="phone"
          />
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Facebook Profile(s)</p>
          <DynamicInput
            values={facebooks}
            setValues={setFacebooks}
            fieldName="facebook url"
          />
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Instagram Profile(s)</p>
          <DynamicInput
            values={instagrams}
            setValues={setInstagrams}
            fieldName="instagram url"
          />
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Twitter Account(s)</p>
          <DynamicInput
            values={twitters}
            setValues={setTwitters}
            fieldName="twitter url"
          />
        </div>
        <div className="border p-4 rounded-xl border-gray-200">
          <p className="font-bold">Linkedin Account(s)</p>
          <DynamicInput
            values={linkedins}
            setValues={setLinkedins}
            fieldName="linkedin url"
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
