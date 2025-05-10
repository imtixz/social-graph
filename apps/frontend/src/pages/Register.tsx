import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/register", {
        name,
        email,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Successfully created account!");
        navigate("/");
      } else {
        alert("Failed to create an account. Please try again");
      }
    } catch (e) {
      alert("Failed to create an account. Please try again");
    }
  };

  return (
    <div className="w-full flex-row items-center justify-center">
      <div className="font-mono w-[500px] border m-auto mt-8 p-4 px-6 pt-6 rounded border-stone-300">
        <h1 className="mb-4 font-bold">Create an Account on Social Graph</h1>
        <form onSubmit={handleSubmit} className="">
          <div className="flex flex-col">
            <label htmlFor="name">Name:</label>
            <input
              className="border border-stone-300 p-1"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col mt-3">
            <label htmlFor="email">Email:</label>
            <input
              className="border border-stone-300 p-1"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col mt-3">
            <label htmlFor="password">Password:</label>
            <input
              className="border border-stone-300 p-1"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="mt-2 text-stone-600">
            Already have an account?{" "}
            <span
              className="underline cursor-pointer text-stone-600"
              onClick={() => navigate("/auth/login")}
            >
              Login
            </span>
          </p>
          <div className="flex flex-row justify-center">
            <button
              type="submit"
              className="border py-2 px-4 rounded mt-6 mb-2 hover:text-white hover:bg-stone-800 cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
