import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import { useTranslation } from 'react-i18next';

import EditProfileModal from "../components/layout/Modals/EditProfileModal";
import {
    getOwnEquipment,
    getOwnIngredients,
    getOwnProfile,
    getOwnRecipes,
    updateProfile,
} from "../services/api";
import OwnBrewingEquipment, {
    OwnBrewingEquipmentDto,
} from "../components/layout/OwnTables/OwnBrewingEquipment";

import OwnIngredients, {
    OwnIngredientsDto,
} from "../components/layout/OwnTables/OwnIngredients";
import OwnRecipes, {
    OwnRecipeDto,
} from "../components/layout/OwnTables/OwnRecipes";
import { RecipeDto } from "./RecipeDetails";

interface BrewerProfileDto {
    id: string;
    fullName: string;
    profileColor: string;
}

const ProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState<BrewerProfileDto | null>(null);
    const [equipment, setEquipment] = useState<OwnBrewingEquipmentDto[] | null>(
        null,
    );
    const [ingredients, setIngredientss] = useState<OwnIngredientsDto[] | null>(
        null,
    );
    const [recipes, setRecipes] = useState<RecipeDto[] | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const userRole = localStorage.getItem("userRole");
    const isLogged = localStorage.getItem("bearer") !== null;
    const userId = localStorage.getItem("userId");

    const fetchProfileData = async () => {
        try {
            const profileData =
                (await getOwnProfile()) as unknown as BrewerProfileDto;
            setProfile(profileData);

            const equipmentData =
                (await getOwnEquipment()) as unknown as OwnBrewingEquipmentDto[];
            setEquipment(equipmentData);

            const ingredientsData =
                (await getOwnIngredients()) as unknown as OwnIngredientsDto[];
            setIngredientss(ingredientsData);

            const recipesData =
                (await getOwnRecipes()) as unknown as RecipeDto[];
            setRecipes(recipesData);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    const handleDataChange = () => {
        fetchProfileData();
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    if (!profile || !equipment || !ingredients || !recipes) {
        return <Typography>{t("loading")}...</Typography>;
    }

    const handleEditProfile = () => {
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    };

    const handleSaveProfile = async (firstName: string, lastName: string) => {
        try {
            await updateProfile(firstName, lastName);
            const profileData =
                (await getOwnProfile()) as unknown as BrewerProfileDto;
            setProfile(profileData);
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    return (
        <Container style={{ marginTop: "15rem" }}>
            <Paper sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h2" gutterBottom>
                    {t("profile")}:{" "}
                    {profile.fullName !== " "
                        ? profile.fullName
                        : t("setName")}
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    style={{ fontSize: "3rem" }}
                    onClick={handleEditProfile}
                >
                    {t("editProfile")}
                </Button>
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h2" gutterBottom>
                        {t("equipment")}
                    </Typography>
                    <OwnBrewingEquipment data={equipment} />
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h2" gutterBottom>
                        {t("ingredients")}
                    </Typography>
                    <OwnIngredients data={ingredients} />
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h2" gutterBottom>
                        {t("recipes")}
                    </Typography>
                    <OwnRecipes
                        data={recipes}
                        onRecipesChange={handleDataChange}
                    />
                </Box>
            </Paper>
            <EditProfileModal
                open={editModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSaveProfile}
                initialFirstName={profile.fullName.split(" ")[0]}
                initialLastName={profile.fullName.split(" ")[1]}
            />
        </Container>
    );
};

export default ProfilePage;
