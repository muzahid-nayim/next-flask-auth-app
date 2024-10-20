"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
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

		const response = await fetch("http://localhost:5000/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
			credentials: "include", //  include cookies
		});

		if (response.ok) {
			router.push("/dashboard");
		} else {
			alert("Invalid email or password");
		}
	};

	return (
		<div>
			<h1>Login</h1>
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
				<button type="submit">Login</button>
			</form>
		</div>
	);
}
