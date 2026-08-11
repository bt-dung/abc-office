import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCells, faSitemap, faUsersGear, faUserGroup, faCalendar, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import styles from "./sidebar.module.scss";

const Sidebar = ({ isOpen }) => {
    return (
        <aside className={`${styles['sidebar']} ${isOpen ? styles['is-open'] : ''}`}>
            <nav>
                <ul>
                    <li>
                        <Link href="/dashboard"><span><FontAwesomeIcon icon={faTableCells} /></span>Dashboard</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/departments"><span><FontAwesomeIcon icon={faSitemap} /></span>Phòng ban</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/users"><span><FontAwesomeIcon icon={faUsersGear} /></span>Nhân sự</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/contact"><span><FontAwesomeIcon icon={faUserGroup} /></span>Contact</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/attendance"><span><FontAwesomeIcon icon={faCalendar} /></span>Attendance</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/about"><span><FontAwesomeIcon icon={faCircleInfo} /></span>About</Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;