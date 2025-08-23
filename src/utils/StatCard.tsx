import { Avatar, Card, CardContent, LinearProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";



export const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: string;
  border?: any;
  progress?: number;
  boxShadow?: any;
}> = ({ title, value, icon, color, progress, boxShadow, border }) => {
  // const theme:any = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        background: `white`,
        border: border,
        transition: 'all 0.3s ease',
        boxShadow: boxShadow,
        '&:hover': {
          transform: 'translateY(1px)',
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
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
  )
};
