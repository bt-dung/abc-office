import { useState, useRef } from "react";
import IconUserUI from "@/ui/userIcon/userIcon";
import ListOptionProfile from "../listOptionProfile/listOptionProfile";
import useClickOutside from "@/hooks/clickOutSide";
import styles from "./userProfileButton.module.scss";

const UserProfileButton = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useClickOutside(ref, () => setIsOpen(false));

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className={styles['profile-wrapper']} ref={ref}>
            <IconUserUI user={user} onClick={handleToggle} />
            <div className={`${styles['profile-dropdown']} ${isOpen ? styles['open'] : ''}`}>
                <ListOptionProfile />
            </div>
        </div>
    );
};

export default UserProfileButton;