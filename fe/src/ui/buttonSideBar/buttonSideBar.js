"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import "./buttonSideBar.module.scss";


const ButtonSideBar = ({onClick}) =>{ 
    return (
        <button className="btn-sidebar-toggle" onClick={onClick} aria-label="Toggle sidebar">
            <FontAwesomeIcon icon={faBars} />
        </button>
    );
};
export default ButtonSideBar;