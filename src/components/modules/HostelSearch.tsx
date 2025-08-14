import React, { useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Typography,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Clear as ClearIcon,
  LocationOn,
  AttachMoney,
  People,
  FilterAlt
} from '@mui/icons-material';
import type { HostelFilters } from '../auth/api/hostelApi';

interface HostelSearchProps {
  onSearch: (filters: HostelFilters) => void;
  initialFilters?: HostelFilters;
}

const HostelSearch: React.FC<HostelSearchProps> = ({
  onSearch,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<HostelFilters>({
    search: '',
    city: '',
    state: '',
    type: '',
    status: '',
    minFees: 0,
    maxFees: 50000,
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 12,
    ...initialFilters
  });

  const [feesRange, setFeesRange] = useState<number[]>([
    filters.minFees || 0,
    filters.maxFees || 50000
  ]);

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleInputChange = (field: keyof HostelFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Update active filters
    const active = Object.entries(newFilters)
      .filter(([key, val]) => val && val !== '' && key !== 'page' && key !== 'limit')
      .map(([key]) => key);
    setActiveFilters(active);
  };

  const handleFeesChange = (_: Event, newValue: number | number[]) => {
    const range = newValue as number[];
    setFeesRange(range);
    setFilters(prev => ({
      ...prev,
      minFees: range[0],
      maxFees: range[1]
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    const clearedFilters: HostelFilters = {
      search: '',
      city: '',
      state: '',
      type: '',
      status: '',
      minFees: 0,
      maxFees: 50000,
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      limit: 12
    };
    setFilters(clearedFilters);
    setFeesRange([0, 50000]);
    setActiveFilters([]);
    onSearch(clearedFilters);
  };

  const handleRemoveFilter = (filterKey: string) => {
    const newFilters = { ...filters };
    if (filterKey === 'fees') {
      newFilters.minFees = 0;
      newFilters.maxFees = 50000;
      setFeesRange([0, 50000]);
    } else {
      (newFilters as any)[filterKey] = '';
    }
    setFilters(newFilters);
    
    const active = activeFilters.filter(f => f !== filterKey);
    setActiveFilters(active);
    onSearch(newFilters);
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      {/* Quick Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search hostels by name, location, or amenities..."
          value={filters.search}
          onChange={(e) => handleInputChange('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: filters.search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleInputChange('search', '')}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: 2 }
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </Box>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Active Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {activeFilters.map((filter) => (
              <Chip
                key={filter}
                label={`${filter}: ${(filters as any)[filter]}`}
                onDelete={() => handleRemoveFilter(filter)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
            <Button
              size="small"
              onClick={handleClear}
              startIcon={<ClearIcon />}
              sx={{ ml: 1 }}
            >
              Clear All
            </Button>
          </Stack>
        </Box>
      )}

      {/* Advanced Filters */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center' } }}
        >
          <FilterAlt sx={{ mr: 1 }} />
          <Typography variant="h6">Advanced Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              {/* Location Filters */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ mr: 1, fontSize: 18 }} />
                    Location
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="City"
                      value={filters.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <FormControl size="small" fullWidth>
                      <InputLabel>State</InputLabel>
                      <Select
                        value={filters.state}
                        label="State"
                        onChange={(e) => handleInputChange('state', e.target.value)}
                      >
                        <MenuItem value="">All States</MenuItem>
                        {indianStates.map((state) => (
                          <MenuItem key={state} value={state}>{state}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
              </Box>

              {/* Type and Status */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <People sx={{ mr: 1, fontSize: 18 }} />
                    Hostel Type & Status
                  </Typography>
                  <Stack spacing={2}>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={filters.type}
                        label="Type"
                        onChange={(e) => handleInputChange('type', e.target.value)}
                      >
                        <MenuItem value="">All Types</MenuItem>
                        <MenuItem value="boys">Boys</MenuItem>
                        <MenuItem value="girls">Girls</MenuItem>
                        <MenuItem value="co-ed">Co-ed</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filters.status}
                        label="Status"
                        onChange={(e) => handleInputChange('status', e.target.value)}
                      >
                        <MenuItem value="">All Status</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                        <MenuItem value="full">Full</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
              </Box>
            </Box>

            {/* Fees Range */}
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ mr: 1, fontSize: 18 }} />
                  Monthly Fees Range
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={feesRange}
                    onChange={handleFeesChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
                    min={0}
                    max={50000}
                    step={1000}
                    marks={[
                      { value: 0, label: '₹0' },
                      { value: 10000, label: '₹10K' },
                      { value: 25000, label: '₹25K' },
                      { value: 50000, label: '₹50K' }
                    ]}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Min: ₹{feesRange[0].toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Max: ₹{feesRange[1].toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Sort Options */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => handleInputChange('sortBy', e.target.value)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="fees.monthly">Monthly Fees</MenuItem>
                  <MenuItem value="rating.average">Rating</MenuItem>
                  <MenuItem value="currentOccupancy">Occupancy</MenuItem>
                  <MenuItem value="createdAt">Date Added</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Sort Order</InputLabel>
                <Select
                  value={filters.sortOrder}
                  label="Sort Order"
                  onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          sx={{ borderRadius: 2, flexGrow: 1 }}
        >
          Apply Filters
        </Button>
        <Button
          variant="outlined"
          onClick={handleClear}
          startIcon={<ClearIcon />}
          sx={{ borderRadius: 2 }}
        >
          Clear
        </Button>
      </Box>
    </Paper>
  );
};

export default HostelSearch;
