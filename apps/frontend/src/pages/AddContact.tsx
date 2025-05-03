import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";

interface PhonesInput {
  values: string[];
  setValues: (x: string[]) => void;
  fieldName: string;
}

function DynamicInput({ values, setValues, fieldName }: PhonesInput) {
  const addPhone = () => {
    setValues([...values, ""]);
  };

  const updatePhone = (index: number, value: string) => {
    const updatedPhones = [...values];
    updatedPhones[index] = value;
    setValues(updatedPhones);
  };

  const deletePhone = (index: number) => {
    const updatedPhones = values.filter((_, i) => i !== index);
    setValues(updatedPhones);
  };

  return (
    <div>
      {values.map((value, index) => (
        <div
          key={index}
          className="w-full rounded border border-gray-200 mt-2 flex items-center justify-between mb-2"
        >
          <input
            type="text"
            value={value}
            onChange={(e) => updatePhone(index, e.target.value)}
            placeholder={`Enter ${fieldName}`}
            className="w-full h-full p-2"
          />
          <button
            onClick={() => deletePhone(index)}
            className="cursor-pointer px-2"
          >
            <MdDeleteOutline size={20} color="oklch(50.5% 0.213 27.518)" />
          </button>
        </div>
      ))}
      <p onClick={addPhone} className="text-gray-600 cursor-pointer mt-2">
        + Add {fieldName}
      </p>
    </div>
  );
}

export default function AddContact() {
  // there will be a form here
  // form will contain name, address, date of birth, addresses, phones and social links

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [facebooks, setFacebooks] = useState<string[]>([]);
  const [instagrams, setInstagrams] = useState<string[]>([]);
  const [twitters, setTwitters] = useState<string[]>([]);
  const [linkedins, setLinkedins] = useState<string[]>([]);

  const handleSubmit = () => {
    axios.post(
      "http://localhost:3000/api/contact",
      {
        name,
        address,
        dateOfBirth,
        emailAddresses: emails,
        phones,
        facebooks,
        instagrams,
        twitters,
        linkedins,
      },
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ2MjYxNjc3LCJleHAiOjE3NDYzNDgwNzd9.n6M8HlYRuosxtTc5GiIMJ_zhP1O3zmu3RwfdltRqPs8",
        },
      }
    );
  };

  return (
    <div className="flex gap-x-8 h-full">
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
          className="px-6 py-2 cursor-pointer border mb-12 border-gray-200 hover:bg-green-800 hover:text-white rounded"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
}
