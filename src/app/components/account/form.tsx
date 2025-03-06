import { login } from "@/app/lib/auth/auth";

export default function AccountForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      const response = await login(formData);
      console.log(response);
    }
    catch (error: unknown) {
      console.log(error instanceof Error ? error.message : 'An error occurred during activation. Please try again later.');
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}