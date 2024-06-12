import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Button, Box } from "@mui/material";
import {
    getEquipmentDetails,
    buyEquipment,
    deleteEquipment,
    updateEquipment,
} from "../services/api";
import UpdateEquipmentFullInfoModal from "../components/layout/Modals/UpdateEquipmentFullInfoModal";
import { ConfirmationModal } from "../components/layout/Modals/Modals";
import { useTranslation } from "react-i18next";

interface HomeBrewingEquipmentFullInfoDto {
    id: string;
    name: string;
    description: string;
    price: number;
}

const EquipmentDetails: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [selectedEquipmentId, setSelectedEquipmentId] = useState<
        string | null
    >(null);
    const [equipment, setEquipment] =
        useState<HomeBrewingEquipmentFullInfoDto | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [isBuyModalOpen, setBuyModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await getEquipmentDetails(id!);
                setEquipment(response.data);
            } catch (error) {
                console.error("Error fetching equipment details:", error);
            }
        };

        fetchEquipment();
    }, [id]);

    if (!equipment) {
        return <Typography>{t("loading")}...</Typography>;
    }

    const userRole = localStorage.getItem("userRole");
    const isLogged = localStorage.getItem("bearer") !== null;

    const handleBuy = async (id: string) => {
        setSelectedEquipmentId(id);
        setBuyModalOpen(true);
    };

    const handleConfirmBuy = async () => {
        if (equipment) {
            await buyEquipment(equipment.id);
            setBuyModalOpen(false);
        }
    };

    const handleUpdate = () => {
        setUpdateModalOpen(true);
    };

    const handleConfirmUpdate = async (updatedData: {
        name: string;
        description: string;
        price: number;
    }) => {
        if (equipment) {
            await updateEquipment({ ...updatedData, id: equipment.id });
            setUpdateModalOpen(false);
            const response = await getEquipmentDetails(equipment.id);
            setEquipment(response.data);
        }
    };

    const handleDelete = () => {
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (equipment) {
            await deleteEquipment(equipment.id);
            setDeleteModalOpen(false);
            navigate("/");
        }
    };

    return (
        <Container>
            <Paper sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h2" gutterBottom>
                    {equipment.name}
                </Typography>
                <Typography
                    variant="body1"
                    style={{ fontSize: "2rem" }}
                    gutterBottom
                >
                    {equipment.description}
                </Typography>
                <Typography
                    variant="h5"
                    style={{
                        fontSize: "3rem",
                        padding: "1rem",
                        border: "0.01rem solid black",
                    }}
                    gutterBottom
                >
                    ${equipment.price}
                </Typography>
                {isLogged ? (
                    <Box>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ fontSize: "1.5rem", marginRight: 2 }}
                            onClick={() => handleBuy(id!)}
                        >
                            {t("buy")}
                        </Button>
                        {userRole === "Administrator" && (
                            <>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ fontSize: "1.5rem", marginRight: 2 }}
                                    onClick={handleUpdate}
                                >
                                    {t("update")}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ fontSize: "1.5rem" }}
                                    onClick={handleDelete}
                                >
                                    {t("delete")}
                                </Button>
                            </>
                        )}
                    </Box>
                ) : (
                    <Typography variant="h5">
                        <Button
                            component={RouterLink}
                            to="/login"
                            color="primary"
                            sx={{ fontSize: "1.5rem" }}
                        >
                            {t("loginFirst")}
                        </Button>
                    </Typography>
                )}

                {equipment && (
                    <UpdateEquipmentFullInfoModal
                        open={isUpdateModalOpen}
                        onClose={() => setUpdateModalOpen(false)}
                        onSubmit={handleConfirmUpdate}
                        initialData={{
                            name: equipment.name,
                            description: equipment.description,
                            price: equipment.price,
                        }}
                    />
                )}

                <ConfirmationModal
                    open={isDeleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title={t("deleteEquipment")}
                    description={t("confirmDeleteEquipment")}
                />

                <ConfirmationModal
                    open={isBuyModalOpen}
                    onClose={() => setBuyModalOpen(false)}
                    onConfirm={handleConfirmBuy}
                    title={t("buyEquipment")}
                    description={t("confirmBuyEquipment")}
                />
            </Paper>
        </Container>
    );
};

export default EquipmentDetails;
