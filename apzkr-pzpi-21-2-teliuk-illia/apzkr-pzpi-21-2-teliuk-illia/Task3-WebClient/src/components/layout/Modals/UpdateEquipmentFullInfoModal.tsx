import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface UpdateEquipmentFullInfoModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (updatedData: {
        name: string;
        description: string;
        price: number;
    }) => void;
    initialData: { name: string; description: string; price: number };
}

const UpdateEquipmentFullInfoModal: React.FC<
    UpdateEquipmentFullInfoModalProps
> = ({ open, onClose, onSubmit, initialData }) => {
    const { t } = useTranslation();
    const [name, setName] = useState(initialData.name);
    const [description, setDescription] = useState(initialData.description);
    const [price, setPrice] = useState(initialData.price);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setPrice(initialData.price);
        }
    }, [initialData]);

    const handleSubmit = () => {
        onSubmit({ name, description, price });
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{t("updateEquipment")}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t("name")}
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label={t("description")}
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label={t("price")}
                    type="number"
                    fullWidth
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t("cancel")}</Button>
                <Button onClick={handleSubmit}>{t("update")}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateEquipmentFullInfoModal;
