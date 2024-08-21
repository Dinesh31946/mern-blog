import { Link, useNavigate } from "react-router-dom"
import { Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react"
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const {loading} = useSelector((state) => state.user);

  const handleChange= (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim() });
  }
  console.log(formData);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if(data.success === false){
        toast.error(data.message);
        dispatch(signInFailure(data.message));
      }else {
        dispatch(signInSuccess(data));
        toast.success(data.message);
        navigate('/'); // Redirect to login page after successful signIn
      }
    } catch (error) {
      toast.error(error.message);
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className="min-h-screen mt-20">
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
            {/* Left Side */}
            <div className="flex-1">
              <Link to="/" className='text-4xl font-bold dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Dinesh's</span>
                Blog
              </Link>
              <p className="text-sm mt-5">You can sign in with your email and password or with google.</p>
            </div>
            {/* Right Side */}
            <div className="flex-1">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label value="Your email"  />
                        <TextInput type="email" placeholder="name@company.com" id="email" value={formData.email || ''} onChange={handleChange} />
                    </div>
                    <div>
                        <Label value="Your password"  />
                        <TextInput type="password" placeholder="*********" id="password" value={formData.password || ''} onChange={handleChange} />
                    </div>
                    <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading} >
                        {
                          loading ? (
                            <>
                              <Spinner size='sm' />
                              <span className="pl-3">Loading...</span>
                            </>
                          ) : "Sign In" 
                        }
                    </Button>
                    <OAuth/>
                </form>
                <div className="flex gap-2 mt-2">
                    <span>Don't have an account?</span>
                    <Link to='/sign-up' className="text-blue-500">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SignIn
