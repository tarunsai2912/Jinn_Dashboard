import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMenus } from '../redux/menuSlice';
import { IoIosArrowDown } from 'react-icons/io';
import { IoIosArrowForward } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa6";
import { ImAndroid } from "react-icons/im";
import { MdOutlineHorizontalRule } from "react-icons/md";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const imgArray = [<FaHome />, <FaChartPie />, <ImAndroid />];
    const menus = useSelector(state => state.menus);
    const dispatch = useDispatch();
    const [expandedMenus, setExpandedMenus] = useState({});
    let currentIndex = 0;

    useEffect(() => {
        dispatch(fetchMenus());
    }, [dispatch]);

    const toggleMenu = (menuName) => {
        setExpandedMenus({
            ...expandedMenus,
            [menuName]: !expandedMenus[menuName],
        });
    };

    return (
        <div className={`fixed inset-y-0 left-0 md:top-4 transform z-10 flex flex-col gap-2 md:w-1/4 w-[70vw] bg-[#1D267B] p-4 md:ml-2 overflow-y-auto md:h-[95vh] h-full shadow-lg md:rounded-xl [box-shadow:2px_2px_4px_0px_#00000040] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 md:relative md:translate-x-0 text-white`}>
            <div className="md:hidden flex items-end justify-end">
                <IoMdClose className='text-white' size={30} onClick={() => setIsSidebarOpen(false)} />
            </div>
            <div className="flex flex-col gap-[3vh]">
                {menus.map((menu, menuIndex) => (
                    <div key={menu.name} >
                        <div className="flex flex-row justify-between items-center cursor-pointer">
                           <Link to={`/${menu.name}`} onClick={() => setIsSidebarOpen(false)}>
                            <span className='flex flex-row items-center gap-2'>
                                {imgArray[(currentIndex + menuIndex) % imgArray.length]} {menu.name}
                            </span>
                            </Link>
                            {expandedMenus[menu.name] ? <IoIosArrowDown onClick={() => toggleMenu(menu.name)} /> : <IoIosArrowForward onClick={() => toggleMenu(menu.name)} />}
                        </div>
                        {expandedMenus[menu.name] && (
                            <div className="pl-4 relative">
                                <div className="absolute left-[10px] top-0 bottom-0 border-l-2 border-dotted border-gray-400"></div>
                                {menu.subMenus.map((submenu, submenuIndex) => (
                                    <div key={submenu.name} className="relative flex items-center">
                                        <div className="absolute left-0">
                                            <MdOutlineHorizontalRule />
                                        </div>
                                        <Link to={`/${menu.name}/${submenu.name}`} className="block py-1 pl-6" onClick={() => setIsSidebarOpen(false)}>
                                            {submenu.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
