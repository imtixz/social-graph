import { IoHomeOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { IoMdAlarm } from "react-icons/io";
import { MdOutlineTouchApp } from "react-icons/md";
import { useNavigate } from "react-router";
import { CiLogout } from "react-icons/ci";
import { RiAccountCircleLine } from "react-icons/ri";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-56 h-screen"></div>
      <div className="w-56 min-w-56 bg-slate-50 min-h-screen h-full border-r border-r-slate-200 font-mono fixed">
        <div className="h-[95%] w-[95%] mx-auto flex flex-col mt-10">
          <p
            className="px-6 py-1 hover:bg-gray-200 cursor-pointer rounded flex flex-row gap-x-2 items-center"
            onClick={() => navigate("/")}
          >
            <IoHomeOutline /> Home
          </p>
          <p
            className="px-6 py-1 hover:bg-gray-200 cursor-pointer rounded flex flex-row gap-x-2 items-center"
            onClick={() => navigate("/contacts")}
          >
            <IoPersonOutline /> Contacts
          </p>
          <p
            className="px-6 py-1 hover:bg-gray-200 cursor-pointer rounded flex flex-row gap-x-2 items-center"
            onClick={() => navigate("/reminders")}
          >
            <IoMdAlarm /> Reminders
          </p>
          <p
            className="px-6 py-1 hover:bg-gray-200 cursor-pointer rounded flex flex-row gap-x-2 items-center"
            onClick={() => navigate("/interactions")}
          >
            <MdOutlineTouchApp /> Interactions
          </p>
          <div className="w-[95%] border-b border-slate-200 m-auto my-3"></div>
          <div className="h-[95%] w-[95%] mx-auto flex flex-col">
            <p
              className="px-6 py-1 hover:bg-gray-200 cursor-pointer rounded flex flex-row gap-x-2 items-center"
              onClick={() => navigate("/profile")}
            >
              <RiAccountCircleLine /> Profile
            </p>
            <p
              className="px-6 py-1 hover:bg-gray-200 cursor-pointer rounded flex flex-row gap-x-2 items-center"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              <CiLogout /> Logout
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
