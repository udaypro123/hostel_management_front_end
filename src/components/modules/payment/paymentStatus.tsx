import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, CircularProgress, Fade } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { enqueueSnackbar } from "notistack";
import { VerifyPayment } from "../../auth/api/paymentApi";

export default function PaymentStatus() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const [status, setStatus]= useState<any>("pending")
    // const paymentId = queryParams.get("razorpay_payment_id")
    const paymentLinkId = queryParams.get("razorpay_payment_link_id");
    const amount = queryParams.get("amount");
    const orderId = queryParams.get("orderId");

    useEffect(() => {
        const paymentStatus = queryParams.get("razorpay_payment_link_status");
        setStatus(paymentStatus)
        let obj = {
            amount,
            paymentLinkId,
            paymentStatus,
            orderId
        }
        getVerifyPayment(obj)
    }, [location,paymentLinkId,amount,orderId, queryParams]);

    const getVerifyPayment = async (obj: any) => {
        try {
            await VerifyPayment(obj)
            enqueueSnackbar("payment successfull", {variant:"success"})
        } catch (error) {
            enqueueSnackbar("payment failed", {variant:"error"})
        }
    }

    const handleBackHome = () => {
        navigate('/payment');
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', bgcolor: '#f5f6fa' }}>
            {status === 'pending' ? (
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress color="primary" />
                    <Typography variant="h6" sx={{ mt: 2 }}>Verifying payment, please wait...</Typography>
                </Box>
            ) : (
                <Fade in={status === 'paid' || status === 'fail'} timeout={700}>
                    <Card sx={{ minWidth: 320, borderRadius: 3, boxShadow: 4, p: 2, textAlign: 'center', position: 'relative' }}>
                        <CardContent>
                            <Box sx={{ mb: 3 }}>
                                {status === 'paid' ? (
                                    <CheckCircleIcon sx={{ fontSize: 64, color: '#4BB543', animation: 'pop 0.7s' }} />
                                ) : (
                                    <CancelIcon sx={{ fontSize: 64, color: '#FF3B30', animation: 'shake 0.7s' }} />
                                )}
                            </Box>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                {status === 'paid' ? 'Payment Successful!' : 'Payment Failed'}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {status === 'paid' ? 'Thank you for your payment.' : 'There was an issue with your payment.'}
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Amount: ₹{amount || 'N/A'}
                            </Typography>
                            <Button onClick={handleBackHome} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600, fontSize: 16 }}>
                                Back to Home
                            </Button>
                            <style>{`
                @keyframes pop {
                  0% { transform: scale(0.5); opacity: 0; }
                  60% { transform: scale(1.2); opacity: 1; }
                  100% { transform: scale(1); }
                }
                @keyframes shake {
                  0% { transform: translateX(0); }
                  20% { transform: translateX(-10px); }
                  40% { transform: translateX(10px); }
                  60% { transform: translateX(-10px); }
                  80% { transform: translateX(10px); }
                  100% { transform: translateX(0); }
                }
              `}</style>
                        </CardContent>
                    </Card>
                </Fade>
            )}
        </Box>
    );
}

