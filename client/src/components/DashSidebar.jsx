import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { useLocation, useNavigate } from 'react-router-dom';

const DashSidebar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [tab, setTab] = useState();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');

        if (tabFromUrl) {
            setTab(tabFromUrl);
        }

    }, [location.search]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <Sidebar className='w-full md:w-56'>
            <SidebarItems>
                <SidebarItemGroup>
                    <SidebarItem 
                        className="cursor-pointer" 
                        active={tab === "profile"} 
                        icon={HiUser} label={'user'} 
                        labelColor="dark" 
                        onClick={() => handleNavigation('/dashboard?tab=profile')}
                    >
                        Profile
                    </SidebarItem>
                    <SidebarItem className="cursor-pointer" icon={HiArrowSmRight} >
                        Sign Out
                    </SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    )
}

export default DashSidebar
