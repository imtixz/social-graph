import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
    }
  }, []);

  return (
    <div className="flex gap-x-4 h-full font-mono">
      <Sidebar />
      <div className="overflow-auto p-4 flex flex-col gap-y-4 w-[600px]">
        <div>
          <p className="my-2">Quick Access:</p>
          <div className="flex flex-row gap-y-2 gap-x-2">
            <p className="border py-2 px-4 max-w-fit rounded hover:text-white hover:bg-stone-800 cursor-pointer text-center border-stone-300">
              Log Interaction
            </p>
            <p className="border py-2 px-4 max-w-fit rounded hover:text-white hover:bg-stone-800 cursor-pointer text-center border-stone-300">
              Set Reminder
            </p>
            <p
              className="border py-2 px-4 max-w-fit rounded hover:text-white hover:bg-stone-800 cursor-pointer text-center border-stone-300"
              onClick={() => {
                navigate("/contacts/add");
              }}
            >
              Add Person
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// mostly just shows reminders ig
