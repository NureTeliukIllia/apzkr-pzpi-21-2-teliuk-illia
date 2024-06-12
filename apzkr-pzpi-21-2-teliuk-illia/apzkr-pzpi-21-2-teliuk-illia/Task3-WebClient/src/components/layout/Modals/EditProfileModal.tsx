import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (firstName: string, lastName: string) => void;
    initialFirstName: string;
    initialLastName: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    open,
    onClose,
    onSave,
    initialFirstName,
    initialLastName,
}) => {
    const { t } = useTranslation();

    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);

    const handleSave = () => {
        onSave(firstName, lastName);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} style={{ marginTop: "5rem" }}>
            <DialogTitle style={{ fontSize: "3rem" }}>
                {t("editProfile")}
            </DialogTitle>
            <DialogContent>
                <TextField
                    label={t("firstName")}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                    autoFocus
                    margin="normal"
                    inputProps={{ style: { fontSize: 40 } }}
                    InputLabelProps={{ style: { fontSize: 40 } }}
                />
                <TextField
                    label={t("lastName")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                    margin="normal"
                    inputProps={{ style: { fontSize: 40 } }}
                    InputLabelProps={{ style: { fontSize: 40 } }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    style={{ fontSize: "3rem" }}
                    onClick={onClose}
                    color="secondary"
                >
                    {t("cancel")}
                </Button>
                <Button
                    style={{ fontSize: "3rem" }}
                    onClick={handleSave}
                    color="primary"
                >
                    {t("save")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileModal;
