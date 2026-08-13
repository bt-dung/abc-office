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
import { Can } from "@/components/authorization/Can";
import { Permission } from "@/auth/permissions";
import { useAuth } from "@/auth/use-auth";
import {
  createDepartment,
  addChildDepartment,
  updateDepartment,
  dissolveDepartment,
  assignUserToDepartment,
} from "./actions";

import MemberItem from "../../../ui/memberItem/MemberItem";

function DepartmentNode({ dept, depth, users, positions, onAddChild, onEdit, onDissolve, onAssignStaff, currentUser }) {
  const members = users.filter((u) => u.dept_id === dept.id);
  const manager = users.find((u) => u.id === dept.manager_id);

  return (
    <div className={styles["dept-node"]}>
      <div className={styles["dept-node__row"]} style={{ paddingLeft: `${depth * 1.5}rem` }}>
        <FontAwesomeIcon icon={faSitemap} className={styles["dept-node__icon"]} />
        <span className={styles["dept-node__name"]}>{dept.name}</span>
        <span className={styles["dept-node__manager"]}>
          {manager ? `Quản lý: ${manager.username}` : "Chưa có quản lý"}
        </span>
        <div className={styles["dept-node__actions"]}>
          <Can permission={Permission.USERS_WRITE}>
            {/* Policy: Manager can assign staff to their own department */}
            {currentUser && (currentUser.role_id === 1 || (currentUser.role_id === 2 && currentUser.id === dept.manager_id)) && (
              <button onClick={() => onAssignStaff(dept)} title="Thêm nhân sự" className={styles["icon-only"]}>
                <FontAwesomeIcon icon={faUserPlus} />
              </button>
            )}
          </Can>
          <Can permission={Permission.DEPARTMENT_WRITE}>
            <>
              {/* Policy: Admin can add child, edit, dissolve any department. Manager cannot. */}
              {/* The DEPARTMENT_WRITE permission is already checked by Can component. */}
              {/* No additional check for manager here, as manager doesn't have DEPARTMENT_WRITE */}
              <button onClick={() => onAddChild(dept)} title="Thêm phòng ban con">
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button onClick={() => onEdit(dept)} title="Sửa">
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button
                onClick={() => onDissolve(dept)}
                title="Giải thể"
                className={styles["danger"]}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </>
          </Can>
        </div>
      </div>

      {members.length > 0 && (
        <ul className={styles["dept-node__members"]} style={{ marginLeft: `${depth * 1.5 + 2.25}rem` }}>
          {members.map((member) => {
            const position = positions.find((p) => p.id === member.position_id);
            console.log("position:", position);
            const departmentPositions = positions.filter((p) => p.dept_id === dept.id);
            return (
              <MemberItem
                key={member.id}
                member={member}
                position={position}
                currentUser={currentUser}
                dept={dept}
                departmentPositions={departmentPositions}
              />
            );
          })}
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
              positions={positions}
              currentUser={currentUser}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDissolve={onDissolve}
              onAssignStaff={onAssignStaff}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const emptyForm = { name: "", manager_id: "" };

export default function DepartmentsClient({ initialDepartments, users, positions, loadError }) {
  const { user: currentUser } = useAuth();
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
        <Can permission={Permission.DEPARTMENT_WRITE}>
          <button className={styles["add-btn"]} onClick={openCreate}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Thêm phòng ban</span>
          </button>
        </Can>
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
              positions={positions}
              currentUser={currentUser} // Pass currentUser down
              onAddChild={openAddChild}
              onEdit={openEdit}
              onDissolve={handleDissolve}
              onAssignStaff={openAssignStaff}
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
