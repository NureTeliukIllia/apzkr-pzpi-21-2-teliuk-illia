import { LockOutlined } from "@mui/icons-material";
import {
    Container,
    Box,
    Avatar,
    Typography,
    TextField,
    Grid,
} from "@mui/material";
import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../services/authApi";
import { toast } from "react-toastify";
import { IAuthProps } from "../../types/interfaces";
import { Button } from "../../components/Button/Button";
import styles from "./Auth.module.scss";
import { useTranslation } from "react-i18next";

const Login: FC<IAuthProps> = (props: IAuthProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();


    const handleLogin = () => {
        const response = signIn({ email: email, password: password });
        response
            .then((data) => {
                console.log("User: ", data);
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("userRole", data.userRole);
                localStorage.setItem("bearer", data.bearer);
                props.setIsLogged(true);
                navigate("/me");
            })
            .catch((error: any) => {
                if (error.response) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Couldn't log you in, try again.");
                }
            });
    };

    return (
        <>
            <Container style={{ marginTop: "1rem" }} maxWidth="lg">
                <Box
                    className={styles["Auth-box"]}
                    sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar
                        sx={{
                            m: 1,
                            bgcolor: "rgb(56, 55, 54)",
                            height: "10rem",
                            width: "10rem",
                        }}
                        className={styles["Avatar"]}
                    >
                        <LockOutlined sx={{ fontSize: "5rem" }} />
                    </Avatar>
                    <Typography variant="h2">{t("login")}</Typography>
                    <Box sx={{ mt: 1 }} className={styles["Auth-box"]}>
                        <TextField
                            InputProps={{
                                className: styles["Text-field"],
                            }}
                            InputLabelProps={{
                                className: styles["Text-field--label"],
                            }}
                            required
                            fullWidth
                            id="email"
                            label={t("emailAddress")}
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            InputProps={{
                                className: styles["Text-field"],
                            }}
                            InputLabelProps={{
                                className: styles["Text-field--label"],
                            }}
                            required
                            fullWidth
                            margin="normal"
                            id="password"
                            name="password"
                            label={t("password")}
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />

                        <Button
                            customStyles={styles["Button"]}
                            handleClick={handleLogin}
                            title={t("login")}
                        >
                            {t("login")}
                        </Button>
                        <Grid container justifyContent={"flex-end"}>
                            <Grid item>
                                <Link to="/register" className={styles["Link"]}>
                                    {t("dontHaveAccount")}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Login;
