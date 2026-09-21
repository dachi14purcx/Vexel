import { authClient } from "../../lib/auth-clients"
import { useNavigate } from "react-router"

const SignIn = () => {
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>,) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { data, error } = await authClient.signIn.email({
            email,
            password
        })

        if (error) {
            console.error(error)
            alert(error.message)
            return
        }

        console.log(data)
        alert('Sign in successful')
    }

  return (
    <div>
        <form onSubmit={(e) => handleSubmit(e) }>
            <input type="email" name="email"/>
            <input type="password" name="password"/>
            <button onClick={() => navigate('/')}>Sign In</button>
        </form>
    </div>
  )
}

export default SignIn