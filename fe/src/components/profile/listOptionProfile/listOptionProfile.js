import OptionProfile from "@/ui/optionProfile/optionProfile";
import { useRouter } from "next/navigation";
import styles from "./listOptionProfile.module.scss";

const ListOptionProfile = () => {
    const router = useRouter();
    const options = [
        { name: "Thông tin cá nhân", color: "primary", onClick: () => router.push("/profile") },
        { name: "Đăng xuất", color: "danger", onClick: () => router.push("/") },
    ];

    const handleOptionClick = (option) => {
        if (option.onClick) {
            option.onClick();
        }
    };

    return (
        <div className={styles['list-option-profile']}>
            {options.map((option, index) => (
                <OptionProfile
                    key={index}
                    name={option.name}
                    color={option.color}
                    onClick={() => handleOptionClick(option)}
                />
            ))}
        </div>
    );
};

export default ListOptionProfile;