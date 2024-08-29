import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashBoardComp from "../components/DashBoardComp";
import { useSelector } from "react-redux";

const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");

        if (tabFromUrl) {
            setTab(tabFromUrl);
        } else {
            setTab(currentUser.isAdmin ? "dashboard" : "profile");
        }
    }, [location.search]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-56">
                {/* Sidebar */}
                <DashSidebar />
            </div>
            {/* Mainpage */}
            {tab === "profile" && <DashProfile />}
            {/* Posts page */}
            {tab === "posts" && <DashPosts />}
            {/* All users  */}
            {tab === "users" && <DashUsers />}
            {/* Comments page */}
            {tab === "comments" && <DashComments />}
            {/* Dashboard page */}
            {tab === "dashboard" && <DashBoardComp />}
        </div>
    );
};

export default Dashboard;
