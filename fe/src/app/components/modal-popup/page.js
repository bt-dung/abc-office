'use client'
import styles from "./popup.module.scss";

export default function Popup() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.popup}>
                <button popovertarget="my-popover">Open here</button>
                <div popover="auto" id="my-popover" className={styles.popupContent}>
                    <div className={styles.bodyPopup}>
                        <h1>Welcome back!</h1>
                        heloo
                    </div>
                </div>
            </div>
            <div className={styles["timeline-icon"]}>
                <div className={styles["line"]}></div>
                <div className={styles["dot"]}></div>
            </div>
        <dialog id="mydialog">
            Hello
            <button onClick={() => mydialog.close()}>
                Close
            </button>
        </dialog>

        <button
            onClick={() => mydialog.showModal()}
            className={styles.buttonModal}
        >
            Open
        </button>
        </div>
    )
};

