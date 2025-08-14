import { 
    Box,
    Button,
    Typography,
 } from "@mui/material";

interface DeleteModelProps {
  confirmToDelete: (id: string | null) => void;
  closeModel: () => void;
  deleteId: string | null;
  deleteText ?: string;
}

export const DeleteModel: React.FC<DeleteModelProps> = ({ confirmToDelete, deleteId, closeModel, deleteText }) => {
  // Implement your delete confirmation logic here
  return (
    <div style={{ height: "100vh", width: "100vw", position: "fixed", top: 0, left: 0, backgroundColor: "rgba(22, 63, 145, 0.7)", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "50%", width: "45%", backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', margin: ' 1rem auto', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {/* Your delete confirmation UI */}
        <Box sx={{ backgroundColor: '#013beaff', borderRadius: '2px', padding:"8px", boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem', }}>
          <Typography variant="h4" ml={1} color='white'>Delete {deleteText}</Typography>
        </Box>
        <Box sx={{ display: 'flex', height: "100%", flexDirection: 'column', alignItems: 'center', gap: 2, padding: 2, justifyContent: 'space-around' }}>
          <Typography fontSize={18} fontWeight={500} fontFamily={"verdana"}>Are you sure you want to delete this {deleteText} ?</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="error" onClick={() => confirmToDelete(deleteId)}>
              Confirm Delete
            </Button>
            <Button variant="outlined" onClick={() => closeModel()}>
              Cancel
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
}