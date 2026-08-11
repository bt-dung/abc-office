"use client";
import styles from "./optionProfile.module.scss";

const OptionProfile = ({name,color, onClick}) => {
    return (
        <button className={`${styles[`btn-profile--${color}`]}`} onClick={onClick}>
            {name}
        </button>
    );
};

export default OptionProfile;