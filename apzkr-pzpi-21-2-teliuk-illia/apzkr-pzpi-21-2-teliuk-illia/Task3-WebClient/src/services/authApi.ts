import axios from "axios";
import { ICredentials, ISignInResult } from "../types/interfaces";

const url = process.env.REACT_APP_SERVER_URL
    ? process.env.REACT_APP_SERVER_URL
    : "https://localhost:7084/api/";

export const signIn = async (credentials: ICredentials) => {
    const { data } = await axios.post<ISignInResult>(
        `${url}accounts/sign-in`,
        credentials,
    );

    return data;
};

export const signUp = async (credentials: ICredentials) => {
    const { data } = await axios.post<ISignInResult>(
        `${url}accounts/sign-up`,
        credentials,
    );

    return data;
};
