import { FC } from "react";
import styles from "./NotFound.module.scss";
import { useTranslation } from "react-i18next";

const NotFound: FC = () => {
    const { t } = useTranslation();

    return (
        <div className={styles["not-found"]}>
            <h1>
                <span>🕵🏿</span>
            </h1>
            <p className={styles["nothing-found"]}>{t("nothingFound")}</p>
            <p className={styles["description"]}>{t("noSuchPage")}</p>
        </div>
    );
};

export default NotFound;
