import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import styles from "./departments.module.scss";

export default function MyTeam({ team, loadError }) {
  console.log("team:", team);
  return (
    <div className={styles["dept-page"]}>
      <div className={styles["dept-page__header"]}>
        <h1 className={styles["title"]}>
          {team ? `Team: ${team.name}` : "Team của tôi"}
        </h1>
      </div>

      <div className={styles["dept-page__content"]}>
        {loadError && <div className={styles["error-banner"]}>{loadError}</div>}

        {!loadError && team?.members?.length === 0 && (
          <p className={styles["empty"]}>Phòng ban này chưa có thành viên nào.</p>
        )}

        {!loadError && team?.members?.length > 0 && (
          <ul className={styles["dept-node__members"]}>
            {team.members.map((member) => (
              <li key={member.id}>
                <span>
                  <FontAwesomeIcon icon={faUserGroup} /> {member.username}
                </span>
                <span>{member.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
