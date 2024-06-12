import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Container,
    Typography,
    Paper,
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
} from "@mui/material";
import {
    getItemsList,
    getOwnEquipmentInfo,
    getCurrentBrewingStatus,
    getEquipmentStatus,
    getEquipmentAvailability,
    updateConnectionString,
    startNewBrewing,
    abortBrewing,
    getBrewingHistory,
} from "../services/api";
import { RecipeDto } from "./RecipeDetails";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface BrewingShortInfoDto {
    equipmentTitle: string;
    recipeTitle: string;
    brewingStatus: string;
    lastUpdateDate: string;
}

interface BrewerBrewingEquipmentFullInfoDto {
    id: string;
    name: string;
    imgUrl: string;
    connectionString: string;
    isBrewing: boolean;
}

interface EquipmentStatusDto {
    temperature: number;
    pressure: number;
    humidity: number;
    fullness: number;
    lastUpdate: string;
    isBrewing: boolean;
}

interface BrewingFullInfoDto {
    id: string;
    recipeId: string;
    equipmentTitle: string;
    recipeTitle: string;
    brewingStatus: string;
    lastUpdateDate: string;
    brewingLogs: BrewingLogDto[];
    createdAt: string;
}

interface BrewingLogDto {
    statusCode: string;
    message: string;
    logTime: string;
}

const MyEquipmentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [equipment, setEquipment] =
        useState<BrewerBrewingEquipmentFullInfoDto | null>(null);
    const [connectionString, setConnectionString] = useState("");
    const [isAvailable, setIsAvailable] = useState(false);
    const [isBrewing, setIsBrewing] = useState(false);
    const [brewingLogs, setBrewingLogs] = useState<string | JSX.Element>("");
    const [equipmentLogs, setEquipmentLogs] = useState<string | JSX.Element>(
        "",
    );
    const [brewingHistory, setBrewingHistory] = useState<string | JSX.Element>(
        "",
    );
    const [recipes, setRecipes] = useState<RecipeDto[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeDto | null>(
        null,
    );
    const { t } = useTranslation();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const equipmentResponse = await getOwnEquipmentInfo(id!);
                setEquipment(equipmentResponse);
                setConnectionString(equipmentResponse.connectionString || "");

                const recipesResponse = await getItemsList("Recipe");
                setRecipes(recipesResponse.data);

                checkEquipmentStatus();
                fetchBrewingHistory();
                const intervalId = setInterval(() => {
                    checkEquipmentStatus();
                    fetchBrewingHistory();
                }, 3000);

                return () => clearInterval(intervalId);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialData();
    }, [id]);

    const checkEquipmentStatus = async () => {
        try {
            const availabilityResponse = await getEquipmentAvailability(id!);
            setIsAvailable(availabilityResponse);

            if (!availabilityResponse) {
                setBrewingLogs(
                    "The device is not available, check your connection string!",
                );
                setEquipmentLogs(
                    "The device is not available, check your connection string!",
                );
            } else {
                const equipmentStatusResponse = await getEquipmentStatus(id!);

                if (equipmentStatusResponse.isBrewing) {
                    setIsBrewing(true);
                    const brewingStatusResponse = await getCurrentBrewingStatus(
                        id!,
                    );
                    setBrewingLogs(
                        <Box>
                            {brewingStatusResponse.brewingLogs.map(
                                (log: any, index: number) => (
                                    <Typography
                                        key={index}
                                        variant="body2"
                                        sx={{
                                            fontSize: "1.5rem",
                                            textAlign: "left",
                                        }}
                                    >
                                        [{log.logTime}] {log.statusCode}:{" "}
                                        {log.message}
                                    </Typography>
                                ),
                            )}
                        </Box>,
                    );
                } else {
                    setIsBrewing(false);
                    setBrewingLogs("No brewings yet.");
                }

                setEquipmentLogs(
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: "1.5rem", textAlign: "left" }}
                        >
                            Temperature: {equipmentStatusResponse.temperature}°C
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: "1.5rem", textAlign: "left" }}
                        >
                            Pressure: {equipmentStatusResponse.pressure} Pa
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: "1.5rem", textAlign: "left" }}
                        >
                            Humidity: {equipmentStatusResponse.humidity} %
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: "1.5rem", textAlign: "left" }}
                        >
                            Fullness: {equipmentStatusResponse.fullness} %
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: "1.5rem", textAlign: "left" }}
                        >
                            Last Update: {equipmentStatusResponse.lastUpdate}
                        </Typography>
                    </Box>,
                );
            }
        } catch (error) {
            console.error("Error checking equipment status:", error);
        }
    };

    const fetchBrewingHistory = async () => {
        try {
            const historyResponse = await getBrewingHistory(id!);
            setBrewingHistory(
                <Box
                    sx={{
                        backgroundColor: "#000",
                        color: "#fff",
                        padding: 2,
                        height: "300px",
                        overflowY: "scroll",
                    }}
                >
                    {historyResponse.map(
                        (historyItem: BrewingShortInfoDto, index: number) => (
                            <div key={index}>
                                <Typography
                                    variant="body1"
                                    sx={{ fontSize: "1.5rem" }}
                                >
                                    Equipment: {historyItem.equipmentTitle}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ fontSize: "1.5rem" }}
                                >
                                    Recipe: {historyItem.recipeTitle}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ fontSize: "1.5rem" }}
                                >
                                    Status: {historyItem.brewingStatus}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ fontSize: "1.5rem" }}
                                >
                                    Last Update: {historyItem.lastUpdateDate}
                                </Typography>
                                <hr />{" "}
                            </div>
                        ),
                    )}
                </Box>,
            );
        } catch (error) {
            console.error("Error fetching brewing history:", error);
        }
    };

    const handleConnectionStringChange = async () => {
        try {
            await updateConnectionString(id!, connectionString);
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
    };

    const handleRecipeSelect = (recipe: RecipeDto) => {
        if (selectedRecipe?.id === recipe.id) {
            setSelectedRecipe(null);
        } else {
            setSelectedRecipe(recipe);
        }
    };

    const handleStartBrewing = async () => {
        if (!selectedRecipe) return;

        const response = startNewBrewing(selectedRecipe.id, id!);
        response.catch((error: any) => {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        });
    };

    const handleAbortBrewing = async () => {
        try {
            await abortBrewing(id!);
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
    };

    if (!equipment) {
        return <Typography variant="h4">Loading...</Typography>;
    }

    return (
        <Container style={{ marginTop: "10rem" }}>
            <Paper sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h2" gutterBottom>
                    ({equipment.id.split("-")[0]}) {equipment.name}{" "}
                    {isBrewing ? "🟢" : "🔴"}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginTop: 4,
                    }}
                >
                    <Box sx={{ flex: 1, marginRight: 2 }}>
                        <Typography variant="h3" gutterBottom>
                            {t("connectionString")}
                        </Typography>
                        <TextField
                            value={connectionString}
                            onChange={(e) =>
                                setConnectionString(e.target.value)
                            }
                            fullWidth
                            margin="normal"
                            InputProps={{ style: { fontSize: "1.5rem" } }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleConnectionStringChange}
                            sx={{ fontSize: "1.5rem" }}
                        >
                            {t("updateConnectionString")}
                        </Button>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Box
                            sx={{
                                backgroundColor: "#000",
                                color: "#fff",
                                padding: 2,
                                height: "150px",
                                overflowY: "scroll",
                                marginBottom: 2,
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                {t("currentBrewingStatus")}
                            </Typography>
                            <Box sx={{ fontSize: "1.5rem", textAlign: "left" }}>
                                {brewingLogs}
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: "#000",
                                color: "#fff",
                                padding: 2,
                                height: "150px",
                                overflowY: "scroll",
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                {t("equipmentStatus")}
                            </Typography>
                            <Box sx={{ fontSize: "1.5rem", textAlign: "left" }}>
                                {equipmentLogs}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 4,
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h3" gutterBottom>
                            {t("chooseRecipe")}
                        </Typography>
                        <List>
                            {recipes.map((recipe) => (
                                <ListItem
                                    button
                                    key={recipe.id}
                                    onClick={() => handleRecipeSelect(recipe)}
                                    selected={selectedRecipe?.id === recipe.id}
                                >
                                    <ListItemText
                                        primary={recipe.title}
                                        primaryTypographyProps={{
                                            style: { fontSize: "2.5rem" },
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        {selectedRecipe && (
                            <Box sx={{ textAlign: "center", marginTop: 2 }}>
                                <Typography
                                    variant="h4"
                                    sx={{ fontSize: "2.5rem" }}
                                >
                                    {selectedRecipe.title}
                                </Typography>
                                <Box>
                                    {selectedRecipe.ingredients.map(
                                        (ingredient) => (
                                            <Typography
                                                key={ingredient.id}
                                                variant="body1"
                                                sx={{ fontSize: "2rem" }}
                                            >
                                                {ingredient.name} -{" "}
                                                {ingredient.weight}g
                                            </Typography>
                                        ),
                                    )}
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleStartBrewing}
                                    disabled={isBrewing}
                                    sx={{ marginTop: 2, fontSize: "1.5rem" }}
                                >
                                    {t("startBrewing")}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleAbortBrewing}
                                    disabled={!isBrewing}
                                    sx={{
                                        marginTop: 2,
                                        fontSize: "1.5rem",
                                        marginLeft: 2,
                                    }}
                                >
                                    {t("abort")}
                                </Button>
                            </Box>
                        )}
                    </Box>
                    <Box sx={{ flex: 1, marginLeft: 2, overflowY: "hidden" }}>
                        <Typography variant="h3" gutterBottom>
                        {t("brewingHistory")}
                        </Typography>
                        <Box
                            sx={{
                                backgroundColor: "#000",
                                color: "#fff",
                                padding: 0,
                                height: "300px",
                                textAlign: "left",
                            }}
                        >
                            {brewingHistory}
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default MyEquipmentPage;
