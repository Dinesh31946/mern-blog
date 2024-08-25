import {
    Sidebar,
    SidebarItem,
    SidebarItemGroup,
    SidebarItems,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { userSignoutStart, userSignoutSuccess } from "../redux/user/userSlice";
import { toast } from "react-toastify";

const DashSidebar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { currentUser } = useSelector((state) => state.user);
    const [tab, setTab] = useState();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");

        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleSignout = async () => {
        try {
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error("Something went wrong, please try again later.");
                return;
            } else {
                toast.success(data.message);
                dispatch(userSignoutSuccess(data));
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <Sidebar className="w-full md:w-56">
            <SidebarItems>
                <SidebarItemGroup className="flex flex-col gap-1">
                    <Link to="/dashboard?tab=profile">
                        <SidebarItem
                            className="cursor-pointer"
                            active={tab === "profile"}
                            icon={HiUser}
                            label={currentUser.isAdmin ? "Admin" : "User"}
                            labelColor="dark"
                            as="div"
                        >
                            Profile
                        </SidebarItem>
                    </Link>
                    {currentUser.isAdmin && (
                        <Link to="/dashboard?tab=posts">
                            <SidebarItem
                                className="cursor-pointer"
                                active={tab === "posts"}
                                icon={HiDocumentText}
                                as="div"
                            >
                                Posts
                            </SidebarItem>
                        </Link>
                    )}
                    <SidebarItem
                        className="cursor-pointer"
                        icon={HiArrowSmRight}
                        onClick={() => handleSignout()}
                    >
                        Sign Out
                    </SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    );
};

export default DashSidebar;
