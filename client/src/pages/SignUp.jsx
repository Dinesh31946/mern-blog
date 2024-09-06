import { Link, useNavigate } from "react-router-dom";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                toast.error(data.message);
            } else {
                toast.success(data.message);
                setFormData({}); // Clear the form data
                navigate("/sign-in"); // Redirect to login page after successful signup
            }
            setLoading(false);
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-20">
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* Left Side */}
                <div className="flex-1">
                    <Link to="/" className="text-4xl font-bold dark:text-white">
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            Technical
                        </span>
                        Dinesh
                    </Link>
                    <p className="text-sm mt-5">
                        You can sign up with your email and password or with
                        google.
                    </p>
                </div>
                {/* Right Side */}
                <div className="flex-1">
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <Label value="Your username" />
                            <TextInput
                                type="text"
                                placeholder="Username"
                                id="username"
                                value={formData.username || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value="Your email" />
                            <TextInput
                                type="email"
                                placeholder="name@company.com"
                                id="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value="Your password" />
                            <TextInput
                                type="password"
                                placeholder="Password"
                                id="password"
                                value={formData.password || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <Button
                            gradientDuoTone="purpleToPink"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="pl-3">Loading...</span>
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                        <OAuth />
                    </form>
                    <div className="flex gap-2 mt-2">
                        <span>Have an account?</span>
                        <Link to="/sign-in" className="text-blue-500">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
