import { Avatar, Card, CardContent, LinearProgress, Typography } from "@mui/material";
import { Box, useTheme } from "@mui/system";



export const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactElement;
    color: string;
    // subtitle?: string;
    progress?: number;
  }> = ({ title, value, icon, color, progress }) => {
    const theme:any = useTheme();

    return (
      <Card
        sx={{
          height: '100%',
          background: `white`,
          // border: `1px solid ${color}33`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(1px)',
            // boxShadow: theme.shadows['5'],
          }
        }}
      >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {progress !== undefined && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: color
              }
            }}
          />
        )}
      </CardContent>
    </Card>
    )};
