import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface BuyIngredientModalProps {
    open: boolean;
    onClose: () => void;
    onBuy: (data: { ingredientId: string; weight: number }) => void;
    ingredientId: string;
}

const BuyIngredientModal: React.FC<BuyIngredientModalProps> = ({
    open,
    onClose,
    onBuy,
    ingredientId,
}) => {
    const { t } = useTranslation();
    const [weight, setWeight] = useState(0);

    const handleBuy = () => {
        onBuy({ ingredientId, weight });
    };

    return (
        <Modal open={open} onClose={onClose} style={{ marginTop: "5rem" }}>
            <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2 }}>
                <h2>{t("buyIngredient")}</h2>
                <TextField
                    label={t("weight")}
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                    fullWidth
                    sx={{ mb: 2 }}
                    inputProps={{ style: { fontSize: 20 } }}
                    InputLabelProps={{ style: { fontSize: 20 } }}
                />
                <Button
                    onClick={handleBuy}
                    variant="contained"
                    color="primary"
                    sx={{ fontSize: "1.2rem" }}
                >
                    {t("buy")}
                </Button>
            </Box>
        </Modal>
    );
};

export default BuyIngredientModal;
