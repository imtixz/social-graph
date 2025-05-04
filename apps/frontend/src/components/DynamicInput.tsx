import { MdDeleteOutline } from "react-icons/md";

interface PhonesInput {
  values: string[];
  setValues: (x: string[]) => void;
  fieldName: string;
}

export function DynamicInput({ values, setValues, fieldName }: PhonesInput) {
  const addPhone = () => {
    setValues([...values, ""]);
  };

  const updatePhone = (index: number, value: string) => {
    const updatedPhones = [...values];
    updatedPhones[index] = value;
    setValues(updatedPhones);
  };

  const deletePhone = (index: number) => {
    const updatedPhones = values.filter((_: string, i: number) => i !== index);
    setValues(updatedPhones);
  };

  return (
    <div>
      {values.map((value: string, index: number) => (
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
