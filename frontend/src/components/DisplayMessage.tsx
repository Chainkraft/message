import React, {useEffect, useState} from "react";
import {Backdrop, CircularProgress, Container, Typography,} from "@mui/material";
import {alchemyProvider, getMessageContract} from "../config/Blockchain";

const DisplayMessage = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Creates contract connector instance using Alchemy provider
        const contract = getMessageContract(alchemyProvider);

        // Displays message from the contract on component load
        contract.message().then((newMessage: string) => {
            setMessage(newMessage);
            setLoading(false);
        }).catch(console.error);

        // Listens to the MessageSet event in order to change the displayed message
        contract.on("MessageSet", (newMessage: string) => {
            setMessage(newMessage);
        });
    }, []);

    return (
        <div>
            {loading ? <Loader/> : null}
            <Container
                sx={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h1" align="center" color="#f9a822">
                    {message}
                </Typography>
            </Container>
        </div>
    );
};

const Loader = () => {
    return (
        <Backdrop open={true}>
            <CircularProgress size="5em"/>
        </Backdrop>
    );
};

export default DisplayMessage;