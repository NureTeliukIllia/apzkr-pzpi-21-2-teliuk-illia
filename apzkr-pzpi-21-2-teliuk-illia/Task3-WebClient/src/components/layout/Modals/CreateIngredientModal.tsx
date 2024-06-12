import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface CreateIngredientModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; price: number }) => void;
}

const CreateIngredientModal: React.FC<CreateIngredientModalProps> = ({
    open,
    onClose,
    onSubmit,
}) => {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number>(0);

    const handleSave = () => {
        onSubmit({ name, price });
    };

    return (
        <Modal open={open} onClose={onClose} style={{ marginTop: "5rem" }}>
            <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2 }}>
                <h2 style={{ fontSize: "2.5rem" }}>{t("createIngredient")}</h2>
                <TextField
                    label={t("name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2, fontSize: "2.5rem" }}
                    inputProps={{ style: { fontSize: 20 } }}
                    InputLabelProps={{ style: { fontSize: 20 } }}
                />
                <TextField
                    label={t("price")}
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    fullWidth
                    sx={{ mb: 2, fontSize: "2.5rem" }}
                    inputProps={{ style: { fontSize: 20 } }}
                    InputLabelProps={{ style: { fontSize: 20 } }}
                />
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    sx={{ fontSize: "2rem" }}
                >
                    {t("save")}
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateIngredientModal;
