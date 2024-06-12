import { ChangeEvent, ReactNode } from "react";
import { ButtonType } from "./types";

export interface IHeaderProps {
    isLogged: boolean;
    setIsLogged: (isLogged: boolean) => void;
}

export interface IPageProps {
}

export interface IAuthProps {
    setIsLogged: (isLogged: boolean) => void;
}


export interface IButtonProps {
    children: ReactNode;
    handleClick?: () => void;
    customStyles?: string;
    type?: ButtonType;
    title: string;
    disabled?: boolean;
}

export interface ICredentials {
    email: string;
    password: string;
}

export interface ISignInResult {
    userId: string;
    userRole: string;
    bearer: string;
}

export interface IDeleteDialog {
    entityName: string;
    render: (onClick: () => void) => ReactNode;
    handleAgree: () => void;
}

export interface IUpdateDialog {
    entityName: string;
    render: (onClick: () => void) => ReactNode;
    handleAgree: () => void;
    handleClose: () => void;
    currentValue: string;
    onChangeValue: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface IUploadDialog {
    render: (onClick: () => void) => ReactNode;
    handleAgree: () => void;
    handleClose: () => void;
    currentValue: FormData | null;
    onChangeValue: (e: ChangeEvent<HTMLInputElement>) => void;
}


