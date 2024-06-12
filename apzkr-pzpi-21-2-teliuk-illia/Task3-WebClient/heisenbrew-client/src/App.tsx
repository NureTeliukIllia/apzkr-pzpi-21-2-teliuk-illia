import React, { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header/Header";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound/NotFound";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home/Home";
import EquipmentDetails from "./pages/EquipmentDetails";
import RecipeDetails from "./pages/RecipeDetails";
import OwnProfilePage from "./pages/ProfilePage";
import MyEquipmentPage from "./pages/EquipmentBrewingPage";

function App() {
    const user = localStorage.getItem("userId");
    const [isLogged, setIsLogged] = useState<boolean>(user?.length! > 0);

    return (
        <>
            <Header isLogged={isLogged} setIsLogged={setIsLogged} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/login"
                    element={<Login setIsLogged={setIsLogged} />}
                />
                <Route
                    path="/register"
                    element={<Register setIsLogged={setIsLogged} />}
                />
                <Route path="/equipment/:id" element={<EquipmentDetails />} />
                <Route path="/recipe/:id" element={<RecipeDetails />} />
                <Route path="/me" element={<OwnProfilePage />} />
                <Route path="/my-equipment/:id" element={<MyEquipmentPage />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="bottom-right" className="toast" />
        </>
    );
}

export default App;
