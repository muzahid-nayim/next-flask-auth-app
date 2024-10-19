import Link from "next/link";

export default function Home() {
	return (
		<div>
			<h1 className="text-5xl my-11">Landing Page</h1>
			<Link className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" href="/login">Login</Link>
			<Link className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" href="/signup">Signup</Link>
		</div>
	);
}
