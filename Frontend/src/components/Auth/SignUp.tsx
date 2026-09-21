import { authClient } from "../../lib/auth-clients"

const SignUp = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await authClient.signUp.email({ email, password, name: "x" })
      alert("Sign up successful")
    } catch (error) {
      console.error(error)
      alert("An error occurred. Please try again.")
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="border-red-950 border-8">
        <input type="email" name="email" required />
        <input type="password" name="password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp