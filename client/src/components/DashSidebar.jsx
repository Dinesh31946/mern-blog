import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';

const DashSidebar = () => {

    const location = useLocation();
    const [tab, setTab] = useState();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');

        if (tabFromUrl) {
            setTab(tabFromUrl);
        }

    }, [location.search]);

    return (
        <Sidebar className='w-full md:w-56'>
            <SidebarItems>
                <SidebarItemGroup>
                    <Link to='/dashboard?tab=profile'>
                        <SidebarItem
                            className="cursor-pointer"
                            active={tab === "profile"}
                            icon={HiUser} label={'user'}
                            labelColor="dark"
                            as='div'
                        >
                            Profile
                        </SidebarItem>
                    </Link>
                    <SidebarItem className="cursor-pointer" icon={HiArrowSmRight} >
                        Sign Out
                    </SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    )
}

export default DashSidebar
