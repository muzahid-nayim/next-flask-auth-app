"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();


  const checkAuthentication = async () => {
	const response = await fetch("http://localhost:5000/dashboard", {
		method: "GET",
		credentials: 'include',
	});

	if (!response.ok) {
		router.push("/login");
	} else {
		const data = await response.json(); // Get the response data
		alert(data.message); // Show welcome message or other data
	}
};

  useEffect(() => {
    checkAuthentication();
  }, []); 

  const handleLogout = async () => {
    const response = await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: 'include', //  include cookies
    });

    if (response.ok) {
      alert("Logout successful!");
      router.push("/login"); // Redirect to login page
    } else {
      alert("Logout failed");
    }
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>You are successfully logged in!</p>
      <button
        className="m-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
