import React from 'react';
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { styled, keyframes } from '@mui/material/styles';
import hostel from '../assets/images/hostel.png';

// Animation for the dots
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const Dot = styled('div')<{ delay: number }>(({ delay }) => ({
    width: '25px',
    height: '25px',
    backgroundColor: '#55009fff',
    borderRadius: '50%',
    display: 'inline-block',
    margin: '0 6px',
    animation: `${bounce} 1.4s infinite ease-in-out`,
    animationDelay: `${delay}s`,
}));

const LoaderContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: 'background.paper',
    borderRadius: 8,
    textAlign: 'center',
});

const DotsContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0',
});

interface HostelLoaderProps {

}

export const HostelLoader: React.FC<HostelLoaderProps> = ({ }) => {
    return (
        <LoaderContainer sx={{ margin: '10% auto'}}>

            <Box sx={{ marginBottom: 2 , }}>
                <img
                    src={hostel}
                    alt="Loading"
                    style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'contain',
                        filter: 'opacity(0.7)'
                    }}
                />
            </Box>

            <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
                Hostel Loader 
            </Typography>

            <DotsContainer>
                <Dot delay={0} />
                <Dot delay={0.3} />
                <Dot delay={0.5} />
                <Dot delay={0.8} />
            </DotsContainer>

        </LoaderContainer>
    )
}