"use client";

import { useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faSitemap,
  faUserPlus,
  faUserMinus,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./departments.module.scss";
import {
  createDepartment,
  addChildDepartment,
  updateDepartment,
  dissolveDepartment,
  assignUserToDepartment,
  removeUserFromDepartment,
} from "./actions";

function DepartmentNode({ dept, depth, users, onAddChild, onEdit, onDissolve, onAssignStaff, onRemoveStaff }) {
  const members = users.filter((u) => u.dept_id === dept.id);
  const manager = users.find((u) => u.id === dept.manager_id);
  console.log("thanh vien:", members);
  console.log("quan ly:", manager);

  return (
    <div className={styles["dept-node"]}>
      <div className={styles["dept-node__row"]} style={{ paddingLeft: `${depth * 1.5}rem` }}>
        <FontAwesomeIcon icon={faSitemap} className={styles["dept-node__icon"]} />
        <span className={styles["dept-node__name"]}>{dept.name}</span>
        <span className={styles["dept-node__manager"]}>
          {manager ? `Quản lý: ${manager.username}` : "Chưa có quản lý"}
        </span>
        <div className={styles["dept-node__actions"]}>
          <button onClick={() => onAssignStaff(dept)} title="Thêm nhân sự">
            <FontAwesomeIcon icon={faUserPlus} />
          </button>
          <button onClick={() => onAddChild(dept)} title="Thêm phòng ban con">
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button onClick={() => onEdit(dept)} title="Sửa">
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button onClick={() => onDissolve(dept)} title="Giải thể" className={styles["danger"]}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      {members.length > 0 && (
        <ul className={styles["dept-node__members"]} style={{ marginLeft: `${depth * 1.5 + 2.25}rem` }}>
          {members.map((member) => (
            <li key={member.id}>
              <span>{member.username}</span>
              <button onClick={() => onRemoveStaff(member)} title="Gỡ khỏi phòng ban">
                <FontAwesomeIcon icon={faUserMinus} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {dept.children?.length > 0 && (
        <div className={styles["dept-node__children"]}>
          {dept.children.map((child) => (
            <DepartmentNode
              key={child.id}
              dept={child}
              depth={depth + 1}
              users={users}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDissolve={onDissolve}
              onAssignStaff={onAssignStaff}
              onRemoveStaff={onRemoveStaff}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const emptyForm = { name: "", manager_id: "" };

export default function DepartmentsClient({ initialDepartments, users, loadError }) {
  const departments = initialDepartments;
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState(null); // { mode, parent?, target? }
  const [form, setForm] = useState(emptyForm);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState(null);

  function openCreate() {
    setModal({ mode: "create" });
    setForm(emptyForm);
    setError(null);
  }

  function openAddChild(dept) {
    setModal({ mode: "add-child", parent: dept });
    setForm(emptyForm);
    setError(null);
  }

  function openEdit(dept) {
    setModal({ mode: "edit", target: dept });
    setForm({ name: dept.name, manager_id: dept.manager_id ? String(dept.manager_id) : "" });
    setError(null);
  }

  function openAssignStaff(dept) {
    setModal({ mode: "assign-staff", target: dept });
    setSelectedUserId("");
    setError(null);
  }

  function closeModal() {
    setModal(null);
  }

  function handleDissolve(dept) {
    if (!window.confirm(`Giải thể phòng ban "${dept.name}"? Nhân sự sẽ được đưa về trạng thái chờ.`)) {
      return;
    }
    startTransition(async () => {
      try {
        await dissolveDepartment(dept.id);
      } catch (err) {
        window.alert(err.message || "Không thể giải thể phòng ban.");
      }
    });
  }

  function handleRemoveStaff(member) {
    if (!window.confirm(`Gỡ "${member.username}" khỏi phòng ban?`)) return;
    startTransition(async () => {
      try {
        await removeUserFromDepartment(member.id);
      } catch (err) {
        window.alert(err.message || "Không thể gỡ nhân sự khỏi phòng ban.");
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    startTransition(async () => {
      try {
        if (modal.mode === "create") {
          await createDepartment(form);
        } else if (modal.mode === "add-child") {
          await addChildDepartment(modal.parent.id, form);
        } else if (modal.mode === "edit") {
          await updateDepartment(modal.target.id, form);
        } else if (modal.mode === "assign-staff") {
          if (!selectedUserId) {
            setError("Vui lòng chọn một nhân sự.");
            return;
          }
          await assignUserToDepartment(Number(selectedUserId), modal.target.id);
        }
        closeModal();
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra.");
      }
    });
  }

  const candidateUsers =
    modal?.mode === "assign-staff"
      ? users.filter((u) => u.dept_id !== modal.target.id)
      : [];

  return (
    <main className={styles["dept-page"]}>
      <div className={styles["dept-page__header"]}>
        <h1 className={styles["title"]}>Phòng ban</h1>
        <button className={styles["add-btn"]} onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} />
          <span>Thêm phòng ban</span>
        </button>
      </div>

      {loadError && <p className={styles["error-banner"]}>{loadError}</p>}

      <div className={styles["dept-page__content"]}>
        {departments.length === 0 ? (
          <p className={styles["empty"]}>Chưa có phòng ban nào.</p>
        ) : (
          departments.map((dept) => (
            <DepartmentNode
              key={dept.id}
              dept={dept}
              depth={0}
              users={users}
              onAddChild={openAddChild}
              onEdit={openEdit}
              onDissolve={handleDissolve}
              onAssignStaff={openAssignStaff}
              onRemoveStaff={handleRemoveStaff}
            />
          ))
        )}
      </div>

      {modal && (
        <div className={styles["modal-overlay"]} onClick={closeModal}>
          <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h2>
                {modal.mode === "create" && "Thêm phòng ban mới"}
                {modal.mode === "add-child" && `Thêm phòng ban con của "${modal.parent.name}"`}
                {modal.mode === "edit" && "Sửa phòng ban"}
                {modal.mode === "assign-staff" && `Thêm nhân sự vào "${modal.target.name}"`}
              </h2>
              <button className={styles["close-btn"]} onClick={closeModal}>×</button>
            </div>

            {modal.mode === "assign-staff" ? (
              <form className={styles["modal-body"]} onSubmit={handleSubmit}>
                <div className={styles["form-group"]}>
                  <label>Chọn nhân sự *</label>
                  <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required>
                    <option value="">-- Chọn user --</option>
                    {candidateUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
                {error && <p className={styles["form-error"]}>{error}</p>}
                <button type="submit" className={styles["submit-btn"]} disabled={isPending}>
                  {isPending ? "Đang lưu..." : "Thêm vào phòng ban"}
                </button>
              </form>
            ) : (
              <form className={styles["modal-body"]} onSubmit={handleSubmit}>
                <div className={styles["form-group"]}>
                  <label>Tên phòng ban *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>Người quản lý (tùy chọn)</label>
                  <select
                    value={form.manager_id}
                    onChange={(e) => setForm((prev) => ({ ...prev, manager_id: e.target.value }))}
                  >
                    <option value="">-- Không chọn --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
                {error && <p className={styles["form-error"]}>{error}</p>}
                <button type="submit" className={styles["submit-btn"]} disabled={isPending}>
                  {isPending ? "Đang lưu..." : "Lưu"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
