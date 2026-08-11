"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import styles from "./userIcon.module.scss";

const IconUserUI = ({ user, onClick }) => {
    return (
        <div className={styles['user-profile-container']}>
            <div className={styles['user-icon']} onClick={onClick}>
                <FontAwesomeIcon icon={faUser} />
            </div>
            <div className={styles['user-name']}>
                {user ? <span>{user.username}</span> : <span>Guest</span>}
            </div>
        </div>
    );
};

export default IconUserUI;