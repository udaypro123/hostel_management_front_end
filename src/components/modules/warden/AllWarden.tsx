import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Tooltip, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { deleteWarden, getWardens } from '../../auth/api/wardenApi';
import { HostelLoader } from '../../../utils/hostelLoader';
import { DataGrid } from '../../../utils/Datagrid';
import { DeleteModel } from '../../../utils/DeleteModal';

// import { useNavigate } from 'react-router-dom'; // Uncomment when you setup React Router

interface Warden {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  experience: number;
  qualification: string;
  emergencyContact: string;
  joiningDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AllWardenProps {
  // No complex props needed - manage your own navigation
}

// Helper component for truncated text with tooltip
const TruncatedCell: React.FC<{ value: string; maxLength?: number }> = ({
  value,
  maxLength = 25
}) => {
  if (!value) return <Typography variant="body2">-</Typography>;

  const truncated = value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;

  return (
    <Tooltip title={value} arrow placement="top">
      <Typography
        variant="body2"
        sx={{
          cursor: 'help',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
          maxWidth: '100%'
        }}
      >
        {truncated}
      </Typography>
    </Tooltip>
  );
};

// Helper component for phone numbers with responsive behavior
const PhoneCell: React.FC<{ value: string }> = ({ value }) => {
  const phoneNumber = `+91${value}`;
  return (
    <Tooltip title={phoneNumber} arrow placement="top">
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'monospace',
          cursor: 'help',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
          maxWidth: '100%'
        }}
      >
        {phoneNumber}
      </Typography>
    </Tooltip>
  );
};


// Helper component for date with responsive behavior
const DateCell: React.FC<{ value: string }> = ({ value }) => {
  const formattedDate = new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Tooltip title={formattedDate} arrow placement="top">
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          cursor: 'help',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
          maxWidth: '100%'
        }}
      >
        {formattedDate}
      </Typography>
    </Tooltip>
  );
};

const AllWarden: React.FC<AllWardenProps> = () => {
  const [wardens, setWardens] = useState<Warden[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState<any>(false);
  const [deletewardenID, setDeleteWardenID] = useState<string>("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchWardens();
  }, []);

  const fetchWardens = async () => {
    try {
      setLoading(true);
      const response = await getWardens();
      console.log('Fetched wardens:', response);
      let filterdata: any = response?.data?.filter((w: any) => w?.isActive)?.reverse();
      setWardens(filterdata || response);
    } catch (err: any) {
      enqueueSnackbar('Failed to fetch wardens. Please try again.', { variant: 'error' });
      console.error('Error fetching wardens:', err);
    } finally {
      setLoading(false);
    }
  };

  // Simple navigation function - customize as needed
  const navigateTo = (route: string, wardenData?: any) => {
    console.log('Navigating to:', route, 'with data:', wardenData);
    // Option 2: Use React Router with state (when you setup proper routing)
    navigate(route, { state: { wardenData } });

  };

  // Simple navigation function - customize as needed
  const navigateToEdit = (route: string, wardenData?: any) => {
    console.log('Navigating to:', route, 'with data:', wardenData);
    navigate(route, { state: { wardenData, isedit: true } });
  };

  const navigateToAdd = (route: string, wardenData?: any) => {
    console.log('Navigating to:', route, 'with data:', wardenData);
    navigate(route, { state: { wardenData, isedit: false } });
  };

  const deleteWardenData = async (wardenData?: any) => {
    setDeleteWardenID(wardenData.id);
    setOpenDeleteModel(true);
    console.log('Deleting warden data:', wardenData);
  };

  const closeModel = async () => {
    setOpenDeleteModel(false);
  };

  const confirmToDelete = async () => {
    console.log('Deleting warden data:', deletewardenID);
    try {
      await deleteWarden(deletewardenID);
      fetchWardens();
      setOpenDeleteModel(false); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting warden:', error);
    }
  };

  const columns: any = [
    {
      field: 'fullName',
      headerName: 'Name',
      flex: 1.5,
      renderCell: (params: any) => {
        const fullName = `${params.row.firstName} ${params.row.lastName}`;
        return <TruncatedCell value={fullName} maxLength={20} />;
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.5,
      renderCell: (params: any) => (
        <TruncatedCell value={params.value} maxLength={25} />
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      renderCell: (params: any) => (
        <PhoneCell value={params.value} />
      ),
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1.5,
      renderCell: (params: any) => (
        <TruncatedCell value={params.value} maxLength={20} />
      ),
    },
    {
      field: 'experience',
      headerName: 'Experience',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => (
        <Tooltip title={`${params.row.experience} years of experience`} arrow placement="top">
          <Chip
            label={`${params.row.experience}y`}
            size="small"
            sx={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              fontWeight: 'medium',
              cursor: 'help',
              maxWidth: '100%'
            }}
          />
        </Tooltip>
      ),
    },
    {
      field: 'qualification',
      headerName: 'Qualification',
      flex: 1,
      renderCell: (params: any) => (
        <TruncatedCell value={params.value} maxLength={15} />
      ),
    },
    {
      field: 'emergencyContact',
      headerName: 'Emergency',
      flex: 1,
      renderCell: (params: any) => (
        <Tooltip title={params.value} arrow placement="top">
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              cursor: 'help',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
              maxWidth: '100%'
            }}
          >
            +91{params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'joiningDate',
      headerName: 'Joined',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => (
        <DateCell value={params.row.joiningDate} />
      ),
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.8,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => (
        <Tooltip title={params.value ? 'Warden is currently active' : 'Warden is currently inactive'} arrow placement="top">
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              cursor: 'help',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
              maxWidth: '100%'
            }}
          >
            {params.value ? 'Active' : 'Inactive'}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.2,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 1 }}>

          <VisibilityIcon
            fontSize="small"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              console.log('Warden data:', params.row);
              navigateTo('/viewWarden', params.row);
            }}
          />
          <EditIcon
            fontSize="small"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              console.log('Warden data:', params.row);
              navigateToEdit('/addWarden', params.row);
            }}
          />
          <DeleteIcon
            fontSize="small"
            color="error"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              // Store warden data in localStorage for props management
              deleteWardenData(params.row);
            }}
          />
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <HostelLoader />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.paper, }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            All Wardens
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage hostel wardens
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigateToAdd('/addWarden')}
            sx={{ px: 3, py: 1.5, borderRadius: 2 }}
          >
            + Add Warden
          </Button>
        </Box>
      </Box>

      {/* Wardens Table */}
      {wardens.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 12 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
            No wardens found
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigateTo('/addWarden')}
            sx={{ mt: 2, px: 3, py: 1 }}
          >
            Add First Warden
          </Button>
        </Box>
      ) : (
        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid rows={wardens} columns={columns} />
        </Box>
      )}

      {
        openDeleteModel && (
          <DeleteModel
            confirmToDelete={confirmToDelete}
            deleteId={deletewardenID}
            closeModel={closeModel}
            deleteText="Warden"
          />
        )
      }
    </Box>
  );
};

export default AllWarden;
