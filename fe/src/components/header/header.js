import { useAuth } from '@/auth/use-auth';
import UserProfileButton from "@/components/profile/userProfileButton/userProfileButton";
import ButtonDarkMode from "@/ui/buttonDarkMode/buttonDarkMode";
import ButtonSideBar from "@/ui/buttonSideBar/buttonSideBar";
import styles from "./header.module.scss";


const Header = ({ onToggleSidebar }) => {
    const { user } = useAuth();

    return (
        <header className={`${styles['header-dashboard']} bg-white shadow`}>
            <div className={styles['header-left']}>
                <ButtonSideBar onClick={onToggleSidebar} />
                <button className={styles['btn']}>logo</button>
            </div>
            <div className={styles['header-center']}>
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold">My Dashboard</h1>
                </div>
            </div>
            <div className={styles['header-right']}>
                <UserProfileButton user={user} />
                <ButtonDarkMode />
            </div>
        </header>
    );
};

export default Header;