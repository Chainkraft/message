import React, {useState} from "react";
import {BigNumber, ethers} from "ethers";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
    Alert,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    FormControl,
    Input,
    InputLabel, Snackbar,
} from "@mui/material";
import {getMessageContract, getWalletProvider} from "../config/Blockchain";

const AddMessage = () => {
    const [form, setForm] = useState({
        minPrice: BigNumber.from(0),
        price: BigNumber.from(0),
        message: "",
        error: ""
    });
    const [loading, setLoading] = useState(false);
    const [processingTx, setProcessingTx] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [walletError, setWalletError] = useState(false);

    const handleDialogOpen = async () => {
        if(window.ethereum === undefined) {
            setWalletError(true);
            return;
        }

        setLoading(true);

        // Gets MetaMask provider
        const provider = getWalletProvider();

        // MetaMask requires requesting permission to connect users accounts
        await provider.send("eth_requestAccounts", []);

        // Creates contract connector instance using MetaMask provider
        const contract = getMessageContract(provider);

        // Updates form state variable setting minimum price required to change the displayed message
        setForm({
            ...form,
            minPrice: await contract.price()
        });
        setLoading(false);
        setShowDialog(true);
    };

    const handlePublish = async () => {
        setProcessingTx(true);

        // Gets MetaMask provider
        const provider = getWalletProvider();

        // Gets MetaMask account as a Signer
        const signer = provider.getSigner();

        // Creates contract connector instance using MetaMask provider
        const contract = getMessageContract(provider);

        // Connects contract to the Signer allowing making payments to send state-changing transactions
        const contractWithSigner = contract.connect(signer);

        // Invokes SetMessage contract method passing a new message and ETH tokens from Signers account
        await contractWithSigner.setMessage(form.message, {value: form.price})
            .then(handleDialogClose)
            .catch((error: any) => setForm({...form, error: error.error.message}))
            .finally(() => setProcessingTx(false));
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        // Updates form state variable setting the message
        setForm({...form, message: e.target.value});

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        // Updates form state variable setting the price in WEI
        setForm({...form, price: ethers.utils.parseEther(e.target.value)});

    const handleDialogClose = () => setShowDialog(false);

    return (
        <div>
            <Fab
                onClick={handleDialogOpen}
                color="primary"
                aria-label="add"
                sx={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                }}
            >
                {!loading && <AddIcon/>}
                {loading && <CircularProgress sx={{color: "red"}}/>}
            </Fab>

            <Dialog open={showDialog} onClose={handleDialogClose}>
                <DialogTitle>Publish message</DialogTitle>
                <DialogContent>
                    {form.error && (
                        <Alert severity="error" sx={{marginBottom: 2}}>
                            {form.error}
                        </Alert>
                    )}
                    <DialogContentText>
                        You need to pay more than {ethers.utils.formatEther(form.minPrice)} ETH to outbid current message.
                    </DialogContentText>
                    <FormControl fullWidth variant="standard" margin="normal">
                        <InputLabel htmlFor="standard-adornment-amount" required>
                            The message
                        </InputLabel>
                        <Input
                            autoFocus
                            required
                            type="text"
                            value={form.message}
                            onChange={handleMessageChange}
                        />
                    </FormControl>
                    <FormControl fullWidth variant="standard" margin="normal">
                        <InputLabel htmlFor="standard-adornment-amount" required>
                            Price
                        </InputLabel>
                        <Input
                            required
                            type="number"
                            value={ethers.utils.formatEther(form.price)}
                            onChange={handlePriceChange}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePublish} disabled={processingTx}>
                        {!processingTx && "Publish"}
                        {processingTx && "Publishing..."}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={walletError} autoHideDuration={6000}>
                <Alert severity="error">
                    Install MetaMask plugin to add a message
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddMessage;