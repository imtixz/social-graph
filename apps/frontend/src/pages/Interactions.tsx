import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { useEffect, useState } from "react";

export default function Interactions() {
  const navigate = useNavigate();

  const [interactions, setInteractions] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "http://localhost:3000/api/interactions",
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
    <div className="flex gap-x-8 h-full font-mono">
      <Sidebar />
      <div className="overflow-auto w-full my-4 ml-4 flex flex-col items-center">
        <div className="w-[600px] min-w-[600px]">
          <p className="my-6 font-bold">Your Interactions</p>
          <div className="flex flex-col gap-y-2">
            {interactions.map((interaction: any) => (
              <div
                className="p-4 border border-stone-200 rounded flex flex-row justify-between cursor-pointer"
                key={interaction.id}
              >
                <div>
                  {interaction.description.length <= 96
                    ? interaction.description
                    : `${interaction.description.slice(0, 96)}...`}

                  <p className="text-sm text-stone-500 mt-3">
                    {interaction.name} |{" "}
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
                              day % 10 > 3 || Math.floor((day % 100) / 10) === 1
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
                    className="cursor-pointer m-1"
                  />
                </p>
              </div>
            ))}
          </div>

          <p
            className="border px-3 py-1.5 w-fit mt-6 cursor-pointer hover:text-white hover:bg-stone-800 rounded border-stone-300"
            onClick={() => {
              navigate("/interactions/add");
            }}
          >
            + New Interaction
          </p>
        </div>
      </div>
    </div>
  );
}
