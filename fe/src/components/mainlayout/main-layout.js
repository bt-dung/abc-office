"use client";

import { useState } from "react";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import styles from "./mainLayout.module.scss";


const MainLayout = ({ children, user }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className={`${styles['main-layout-container']} ${isSidebarOpen ? styles['sidebar-open'] : ''}`}>
            <Header user={user} onToggleSidebar={toggleSidebar} />
            <div className={styles['main-layout-content']}>
                <Sidebar isOpen={isSidebarOpen} />
                <main className={styles['main-content-area']}>{children}</main>
                {isSidebarOpen && (
                    <div className={styles['sidebar-overlay']} onClick={toggleSidebar} />
                )}
            </div>
        </div>
    );
};

export default MainLayout;
