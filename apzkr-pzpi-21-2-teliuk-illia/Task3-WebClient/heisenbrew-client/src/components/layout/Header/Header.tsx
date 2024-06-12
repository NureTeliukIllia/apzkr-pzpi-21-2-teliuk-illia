import { FC } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IHeaderProps } from "../../../types/interfaces";
import { Button } from "../../Button/Button";
import logo from "../../../assets/logo-transparent-svg.svg";
import { Box } from "@mui/material";
import LanguageChangerButton from "../../LanguageChanger";

export const Header: FC<IHeaderProps> = (props: IHeaderProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const LogOut = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("bearer");
        navigate("/");
        props.setIsLogged(false);
    };

    return (
        <div className={styles["header"]}>
            <div className={styles["container"]}>
                <div className={styles["logo__container"]}>
                    <img src={logo} alt="logo" />
                </div>
                <nav className={styles["nav"]}>
                    <Link className={styles["nav-link"]} to="/">
                        {t("home")}
                    </Link>
                    <Link
                        className={styles["nav-link"]}
                        to={props.isLogged ? "/me" : "/login"}
                        onClick={() => {
                            if (!props.isLogged) {
                                toast.warn(t("loginFirst"));
                            }
                        }}
                    >
                        {t("myProfile")}
                    </Link>
                </nav>{" "}
                <Box>
                    <LanguageChangerButton />
                </Box>
                <div className={styles["auth"]}>
                    {props.isLogged ? (
                        <div>
                            <Button
                                title={t("logOut")}
                                handleClick={() => LogOut()}
                            >
                                <h1>{t("logOut")}</h1>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button title={t("login")}>
                                    <h1>{t("login")}</h1>
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button
                                    customStyles={styles["sign-up"]}
                                    title={t("signUp")}
                                >
                                    <h1>{t("signUp")}</h1>
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
