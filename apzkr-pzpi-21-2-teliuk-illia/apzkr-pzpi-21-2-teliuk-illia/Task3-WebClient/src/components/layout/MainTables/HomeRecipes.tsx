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
import {
    deleteRecipe,
    updateRecipe,
    getItemsList,
} from "../../../services/api";
import { ConfirmationModal } from "../Modals/Modals";
import UpdateRecipeModal from "../Modals/UpdateRecipeModal";

interface RecipeDto {
    id: string;
    title: string;
    description: string;
    brewerName: string;
    cookingPrice: number;
    ingredients: RecipeIngredientDto[];
}

export interface RecipeIngredientDto {
    id: string;
    name: string;
    weight: number;
}

interface HomeRecipesProps {
    data: RecipeDto[];
    onDataChange: () => void;
}

const HomeRecipes: React.FC<HomeRecipesProps> = ({ data, onDataChange }) => {
    const { t } = useTranslation();
    const userRole = localStorage.getItem("userRole");
    const isLogged = localStorage.getItem("bearer") !== null;

    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(
        null,
    );
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeDto | null>(
        null,
    );
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

    const handleUpdate = (recipe: RecipeDto) => {
        setSelectedRecipe(recipe);
        setUpdateModalOpen(true);
    };

    const handleConfirmUpdate = async (updatedData: {
        title: string;
        description: string;
        ingredients: RecipeIngredientDto[];
    }) => {
        if (selectedRecipe) {
            const updatedRecipe = {
                ...updatedData,
                ingredients: updatedData.ingredients.map((item) => ({
                    id: item.id,
                    weight: item.weight,
                })),
            };
            await updateRecipe({ ...updatedRecipe, id: selectedRecipe.id });
            setUpdateModalOpen(false);
            onDataChange();
        }
    };

    const handleDelete = (id: string) => {
        setSelectedRecipeId(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedRecipeId) {
            await deleteRecipe(selectedRecipeId);
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
                            <TableCell sx={{ fontSize: "2.5rem" }}>
                                {t("title")}
                            </TableCell>
                            <TableCell sx={{ fontSize: "2.5rem" }}>
                                {t("description")}
                            </TableCell>
                            <TableCell sx={{ fontSize: "2.5rem" }}>
                                {t("brewer")}
                            </TableCell>
                            <TableCell sx={{ fontSize: "2.5rem" }}>
                                {t("cookingPrice")}
                            </TableCell>
                            <TableCell sx={{ fontSize: "2.5rem" }}>
                                {t("actions")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ fontSize: "2.5rem" }}>
                                    <Link
                                        component={RouterLink}
                                        to={`/recipe/${item.id}`}
                                        sx={{ fontSize: "2.5rem" }}
                                    >
                                        {item.title}
                                    </Link>
                                </TableCell>
                                <TableCell sx={{ fontSize: "2.5rem" }}>
                                    {item.description}
                                </TableCell>
                                <TableCell sx={{ fontSize: "2.5rem" }}>
                                    {item.brewerName}
                                </TableCell>
                                <TableCell sx={{ fontSize: "2.5rem" }}>
                                    ${item.cookingPrice}
                                </TableCell>
                                <TableCell sx={{ fontSize: "2.5rem" }}>
                                    {isLogged ? (
                                        <>
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
                                                            handleUpdate(item)
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

            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t("deleteRecipe")}
                description={t("confirmDeleteRecipe")}
            />

            {selectedRecipe && (
                <UpdateRecipeModal
                    open={isUpdateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    onSubmit={handleConfirmUpdate}
                    initialData={{
                        title: selectedRecipe.title,
                        description: selectedRecipe.description,
                        ingredients: selectedRecipe.ingredients,
                    }}
                />
            )}
        </>
    );
};

export default HomeRecipes;
