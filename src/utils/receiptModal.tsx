
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface ReciptModal {
    receiptHtml: any;
    open: any;
    handleClose: any;
    handleOpen: any;
}

export const ReceiptModal = ({ receiptHtml, open, handleClose }: ReciptModal) => {
    console.log("openenncsdc" , open)

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2, overflow: "hidden" }
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.2rem"
                    }}
                >
                    Receipt Preview
                </DialogTitle>
                <DialogContent
                    sx={{
                        bgcolor: "#f4f7fa",
                        p: 0,
                        "&::-webkit-scrollbar": { width: 6 },
                        "&::-webkit-scrollbar-thumb": { bgcolor: "#ccc", borderRadius: 3 }
                    }}
                >
                    {/* Render the HTML string */}
                    <div
                        dangerouslySetInnerHTML={{ __html: receiptHtml }}
                        style={{ width: "100%" }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
