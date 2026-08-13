"use client";

import { useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faUserMinus, faUserGroup, faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./MemberItem.module.scss";
import modalStyles from "@/app/dashboard/departments/departments.module.scss";
import { Can } from "@/components/authorization/Can";
import { Permission } from "@/auth/permissions";
import {
    removeUserFromDepartment,
    assignPositionToUser,
    unassignPositionFromUser,
} from "./actions";

export default function MemberItem({
    member,
    position,
    currentUser,
    dept,
    email,
    departmentPositions,
}) {
    const [isRemovePending, startRemoveTransition] = useTransition();
    const [isSetPositionPending, startSetPositionTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPositionId, setSelectedPositionId] = useState(
        position?.id ? String(position.id) : ""
    );
    const [error, setError] = useState(null);

    // Policy check for actions
    const canManage = currentUser && dept && (currentUser.role_id === 1 || (currentUser.role_id === 2 && currentUser.id === dept.manager_id));

    const handleRemoveStaff = () => {
        if (
            !window.confirm(
                `Bạn có chắc muốn gỡ nhân sự "${member.username}" khỏi phòng ban này?`
            )
        ) {
            return;
        }
        startRemoveTransition(async () => {
            try {
                await removeUserFromDepartment(member.id);
            } catch (err) {
                alert(err.message || "Đã có lỗi xảy ra.");
            }
        });
    };

    const openModal = () => {
        setError(null);
        setSelectedPositionId(position?.id ? String(position.id) : "");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSetPositionSubmit = (e) => {
        e.preventDefault();
        startSetPositionTransition(async () => {
            try {
                const targetUserId = member.id;
                const currentPositionId = member.position_id;
                const newPositionId = selectedPositionId
                    ? Number(selectedPositionId)
                    : null;

                if (currentPositionId !== newPositionId) {
                    if (newPositionId === null) {
                        await unassignPositionFromUser(targetUserId);
                    } else {
                        await assignPositionToUser(targetUserId, newPositionId);
                    }
                }
                closeModal();
            } catch (err) {
                setError(err.message || "Có lỗi xảy ra.");
            }
        });
    };

    const isPending = isRemovePending || isSetPositionPending;

    return (
        <>
            <li className={styles.item}>
                <span className={styles.name}>
                    {email && <FontAwesomeIcon icon={faUserGroup} />} {member.username}
                </span>
                <Can
                    permission={Permission.USER_MANAGE_POSITION}
                    fallback={
                        <div className={`${styles.position} ${position ? styles["position--assigned"] : styles["position--unassigned"]}`}>
                            <span className={styles["position__label"]}>{position ? position.title : "Chưa có vị trí"}</span>
                        </div>
                    }
                >
                    {canManage ? (
                        <button
                            type="button"
                            onClick={openModal}
                            title={position ? "Sửa vị trí công việc" : "Thiết lập vị trí công việc"}
                            className={`${styles.position} ${styles["position--interactive"]} ${position ? styles["position--assigned"] : styles["position--unassigned"]}`}
                            disabled={isPending}
                            aria-label={position ? "Sửa vị trí công việc" : "Thiết lập vị trí công việc"}
                        >
                            <span className={styles["position__label"]}>{position ? position.title : "Chưa có vị trí"}</span>
                            <FontAwesomeIcon icon={position ? faPen : faPlus} className={styles["position__icon"]} />
                        </button>
                    ) : (
                        <div className={`${styles.position} ${position ? styles["position--assigned"] : styles["position--unassigned"]}`}>
                            <span className={styles["position__label"]}>{position ? position.title : "Chưa có vị trí"}</span>
                        </div>
                    )}
                </Can>

                <div className={styles.actions}>
                    <Can permission={Permission.USERS_WRITE}>
                        {canManage && (
                            <button
                                onClick={handleRemoveStaff}
                                title="Gỡ khỏi phòng ban"
                                className={`${styles.actionButton} ${styles.iconOnly} ${styles["actionButton--remove"]}`}
                                disabled={isPending}
                                aria-label="Gỡ khỏi phòng ban"
                            >
                                <FontAwesomeIcon icon={faUserMinus} />
                            </button>
                        )}
                    </Can>
                </div>
            </li>

            {isModalOpen && (
                <div className={modalStyles["modal-overlay"]} onClick={closeModal}>
                    <div
                        className={modalStyles["modal"]}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={modalStyles["modal-header"]}>
                            <h2>{`Thiết lập vị trí cho "${member.username}"`}</h2>
                            <button
                                className={modalStyles["close-btn"]}
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>
                        <form
                            className={modalStyles["modal-body"]}
                            onSubmit={handleSetPositionSubmit}
                        >
                            <div className={modalStyles["form-group"]}>
                                <label>Vị trí công việc</label>
                                <div className={modalStyles["position-picker"]}>
                                    <select
                                        value={selectedPositionId}
                                        onChange={(e) => setSelectedPositionId(e.target.value)}
                                        aria-label="Chọn vị trí công việc"
                                    >
                                        <option value="">Chưa có vị trí</option>
                                        {departmentPositions.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.title}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedPositionId && (
                                        <button
                                            type="button"
                                            className={modalStyles["position-picker__clear"]}
                                            onClick={() => setSelectedPositionId("")}
                                            title="Bỏ vị trí đã chọn"
                                            aria-label="Bỏ vị trí đã chọn"
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {error && (
                                <p className={modalStyles["form-error"]}>{error}</p>
                            )}
                            <button
                                type="submit"
                                className={modalStyles["submit-btn"]}
                                disabled={isSetPositionPending}
                            >
                                {isSetPositionPending ? "Đang cập nhật..." : "Cập nhật"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
