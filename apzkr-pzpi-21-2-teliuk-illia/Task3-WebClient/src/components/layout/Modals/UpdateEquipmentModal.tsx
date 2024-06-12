import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface UpdateEquipmentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (updatedData: { name: string; price: number }) => void;
    initialData: { name: string; price: number };
}

const UpdateEquipmentModal: React.FC<UpdateEquipmentModalProps> = ({
    open,
    onClose,
    onSubmit,
    initialData,
}) => {
    const { t } = useTranslation();
    const [name, setName] = React.useState(initialData.name);
    const [price, setPrice] = React.useState(initialData.price);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPrice(initialData.price);
        }
    }, [initialData]);

    const handleSubmit = () => {
        onSubmit({ name, price });
        setName("");
        setPrice(0);
    };

    const handleClose = () => {
        onClose();
        setName("");
        setPrice(0);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            style={{ marginTop: "10rem" }}
        >
            <DialogTitle sx={{ fontSize: "2rem" }}>
                {t("updateEquipment")}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t("name")}
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ fontSize: "1.5rem" }}
                    InputProps={{ style: { fontSize: "1.5rem" } }}
                />
                <TextField
                    margin="dense"
                    label={t("price")}
                    type="number"
                    fullWidth
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    sx={{ fontSize: "1.5rem" }}
                    InputProps={{ style: { fontSize: "1.5rem" } }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    color="primary"
                    sx={{ fontSize: "1.2rem" }}
                >
                    {t("cancel")}
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    sx={{ fontSize: "1.2rem" }}
                >
                    {t("update")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateEquipmentModal;
