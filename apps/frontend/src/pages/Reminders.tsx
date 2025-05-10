import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Reminders() {
  const [reminderKeys, setReminderKeys] = useState<any[]>([]);
  const [reminderDisplay, setReminderDisplay] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "http://localhost:3000/api/reminders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data, "<--- repsponse data");

        let reminderDates: any[] = [];
        const allReminders = [
          ...response.data.reminders,
          ...response.data.birthdayReminders,
        ];

        const groupedReminders = allReminders.reduce(
          (acc: any, reminder: any) => {
            // Extracting the date part from the datetime string
            const date = new Date(reminder.remind_on).toDateString();
            if (!acc[date]) {
              acc[date] = [];
              reminderDates.push(date);
            }
            // Adding contacts to the reminder
            if (reminder.date_of_birth != null) {
              const contacts = [
                {
                  name: reminder.name,
                  contactId: reminder.id,
                },
              ];
              reminder.contacts = contacts;
            } else {
              const contacts = response.data.contactsInReminders.filter(
                (c: any) => c.reminderId === reminder.id
              );
              reminder.contacts = contacts;
            }
            acc[date].push(reminder);
            return acc;
          },
          {}
        );

        // Sorting the reminderDates array by the remind_on date
        reminderDates.sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        console.log(groupedReminders, "<--- this is grouped reminder");
        setReminderDisplay(groupedReminders);
        setReminderKeys(reminderDates);
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
      <div className="overflow-auto p-4 flex flex-col gap-y-4 w-[600px] mx-auto">
        <div className=" border-gray-200 flex flex-col gap-y-2">
          {reminderKeys.map((date) => (
            <div key={date}>
              <p className="">{date}</p>

              <div className="flex flex-col ml-8 mt-2">
                {reminderDisplay[date].map((x: any) => (
                  <div className="relative">
                    <div className="border-l h-full w-0.5 absolute left-[-12px] border-l-gray-300"></div>
                    <div className="border p-3 rounded my-2">
                      <p>{x.title}</p>
                      <p className="text-gray-500">{x.body}</p>
                      <p className="text-sm text-gray-500 flex flex-row gap-x-3 mt-2">
                        Contacts:{" "}
                        {x.contacts.map((r: any) => (
                          <span
                            className="underline cursor-pointer"
                            onClick={() => {
                              navigate(`/contacts/${r.contactId}`);
                            }}
                          >
                            {r.name}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p
          className="border border-stone-300 px-4 py-2 w-fit rounded hover:bg-stone-800 hover:text-white cursor-pointer mt-3"
          onClick={() => {
            navigate("/reminders/create");
          }}
        >
          + Add Reminder
        </p>
      </div>
    </div>
  );
}
