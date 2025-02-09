import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addMenu } from './redux/menuSlice';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { FaPlus } from 'react-icons/fa';
import Modal from './components/Modal';
import { IoMdClose } from "react-icons/io";
import { FaBars } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const App = () => {
    const [menuName, setMenuName] = useState('');
    const [submenuNames, setSubmenuNames] = useState(['']);
    const existingMenus = useSelector(state => state.menus);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const dispatch = useDispatch();
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleAddSubmenuField = () => {
        setSubmenuNames([...submenuNames, '']);
    };

    const handleSubmenuChange = (index, value) => {
        const newSubmenus = [...submenuNames];
        newSubmenus[index] = value;
        setSubmenuNames(newSubmenus);
    };

    const handleAddMenu = () => {
      if (submenuNames.some(submenu => submenu.trim() === '')) {
        toast.error('Submenu names cannot be empty');
        return;
      }    
      if (!menuName.trim()) {
        toast.error('Task name cannot be empty');
        return;
      }
      if (existingMenus.some(menu => menu.name.toLowerCase() === menuName.toLowerCase())) {
        toast.error('Menu with this name already exists');
        return;
      }
      setModalLoading(true);
      const newMenu = {
        name: menuName,
        subMenus: submenuNames.map(name => ({ name })),
      };
      try {
        dispatch(addMenu(newMenu)).unwrap();
        setMenuName('');
        setSubmenuNames(['']);
        setModalOpen(false);
        toast.success('Menu added successfully');
      } catch (error) {
        toast.error('Failed to add menu');
      } finally {
        setModalLoading(false);
      }
    };

    return (
      <Router>
        <Toaster />
        <div className="flex h-screen bg-gradient-to-br from-[#dfe9f3] to-[#efefef]">
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <Modal isOpen={modalOpen}>
            <div className='md:w-[50vw] w-[70vw]'>
              <div className='flex flex-row justify-between items-center mb-4'>
                <h2 className="text-xl font-bold">Add New Menu</h2>
                <IoMdClose className='cursor-pointer' size={30} onClick={() => {
                  setModalOpen(false);
                }} />
              </div>
              <input
                type="text"
                placeholder="Menu Name"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                className="focus:outline-none mb-4 p-2 w-full text-[#9B959F] bg-white rounded border-[1px] border-solid border-[#E2E2E2] [box-shadow:0px_1px_2px_0px_#4D40551A]"
              />
              <div className='w-full max-h-[15vh] overflow-y-scroll flex flex-col'>
                {submenuNames.map((submenu, index) => (
                  <div key={index} className="p-2 flex items-center gap-2 mb-4 rounded border-[1px] border-solid border-[#E2E2E2]">
                    <input
                      type="text"
                      placeholder={`Submenu ${index + 1}`}
                      value={submenu}
                      onChange={(e) => handleSubmenuChange(index, e.target.value)}
                      className="w-full bg-white text-[#828282] focus:outline-none"
                      required
                    />
                  </div>
                ))}
              </div>
              <div onClick={handleAddSubmenuField} className="mb-4 w-full text-[#767575] flex flex-row items-center gap-2 cursor-pointer"><FaPlus /> Add SubMenu Field</div>
                <button
                  onClick={handleAddMenu}
                  disabled={modalLoading}
                  className="mb-4 p-2 w-full bg-green-500 rounded cursor-pointer hover:opacity-[0.5] text-white flex justify-center items-center"
                >
                {modalLoading ? (
                  <span>Loading...</span>
                ) : (
                  'Save Menu'
                )}
                </button>
              </div>
            </Modal>
            <div className="w-full md:w-3/4 bg-gradient-to-br from-[#dfe9f3] to-[#efefef] p-4 overflow-y-auto flex flex-col gap-2">
              <div className='flex flex-row items-center justify-between md:text-left'>
                <div className="lg:hidden text-left text-[#1D267B]">
                  <FaBars className="text-xl" onClick={toggleSidebar} />
                </div>
                <button onClick={() => {
                  setModalOpen(true);
                }} className="flex flex-row items-center gap-2 bg-[#1D267B] text-white p-2 rounded-lg hover:opacity-[0.5]">
                  <FaPlus />
                  Add Menu
                </button>
              </div>
              <Routes>
                <Route path="/:menu/:submenu" element={<Content />} />
                <Route path="/:menu" element={<Content />} />
                <Route path="/" element={
                    <div className='flex justify-center items-center mt-[10vh]'>
                        <h1 className='text-3xl'>Please Select a Menu</h1>
                    </div>} />
              </Routes>
            </div>
          </div>
        </Router>
    );
};

export default App;
