import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import BuyIngredientModal from "../Modals/BuyIngredientModal";
import UpdateIngredientModal from "../Modals/UpdateIngredientModal";
import { ConfirmationModal } from "../Modals/Modals";
import {
    buyIngredient,
    deleteIngredient,
    updateIngredient,
} from "../../../services/api";

interface HomeIngredientsDto {
    id: string;
    name: string;
    price: number;
}

interface HomeIngredientsProps {
    data: HomeIngredientsDto[];
    onDataChange: () => void;
}

const HomeIngredients: React.FC<HomeIngredientsProps> = ({
    data,
    onDataChange,
}) => {
    const { t } = useTranslation();
    const userRole = localStorage.getItem("userRole");
    const isLogged = localStorage.getItem("bearer") !== null;

    const [selectedIngredient, setSelectedIngredient] =
        useState<HomeIngredientsDto | null>(null);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [isBuyModalOpen, setBuyModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [ingredientToDelete, setIngredientToDelete] = useState<string | null>(
        null,
    );

    const handleBuy = (ingredientId: string) => {
        setSelectedIngredient(
            data.find((ing) => ing.id === ingredientId) || null,
        );
        setBuyModalOpen(true);
    };

    const handleUpdate = (ingredientId: string) => {
        setSelectedIngredient(
            data.find((ing) => ing.id === ingredientId) || null,
        );
        setUpdateModalOpen(true);
    };

    const handleDelete = (ingredientId: string) => {
        setIngredientToDelete(ingredientId);
        setDeleteModalOpen(true);
    };

    const handleUpdateIngredient = async (updatedData: {
        name: string;
        price: number;
    }) => {
        if (selectedIngredient) {
            await updateIngredient({ ...selectedIngredient, ...updatedData });
            setUpdateModalOpen(false);
            onDataChange();
        }
    };

    const handleBuyIngredient = async (buyData: {
        ingredientId: string;
        weight: number;
    }) => {
        await buyIngredient(buyData.ingredientId, buyData.weight);
        setBuyModalOpen(false);
        onDataChange();
    };

    const handleConfirmDelete = async () => {
        if (ingredientToDelete) {
            await deleteIngredient(ingredientToDelete);
            setDeleteModalOpen(false);
            onDataChange();
        }
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontSize: "2rem" }}>
                                {t("name")}
                            </TableCell>
                            <TableCell sx={{ fontSize: "2rem" }}>
                                {t("price")}
                            </TableCell>
                            <TableCell sx={{ fontSize: "2rem" }}>
                                {t("actions")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ fontSize: "2rem" }}>
                                    {item.name}
                                </TableCell>
                                <TableCell sx={{ fontSize: "2rem" }}>
                                    ${item.price}
                                </TableCell>
                                <TableCell>
                                    {isLogged ? (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{ fontSize: "2rem" }}
                                                onClick={() =>
                                                    handleBuy(item.id)
                                                }
                                            >
                                                {t("buy")}
                                            </Button>
                                            {userRole === "Administrator" && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        sx={{
                                                            fontSize: "2rem",
                                                            marginLeft: 1,
                                                        }}
                                                        onClick={() =>
                                                            handleUpdate(
                                                                item.id,
                                                            )
                                                        }
                                                    >
                                                        {t("update")}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        sx={{
                                                            fontSize: "2rem",
                                                            marginLeft: 1,
                                                        }}
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
                                                    >
                                                        {t("delete")}
                                                    </Button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            component={RouterLink}
                                            to="/login"
                                            sx={{ fontSize: "2rem" }}
                                        >
                                            {t("loginFirst")}
                                        </Link>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedIngredient && (
                <UpdateIngredientModal
                    open={isUpdateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    onUpdate={handleUpdateIngredient}
                    initialData={selectedIngredient}
                />
            )}

            {selectedIngredient && (
                <BuyIngredientModal
                    open={isBuyModalOpen}
                    onClose={() => setBuyModalOpen(false)}
                    onBuy={handleBuyIngredient}
                    ingredientId={selectedIngredient.id}
                />
            )}

            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t("deleteIngredient")}
                description={t("confirmDeleteIngredient")}
            />
        </>
    );
};

export default HomeIngredients;
