import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="">
      <Header />
      <div className="h-[calc(100vh-80px)] flex flex-row">
        <Sidebar currentPage="home" />
        <div className="overflow-auto w-full p-4 flex flex-col gap-y-4">
          <div className="border-b border-gray-200">
            <p className="text-sm">Today</p>
            <p>Reconnect with Eren Yeager</p>
            <p>Recoonect with Zeke Yeager</p>
          </div>
          <div className="border-b border-gray-200">
            <p className="text-sm">Tomorrow</p>
            <p>Wish Happy Birthday to Levy Ackerman</p>
          </div>
          <div>
            <p className="my-2">Quick Access:</p>
            <div className="flex flex-row gap-x-4">
              <p className="border py-2 px-4 max-w-fit rounded hover:underline cursor-pointer">
                Log Interaction
              </p>
              <p className="border py-2 px-4 max-w-fit rounded hover:underline cursor-pointer">
                Set Reminder
              </p>
              <p className="border py-2 px-4 max-w-fit rounded hover:underline cursor-pointer">
                Add Person
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// mostly just shows reminders ig
