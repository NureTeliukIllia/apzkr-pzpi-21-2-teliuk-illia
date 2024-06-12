import React, { useState, useEffect, useContext } from "react";
import { Button, ButtonGroup, Container } from "@mui/material";
import HomeRecipes from "../components/layout/MainTables/HomeRecipes";
import HomeBrewingEquipment from "../components/layout/MainTables/HomeBrewingEquipment";
import HomeIngredients from "../components/layout/MainTables/HomeIngredients";
import { downloadData, getItemsList } from "../services/api";
import CreateRecipeModal from "../components/layout/Modals/CreateRecipeModal";
import CreateEquipmentModal from "../components/layout/Modals/CreateEquipmentModal";
import CreateIngredientModal from "../components/layout/Modals/CreateIngredientModal";
import {
    createRecipe,
    createEquipment,
    createIngredient,
} from "../services/api";
import { useTranslation } from "react-i18next";

const DataSwitcher: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<any[]>([]);
    const [dataType, setDataType] = useState<string>("Recipe");
    const [isCreateRecipeModalOpen, setIsCreateRecipeModalOpen] =
        useState(false);
    const [isCreateEquipmentModalOpen, setIsCreateEquipmentModalOpen] =
        useState(false);
    const [isCreateIngredientModalOpen, setIsCreateIngredientModalOpen] =
        useState(false);

    const userRole = localStorage.getItem("userRole");

    const fetchData = async (type: string) => {
        try {
            const response = await getItemsList(type);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(dataType);
    }, [dataType]);

    const handleDataChange = () => {
        fetchData(dataType);
    };

    const handleDownloadData = async () => {
        try {
            await downloadData();
        } catch (error) {
            console.error("Error downloading data:", error);
        }
    };

    const handleCreateRecipe = async (newRecipe: any) => {
        try {
            console.log(newRecipe);
            await createRecipe(newRecipe);
            setIsCreateRecipeModalOpen(false);
            fetchData("Recipe");
        } catch (error) {
            console.error("Error creating recipe:", error);
        }
    };

    const handleCreateEquipment = async (newEquipment: any) => {
        try {
            await createEquipment(newEquipment);
            setIsCreateEquipmentModalOpen(false);
            fetchData("Equipment");
        } catch (error) {
            console.error("Error creating equipment:", error);
        }
    };

    const handleCreateIngredient = async (newIngredient: any) => {
        try {
            await createIngredient(newIngredient);
            setIsCreateIngredientModalOpen(false);
            fetchData("Ingredient");
        } catch (error) {
            console.error("Error creating ingredient:", error);
        }
    };

    return (
        <Container>
            {userRole === "Administrator" && (
                <ButtonGroup
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: "2rem", marginLeft: "2rem" }}
                    size="large"
                >
                    <Button
                        style={{ fontSize: "2rem" }}
                        onClick={() => setIsCreateRecipeModalOpen(true)}
                        disabled={dataType !== "Recipe"}
                    >
                        {t("addRecipe")}
                    </Button>
                    <Button
                        style={{ fontSize: "2rem" }}
                        onClick={() => setIsCreateEquipmentModalOpen(true)}
                        disabled={dataType !== "Equipment"}
                    >
                        {t("addEquipment")}
                    </Button>
                    <Button
                        style={{ fontSize: "2rem" }}
                        onClick={() => setIsCreateIngredientModalOpen(true)}
                        disabled={dataType !== "Ingredient"}
                    >
                        {t("addIngredient")}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginLeft: "2rem", fontSize: "2rem" }}
                        onClick={handleDownloadData}
                    >
                        {t("downloadData")}
                    </Button>
                </ButtonGroup>
            )}

            <ButtonGroup
                variant="contained"
                style={{ marginBottom: "2rem" }}
                size="large"
            >
                <Button
                    color={dataType === "Recipe" ? "primary" : "secondary"}
                    style={{ fontSize: "2rem" }}
                    onClick={() => setDataType("Recipe")}
                >
                    {t("recipes")}
                </Button>
                <Button
                    color={dataType === "Equipment" ? "primary" : "secondary"}
                    style={{ fontSize: "2rem" }}
                    onClick={() => setDataType("Equipment")}
                >
                    {t("equipment")}
                </Button>
                <Button
                    color={dataType === "Ingredient" ? "primary" : "secondary"}
                    style={{ fontSize: "2rem" }}
                    onClick={() => setDataType("Ingredient")}
                >
                    {t("ingredients")}
                </Button>
            </ButtonGroup>

            {dataType === "Recipe" && (
                <HomeRecipes data={data} onDataChange={handleDataChange} />
            )}
            {dataType === "Equipment" && (
                <HomeBrewingEquipment
                    data={data}
                    onDataChange={handleDataChange}
                />
            )}
            {dataType === "Ingredient" && (
                <HomeIngredients data={data} onDataChange={handleDataChange} />
            )}

            <CreateRecipeModal
                open={isCreateRecipeModalOpen}
                onClose={() => setIsCreateRecipeModalOpen(false)}
                onSubmit={handleCreateRecipe}
            />
            <CreateEquipmentModal
                open={isCreateEquipmentModalOpen}
                onClose={() => setIsCreateEquipmentModalOpen(false)}
                onSubmit={handleCreateEquipment}
            />
            <CreateIngredientModal
                open={isCreateIngredientModalOpen}
                onClose={() => setIsCreateIngredientModalOpen(false)}
                onSubmit={handleCreateIngredient}
            />
        </Container>
    );
};

export default DataSwitcher;
