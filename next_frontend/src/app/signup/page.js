"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();


	//  checking  the user is authenticated or not
	const checkAuthentication = async () => {
		const response = await fetch("http://localhost:5000/auth", {
			method: "GET",
			credentials: "include",
		});

		if (response.ok) router.push("/dashboard");
	};

	useEffect(() => {
		checkAuthentication();
	}, []);



	const handleSubmit = async (e) => {
		e.preventDefault();

		const response = await fetch("http://localhost:5000/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
			credentials: "include", //  include cookies
		});

		if (response.ok) {
			alert("Signup successful!");
			router.push("/login");
		} else {
			alert("Signup failed: Email already exists");
		}
	};

	return (
		<div>
			<h1>Signup</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Signup</button>
			</form>
		</div>
	);
}
