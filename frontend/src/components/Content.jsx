import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addSubmenu, deleteMenu, deleteSubmenu } from '../redux/menuSlice';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

const Content = () => {
    const { menu, submenu } = useParams();
    const menus = useSelector(state => state.menus);
    const selectedMenu = menus.find(m => m.name === menu);

    const [newSubmenu, setNewSubmenu] = useState('');
    const dispatch = useDispatch();

    if (!selectedMenu) {
        return <h2 className="text-center mt-10 text-2xl">Menu Not Found</h2>;
    }

    const handleAddSubmenu = () => {
        if (!newSubmenu.trim()) {
            toast.error('Submenu name cannot be empty');
            return;
        }

        dispatch(addSubmenu({ menuId: selectedMenu._id, submenuName: newSubmenu }))
            .unwrap()
            .then(() => {
                toast.success('Submenu added successfully');
                setNewSubmenu('');
            })
            .catch(() => {
                toast.error('Failed to add submenu');
            });
    };

    const handleDeleteSubmenu = (submenuName) => {
        dispatch(deleteSubmenu({ menuId: selectedMenu._id, submenuName }))
            .unwrap()
            .then(() => toast.success('Submenu deleted successfully'))
            .catch(() => toast.error('Failed to delete submenu'));
    };

    const handleDeleteMenu = () => {
        dispatch(deleteMenu(selectedMenu._id))
            .unwrap()
            .then(() => toast.success('Menu deleted successfully'))
            .catch(() => toast.error('Failed to delete menu'));
    };

    return (
        <div className="p-4 h-[88vh]">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{selectedMenu.name}</h1>
                <FaTrash
                    className="text-red-500 cursor-pointer mr-2"
                    onClick={handleDeleteMenu}
                    title="Delete Menu"
                />
            </div>

            {submenu ? (
                selectedMenu.subMenus.some(sub => sub.name === submenu) ? (
                    <div className="mt-4 p-2 rounded flex justify-between items-center border-[1px] border-solid border-[#E2E2E2] bg-white">
                        <span>{submenu}</span>
                        <FaTrash
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleDeleteSubmenu(submenu)}
                            title="Delete Submenu"
                        />
                    </div>
                ) : (
                    <h2 className="text-center mt-10 text-xl">Submenu Not Found</h2>
                )
            ) : (
                <>
                    <ul className="mt-4">
                        {selectedMenu.subMenus.map((sub, index) => (
                            <li key={index} className="p-2 border-[1px] border-solid border-[#E2E2E2] bg-white rounded mb-2 flex justify-between items-center">
                                <span>{sub.name}</span>
                                <FaTrash
                                    className="text-red-500 cursor-pointer"
                                    onClick={() => handleDeleteSubmenu(sub.name)}
                                    title="Delete Submenu"
                                />
                            </li>
                        ))}
                    </ul>

                    <div className="mt-10">
                        <input
                            type="text"
                            placeholder="Enter new submenu"
                            value={newSubmenu}
                            onChange={(e) => setNewSubmenu(e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                        <button
                            onClick={handleAddSubmenu}
                            className="mt-2 bg-[#1D267B] text-white p-2 rounded w-full hover:opacity-[0.5]"
                        >
                            Add Submenu
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Content;
