import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Stack,
    Modal
} from "@mui/material";
import { chatBotApi } from "./chatbot.api";
import CloseIcon from '@mui/icons-material/Close';

interface Message {
    sender: "user" | "bot";
    text: string;
}
interface ChatbotProps {
    open: any;
    handleclose: any;

}

const Chatbot: React.FC<ChatbotProps> = ({ open, handleclose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input) return;

        const userMsg: Message = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);

        try {
            const res = await chatBotApi({ query: input });
            const botMsg: Message = {
                sender: "bot",
                text: res.data.ask || "No reply"
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            const errorMsg: Message = {
                sender: "bot",
                text: "Error: Could not fetch AI response."
            };
            setMessages((prev) => [...prev, errorMsg]);
        }

        setInput("");
    };

    return (
        <Modal open={open} >
            <Card sx={{minWidth:250, maxWidth: 850, margin: "10% auto", boxShadow: 3, borderRadius: 3 }}>
                <CardContent>
                    <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                        <Typography variant="h4" gutterBottom>
                            Hostel Assistant 🤖
                        </Typography>
                        <Typography variant="h3" gutterBottom textAlign={"end"} onClick={() => handleclose()}>
                            <CloseIcon sx={{height:35, width:35,color:"red", fontWeight:"bold", cursor:"pointer" }} />
                        </Typography>
                    </Box>

                    {/* Chat Window */}
                    <Box
                        sx={{
                            height: 300,
                            overflowY: "auto",
                            // border: "1px solid #ffecffff",
                            borderRadius: 2,
                            p: 1,
                            mb: 2,
                            bgcolor: "#fef6ffff"
                        }}
                    >
                        {messages?.map((msg:any, i:any) => (
                            <Typography
                                key={i}
                                sx={{
                                    textAlign: msg.sender === "user" ? "right" : "left",
                                    color: msg.sender === "user" ? "primary.main" : "text.primary",
                                    mb: 1
                                }}
                            >
                                <b>{msg.sender} : </b> {msg.text}
                            </Typography>
                        ))}
                    </Box>

                    {/* Input + Button */}
                    <Stack direction="row" spacing={1}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Ask something..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button variant="contained" onClick={sendMessage}>
                            Ask
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Modal>
    );
};

export default Chatbot;
