import { IoIosSearch } from "react-icons/io";
import { PiMagicWandLight } from "react-icons/pi";
import { IoHomeOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { TiGroupOutline } from "react-icons/ti";
import { IoMdAlarm } from "react-icons/io";
import { MdOutlineTouchApp } from "react-icons/md";
import { useNavigate } from "react-router";

// import { cn } from "../lib/utils";

// interface SidebarProps {
//   currentPage: "home" | "people" | "groups";
// }

// export default function Sidebar({ currentPage }: SidebarProps) {
//   const navigate = useNavigate();

//   return (
//     <div className="h-full w-48 border-r border-gray-300 flex flex-col px-4 gap-y-2 py-4">
//       <p
//         className={cn(
//           "text-lg cursor-pointer hover:border px-2 rounded",
//           currentPage == "home" && "border"
//         )}
//         onClick={() => navigate("/")}
//       >
//         Home
//       </p>
//       <p
//         className={cn(
//           "text-lg cursor-pointer hover:border px-2 rounded",
//           currentPage == "people" && "border"
//         )}
//         onClick={() => navigate("/people")}
//       >
//         People
//       </p>
//       <p
//         className={cn(
//           "text-lg cursor-pointer hover:border px-2 rounded",
//           currentPage == "groups" && "border"
//         )}
//         onClick={() => navigate("/groups")}
//       >
//         Groups
//       </p>
//     </div>
//   );
// }

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-56 h-screen"></div>
      <div className="w-56 min-w-56 bg-slate-50 min-h-screen h-full border-r border-r-slate-200 font-mono fixed">
        <div className="w-[95%] mx-auto flex flex-col mt-10">
          <p className="px-6 py-1 h-[95%]  hover:bg-gray-200 cursor-pointer rounded flex flex-row gap-x-2 items-center">
            <IoIosSearch /> Search
          </p>
          <p className="px-6 py-1 h-[95%]  hover:bg-gray-200 cursor-pointer rounded flex flex-row gap-x-2 items-center">
            <PiMagicWandLight /> Ask Pascal
          </p>
        </div>
        <div className="w-[95%] border-b border-slate-200 m-auto my-3"></div>
        <div className="h-[95%] w-[95%] mx-auto flex flex-col">
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
          {/* <p
            className="px-6 py-1 hover:bg-gray-200 cursor-pointer rounded flex flex-row gap-x-2 items-center"
            onClick={() => navigate("/groups")}
          >
            <TiGroupOutline /> Groups
          </p> */}
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
        </div>
      </div>
    </>
  );
}
