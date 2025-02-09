import React from 'react';
import { useParams } from 'react-router-dom';

const Content = () => {
    const { menu, submenu } = useParams();
    return (
        <div className="content p-4">
            <h1 className="text-2xl font-bold">{submenu || menu}</h1>
            <p>Data about {submenu || menu}</p>
        </div>
    );
};

export default Content;
