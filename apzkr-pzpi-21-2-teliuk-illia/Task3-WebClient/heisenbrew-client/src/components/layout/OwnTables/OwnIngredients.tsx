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

export interface OwnIngredientsDto {
    id: string;
    name: string;
    weight: number;
}

interface OwnIngredientsProps {
    data: OwnIngredientsDto[];
}

const OwnIngredients: React.FC<OwnIngredientsProps> = ({ data }) => {
    const { t } = useTranslation();

    return (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontSize: "2.5rem" }}>
                            {t("name")}
                        </TableCell>
                        <TableCell sx={{ fontSize: "2.5rem" }}>
                            {t("weight")}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell sx={{ fontSize: "2.5rem" }}>
                                {item.name}
                            </TableCell>
                            <TableCell sx={{ fontSize: "2.5rem" }}>
                                {item.weight} g
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OwnIngredients;
