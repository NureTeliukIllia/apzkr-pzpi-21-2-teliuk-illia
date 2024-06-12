import React from "react";
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
import { useTranslation } from "react-i18next";

export interface OwnBrewingEquipmentDto {
    id: string;
    name: string;
    isBrewing: boolean;
}

export interface OwnBrewingEquipmentProps {
    data: OwnBrewingEquipmentDto[];
}

const OwnBrewingEquipment: React.FC<OwnBrewingEquipmentProps> = ({ data }) => {
    const { t } = useTranslation();

    const handleManageBrewings = (id: string) => {
        console.log(`Manage brewings on Equipment with id: ${id}`);
    };

    return (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{ fontSize: "2.5rem" }}>
                            {t("name")}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "2.5rem" }}>
                            {t("isBrewing")}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "2.5rem" }}>
                            {t("actions")}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell
                                align="center"
                                sx={{ fontSize: "2.5rem" }}
                            >
                                {item.name} ({item.id.split("-")[0]})
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    fontSize: "2.5rem",
                                }}
                            >
                                {item.isBrewing ? "🟢" : "🔴"}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontSize: "2.5rem" }}
                            >
                                <Link
                                    component={RouterLink}
                                    to={`/my-equipment/${item.id}`}
                                >
                                    {" "}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ fontSize: "2rem" }}
                                        onClick={() =>
                                            handleManageBrewings(item.id)
                                        }
                                    >
                                        {t("manageBrewings")}
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OwnBrewingEquipment;
