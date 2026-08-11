"use client";

import { useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faUserCheck, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "./users.module.scss";
import { createUser, updateUser, activateUser, deactivateUser } from "./actions";

const STATUS_LABEL = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
  PENDING: "Chờ kích hoạt",
  SUSPENDED: "Tạm khóa",
};

const emptyForm = { username: "", email: "", password: "", role_id: "", dept_id: "" };

export default function UsersClient({ initialUsers, loadError }) {
  const users = initialUsers;
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState(null); // { mode: 'create' | 'edit', target? }
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);

  function openCreate() {
    setModal({ mode: "create" });
    setForm(emptyForm);
    setError(null);
  }

  function openEdit(user) {
    setModal({ mode: "edit", target: user });
    setForm({
      username: user.username,
      email: user.email,
      password: "",
      role_id: user.role_id ? String(user.role_id) : "",
      dept_id: user.dept_id ? String(user.dept_id) : "",
    });
    setError(null);
  }

  function closeModal() {
    setModal(null);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleToggleStatus(user) {
    const action = user.status === "ACTIVE" ? "vô hiệu hóa" : "kích hoạt";
    if (!window.confirm(`Xác nhận ${action} tài khoản "${user.username}"?`)) return;

    startTransition(async () => {
      try {
        if (user.status === "ACTIVE") {
          await deactivateUser(user.id);
        } else {
          await activateUser(user.id);
        }
      } catch (err) {
        window.alert(err.message || "Không thể cập nhật trạng thái.");
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    startTransition(async () => {
      try {
        if (modal.mode === "create") {
          await createUser(form);
        } else {
          await updateUser(modal.target.id, form);
        }
        closeModal();
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra.");
      }
    });
  }

  return (
    <main className={styles["users-page"]}>
      <div className={styles["users-page__header"]}>
        <h1 className={styles["title"]}>Nhân sự</h1>
        <button className={styles["add-btn"]} onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} />
          <span>Thêm tài khoản</span>
        </button>
      </div>

      {loadError && <p className={styles["error-banner"]}>{loadError}</p>}

      <div className={styles["users-page__content"]}>
        <div className={styles["table-responsive"]}>
          <table className={styles["users-page__table"]}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Role ID</th>
                <th>Phòng ban ID</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.username}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`${styles["status-badge"]} ${styles[`status-badge--${user.status?.toLowerCase()}`]}`}>
                        {STATUS_LABEL[user.status] || user.status}
                      </span>
                    </td>
                    <td>{user.role_id}</td>
                    <td>{user.dept_id ?? "-"}</td>
                    <td className={styles["actions"]}>
                      <button onClick={() => openEdit(user)} title="Sửa">
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        title={user.status === "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"}
                        className={user.status === "ACTIVE" ? styles["danger"] : styles["success"]}
                      >
                        <FontAwesomeIcon icon={user.status === "ACTIVE" ? faUserSlash : faUserCheck} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
                    Chưa có tài khoản nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className={styles["modal-overlay"]} onClick={closeModal}>
          <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h2>{modal.mode === "create" ? "Thêm tài khoản mới" : "Sửa tài khoản"}</h2>
              <button className={styles["close-btn"]} onClick={closeModal}>×</button>
            </div>
            <form className={styles["modal-body"]} onSubmit={handleSubmit}>
              <div className={styles["form-group"]}>
                <label>Username *</label>
                <input value={form.username} onChange={(e) => updateField("username", e.target.value)} required />
              </div>
              <div className={styles["form-group"]}>
                <label>Email *</label>
                <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
              </div>
              {modal.mode === "create" && (
                <div className={styles["form-group"]}>
                  <label>Mật khẩu * (tối thiểu 8 ký tự, có chữ + số + ký tự đặc biệt)</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    required
                  />
                </div>
              )}
              <div className={styles["form-group"]}>
                <label>Role ID * (1 = ADMIN, 2 = MANAGER, 3 = USER)</label>
                <input
                  value={form.role_id}
                  onChange={(e) => updateField("role_id", e.target.value)}
                  required={modal.mode === "create"}
                  inputMode="numeric"
                />
              </div>
              <div className={styles["form-group"]}>
                <label>Phòng ban ID (tùy chọn)</label>
                <input value={form.dept_id} onChange={(e) => updateField("dept_id", e.target.value)} inputMode="numeric" />
              </div>
              {error && <p className={styles["form-error"]}>{error}</p>}
              <button type="submit" className={styles["submit-btn"]} disabled={isPending}>
                {isPending ? "Đang lưu..." : "Lưu"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
