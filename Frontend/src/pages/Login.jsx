import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../api/axiosInstance";
import { validateData } from "../utils/validateData";

async function submitForm(event) {
  event.preventDefault();
  toast.info("Form submitting...");

  const form = new FormData(event.target);
  const data = {
    email: form.get("email"),
    password: form.get("password"),
  };
  console.log("Final Data:", data);
  const isValid = await validateData(data, "login");

  try {
    // Call createUser to send data to the backend
    const response = await axiosInstance.post("/login", data);
    toast.success("Login Successful", { delay: 1000 });
    console.log("User logged in:", response);
    event.target.reset();
  } catch (error) {
    toast.error("Error logging in");
    console.error("API Error:", error);
  }
}

const Login = () => {
  return (
    <div className="h-screen flex border-2 items-center justify-center bg-custom-blue">
      <div className="flex flex-col border-2 bg-white p-6 rounded-lg">
        <div className="text-lg font-bold mb-4">Login to Your Account</div>
        <form onSubmit={submitForm}>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              required
              className="border p-2 w-full"
            />
          </div>
          <div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white p-2 rounded border-2 border-blue-500 hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Login;
