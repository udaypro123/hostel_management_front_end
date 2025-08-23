import React, { use, useEffect, useState } from "react";
import {
    Box,
    CardContent,
    Typography,
    TextField,
    Button,
    Stack,
    Modal
} from "@mui/material";
import { chatBotApi, getAiChat } from "./chatbot.api";
import CloseIcon from '@mui/icons-material/Close';
import { enqueueSnackbar } from "notistack";

interface Message {
    sender: "user" | "bot";
    content: string;
}
interface ChatbotProps {
    open: any;
    handleclose: any;

}

const Chatbot: React.FC<ChatbotProps> = ({ open, handleclose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    let data = localStorage.getItem('user') || '{}';
    const user = JSON.parse(data);
    console.log('User data:', user);

    const sendMessage = async () => {
        if (!input) return;

        const userMsg: Message = { sender: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);

        try {
            const res = await chatBotApi({ query: input, sender: user.id });
            console.log("ressdsds", res?.data?.message?.content)
            const botMsg: Message = {
                sender: "bot",
                content: res?.data?.message?.content || "No reply"
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            const errorMsg: Message = {
                sender: "bot",
                content: "Error: Could not fetch AI response."
            };
            setMessages((prev) => [...prev, errorMsg]);
        }

        setInput("");
    };


    const GetAiChatData = async () => {
        try {
            const response = await getAiChat(user?.id);
            console.log("GetAiChatData", response);
            setMessages(response.data);
        } catch (error) {
            console.log(error)
            enqueueSnackbar("Error fetching AI chat response", { variant: "error" });
        }
    };

    useEffect(() => {
        GetAiChatData();
    }, []);

    return (
        <Modal open={open} >
            <Box sx={{
                minWidth:"45%",
                maxWidth: "60%",
                mx: 'auto',
                mt: 12,
                borderRadius: 1,
                background: '#ffffffff',
                p: 0,
                position: 'relative',
                overflow: 'hidden',
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 1,
                    background: 'linear-gradient(90deg, #4105ceff 0%, #b50182ff 100%)',
                    borderTopLeftRadius: 1,
                    borderTopRightRadius: 1,
                    boxShadow: 1,
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
                        Hostel Assistant <span role="img" aria-label="love">🤖</span>
                    </Typography>
                    <Box onClick={handleclose} sx={{ cursor: 'pointer', ml: 2 }}>
                        <CloseIcon sx={{ fontSize: 32, color: '#fff', transition: '0.2s', '&:hover': { color: '#ff1744', transform: 'scale(1.2)' } }} />
                    </Box>
                </Box>
                <CardContent sx={{ p: 2, pb: 1, }}>
                    {/* Chat Window */}
                    <Box
                        sx={{
                            height: 380,
                            overflowY: "auto",
                            borderRadius: 1,
                            p: 1,
                            mb: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            scrollbarWidth: "none", // Firefox
                            "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
                        }}
                    >
                        {messages?.length === 0 && (
                            <Typography variant="h6" sx={{ textAlign: 'center', mt: 10 }}>
                                Ask your Query!
                            </Typography>
                        )}
                        {messages?.map((msg: any, i: any) => (
                            <Box
                                key={i}
                                sx={{
                                    display: 'flex',
                                    justifyContent: msg?.sender === 'user' ? 'flex-end' : 'flex-start',
                                    animation: 'fadeIn 0.5s',
                                }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: '80%',
                                        px: 2,
                                        py: 1.2,
                                        borderRadius: 3,
                                        bgcolor: msg?.sender === 'user' ? 'linear-gradient(90deg,#fbc2eb,#a6c1ee)' : 'linear-gradient(90deg,#f5f7fa,#c9e7ff)',
                                        color: msg?.sender === 'user' ? '#6a0572' : '#000750ff',
                                        boxShadow: msg?.sender === 'user' ? 2 : 1,
                                        fontWeight: 500,
                                        fontSize: 16,
                                        mb: 0.5,
                                        wordBreak: 'break-word',
                                        position: 'relative',
                                        borderBottomRightRadius: msg?.sender === 'user' ? 8 : 24,
                                        borderBottomLeftRadius: msg?.sender === 'user' ? 24 : 8,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {msg?.sender === 'user' ? '🧑‍💻' : '🤖'} <b style={{ fontWeight: 700 }}>{msg?.sender === 'user' ? 'You ' : ' Assistant'}:</b> {msg?.content}
                                </Box>
                            </Box>
                        ))}
                        <style>{`
                            @keyframes fadeIn {
                                from { opacity: 0; transform: translateY(10px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                        `}</style>
                    </Box>
                    {/* Input + Button */}
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            size="medium"
                            placeholder="Type your question with 💜..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            minRows={1}
                            maxRows={3}
                            sx={{
                                // background: `linear-gradient(90deg, #4105ceff 0%, #b50182ff 100%)`,
                                borderRadius: 1,
                                boxShadow: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '& fieldset': { border: 'none' },
                                    '&:hover fieldset': { border: 'none' },
                                    '&.Mui-focused fieldset': { border: 'none' },
                                },
                                '& .MuiOutlinedInput-input': {
                                    outline: 'none',
                                    boxShadow: 'none',
                                    overflow: 'auto',   // extra content ke liye scroll enable
                                },
                            }}
                            onKeyDown={(e: any) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault(); // enter pe new line ke bajaye message bhejna
                                    sendMessage();
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={sendMessage}
                            sx={{
                                color: '#fff',
                                fontWeight: 700,
                                borderRadius: 2,
                                px: 1,
                                mt: 5,
                                boxShadow: 1,
                                fontSize: 18,
                                width: "15%",
                                height: "3rem"
                            }}
                        >
                            Ask
                        </Button>
                    </Stack>

                </CardContent>
            </Box>
        </Modal>
    );
};

export default Chatbot;
