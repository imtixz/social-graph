import { cn } from "../lib/utils";
import { useNavigate } from "react-router";

interface SidebarProps {
  currentPage: "home" | "people" | "groups";
}

export default function Sidebar({ currentPage }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="h-full w-48 border-r border-gray-300 flex flex-col px-4 gap-y-2 py-4">
      <p
        className={cn(
          "text-lg cursor-pointer hover:border px-2 rounded",
          currentPage == "home" && "border"
        )}
        onClick={() => navigate("/")}
      >
        Home
      </p>
      <p
        className={cn(
          "text-lg cursor-pointer hover:border px-2 rounded",
          currentPage == "people" && "border"
        )}
        onClick={() => navigate("/people")}
      >
        People
      </p>
      <p
        className={cn(
          "text-lg cursor-pointer hover:border px-2 rounded",
          currentPage == "groups" && "border"
        )}
        onClick={() => navigate("/groups")}
      >
        Groups
      </p>
    </div>
  );
}
