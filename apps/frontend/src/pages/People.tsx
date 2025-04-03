import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function People() {
  return (
    <div className="">
      <Header />
      <div className="h-[calc(100vh-80px)] flex flex-row">
        <Sidebar currentPage="people" />
        <div className="overflow-auto w-full p-4 flex flex-col gap-y-4">
          <div className="border p-4 border-gray-500">
            <p className="text-xl">Eren Yeager</p>
            <p className="text-sm text-gray-500">Attack Titan, Survey Corps</p>
          </div>
        </div>
      </div>
    </div>
  );
}
