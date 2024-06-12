import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
}) => {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onClose={onClose} style={{ marginTop: "5rem" }}>
            <DialogTitle sx={{ fontSize: "2rem" }}>{t(title)}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontSize: "1.5rem" }}>
                    {t(description)}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary"
                    sx={{ fontSize: "1.2rem" }}
                >
                    {t("cancel")}
                </Button>
                <Button
                    onClick={onConfirm}
                    color="primary"
                    sx={{ fontSize: "1.2rem" }}
                >
                    {t("confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
