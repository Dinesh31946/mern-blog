import {
    Avatar,
    Button,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Modal,
    ModalBody,
    ModalHeader,
    Navbar,
    TextInput,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import {
    userSignoutFailure,
    userSignoutStart,
    userSignoutSuccess,
} from "../redux/user/userSlice";
import { toast } from "react-toastify";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useEffect, useState } from "react";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector((state) => state.theme);
    const path = useLocation().pathname;
    const location = useLocation();
    const { currentUser } = useSelector((state) => state.user);

    const [showSignoutModal, setShowSignoutModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSignout = async () => {
        setShowSignoutModal(false);
        try {
            dispatch(userSignoutStart());
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error("Something went wrong, please try again later.");
                dispatch(userSignoutFailure(data.message));
                return;
            } else {
                toast.success(data.message);
                setShowSignoutModal(false);
                dispatch(userSignoutSuccess(data));
            }
        } catch (error) {
            dispatch(userSignoutFailure(error.message));
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <>
            <Navbar className="border-b-2">
                <Link
                    to="/"
                    className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
                >
                    <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                        Dinesh's
                    </span>
                    Blog
                </Link>
                <form onSubmit={handleSearchSubmit}>
                    <TextInput
                        type="text"
                        placeholder="Search..."
                        rightIcon={AiOutlineSearch}
                        className="hidden lg:inline"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
                <Button className="w-12 h-10 lg:hidden" color="gray" pill>
                    <AiOutlineSearch />
                </Button>
                <div className="flex gap-8 md:order-2">
                    <Button
                        className="w-12 h-10 hidden sm:inline"
                        color="gray"
                        pill
                        onClick={() => dispatch(toggleTheme())}
                    >
                        {theme === "dark" ? <FaSun /> : <FaMoon />}
                    </Button>
                    {currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt="user avatar"
                                    img={currentUser.profilePicture}
                                    rounded
                                />
                            }
                        >
                            <DropdownHeader>
                                <span className="block text-sm">
                                    @{currentUser.username}
                                </span>
                                <span className="block text-sm font-medium truncate">
                                    {currentUser.email}
                                </span>
                            </DropdownHeader>
                            <Link to="/dashboard?tab=profile">
                                <DropdownItem>Profile</DropdownItem>
                            </Link>
                            <DropdownDivider />
                            <DropdownItem
                                onClick={() => setShowSignoutModal(true)}
                            >
                                Sign Out
                            </DropdownItem>
                        </Dropdown>
                    ) : (
                        <Link to="/sign-in">
                            <Button gradientDuoTone="purpleToBlue" outline>
                                Sign In
                            </Button>
                        </Link>
                    )}
                    <Navbar.Toggle />
                </div>
                <Navbar.Collapse>
                    <Navbar.Link active={path === "/"} as={"div"}>
                        <Link to="/">Home</Link>
                    </Navbar.Link>
                    <Navbar.Link active={path === "/about"} as={"div"}>
                        <Link to="/about">About</Link>
                    </Navbar.Link>
                    <Navbar.Link active={path === "/projects"} as={"div"}>
                        <Link to="/projects">Projects</Link>
                    </Navbar.Link>
                </Navbar.Collapse>
            </Navbar>
            <Modal
                show={showSignoutModal}
                onClick={() => setShowSignoutModal(false)}
                popup
                size="md"
            >
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to signout?
                        </h3>
                        <div className="flex gap-5 justify-center">
                            <Button
                                color="failure"
                                onClick={() => handleSignout()}
                            >
                                Yes, I am sure
                            </Button>
                            <Button
                                color="gray"
                                outline
                                onClick={() => setShowSignoutModal(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default Header;
