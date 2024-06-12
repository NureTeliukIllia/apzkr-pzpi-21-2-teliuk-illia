import axios from "axios";

const url = process.env.REACT_APP_SERVER_URL
    ? process.env.REACT_APP_SERVER_URL
    : "https://localhost:7084/api/";

interface UpdateBrewerProfileDto {
    firstName: string;
    lastName: string;
}

interface UpdateConnectionStringDto {
    equipmentId: string;
    connectionString: string;
}

interface UpdateEquipmentDto {
    id: string;
    name: string;
    description: string;
    price: number;
}

interface CreateEquipmentDto {
    name: string;
    description: string;
    price: number;
}

interface UpdateRecipeDto {
    id: string;
    title: string;
    description: string;
    ingredients: CreateRecipeIngredientDto[];
}

interface CreateRecipeDto {
    title: string;
    description: string;
    ingredients: CreateRecipeIngredientDto[];
}

interface CreateRecipeIngredientDto {
    id: string;
    weight: number;
}

interface CreateIngredientDto {
    name: string;
    price: number;
}

interface UpdateIngredientDto {
    id: string;
    name: string;
    price: number;
}

interface BuyIngredientDto {
    ingredientId: string;
    weight: number;
}

export const getItemsList = async (type: string) =>
    await axios.get(`https://localhost:7084/api/${type}`);

export const getEquipmentDetails = async (equipmentId: string) =>
    await axios.get(`${url}Equipment/${equipmentId}`);

export const getRecipeDetails = async (recipeId: string) =>
    await axios.get(`${url}Recipe/${recipeId}`);

export const getOwnProfile = async () => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get<string>(`${url}Profile/me`, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const getOwnEquipment = async () => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get<string>(`${url}Equipment/my-equipment`, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const getOwnEquipmentInfo = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get(
        `${url}Equipment/my-equipment/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const getOwnIngredients = async () => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get<string>(
        `${url}Ingredient/my-ingredients`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const getOwnRecipes = async () => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get<string>(`${url}Recipe/my-recipes`, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const updateProfile = async (
    newFirstName: string,
    newLastName: string,
) => {
    const bearer = localStorage.getItem("bearer");
    const request: UpdateBrewerProfileDto = {
        firstName: newFirstName,
        lastName: newLastName,
    };
    const { data } = await axios.put<UpdateBrewerProfileDto>(
        `${url}Profile/edit`,
        request,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const updateConnectionString = async (
    equipmentId: string,
    newConnectionString: string,
) => {
    const bearer = localStorage.getItem("bearer");
    const request: UpdateConnectionStringDto = {
        equipmentId: equipmentId,
        connectionString: newConnectionString,
    };
    const { data } = await axios.put(
        `${url}Brewing/my-equipment/update-string`,
        request,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const getCurrentBrewingStatus = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");

    const { data } = await axios.get(
        `${url}Brewing/brewing-status/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const getEquipmentStatus = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");

    const { data } = await axios.get(
        `${url}Brewing/equipment-status/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const getEquipmentAvailability = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");

    const { data } = await axios.get(
        `${url}Brewing/equipment-availability/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const startNewBrewing = async (
    recipeId: string,
    equipmentId: string,
) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get(
        `${url}Brewing/start?recipeId=${recipeId}&equipmentId=${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const abortBrewing = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get(`${url}Brewing/abort/${equipmentId}`, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const getBrewingHistory = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get(
        `${url}Brewing/equipment-brewings/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const buyEquipment = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get(
        `${url}Equipment/my-equipment/buy/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const deleteEquipment = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.delete(
        `${url}Equipment/delete/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const updateEquipment = async (newEquipment: UpdateEquipmentDto) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.put(`${url}Equipment/update`, newEquipment, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const createEquipment = async (newEquipment: CreateEquipmentDto) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.post(`${url}Equipment/create`, newEquipment, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const deleteRecipe = async (recipeId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.delete(`${url}Recipe/${recipeId}`, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const updateRecipe = async (newRecipe: UpdateRecipeDto) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.put(`${url}Recipe/edit`, newRecipe, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const createRecipe = async (newRecipe: CreateRecipeDto) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.post(`${url}Recipe/create`, newRecipe, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const deleteIngredient = async (ingredientId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.delete(`${url}Ingredient/${ingredientId}`, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const updateIngredient = async (newIngredient: UpdateIngredientDto) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.put(`${url}Ingredient/update`, newIngredient, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const createIngredient = async (newIngredient: CreateIngredientDto) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.post(
        `${url}Ingredient/create`,
        newIngredient,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const buyIngredient = async (ingredientId: string, weight: number) => {
    const newIngredient = { ingredientId: ingredientId, weight: weight };
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.post(
        `${url}Ingredient/my-ingredient/buy`,
        newIngredient,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const downloadData = async () => {
    try {
        const bearer = localStorage.getItem("bearer");

        const response = await axios.get(`${url}Data/export`, {
            headers: {
                Authorization: `Bearer ${bearer}`,
            },
            responseType: "blob", // Important to handle the binary data
        });

        const downloadUrl = window.URL.createObjectURL(
            new Blob([response.data]),
        );
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "DbSaved.xlsx");
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        console.error("Error downloading data:", error);
    }
};
