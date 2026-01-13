import { FC } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  styled,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FiltersBar } from '@talendig/shared';
import type { SearchFilterProps } from './SearchFilter.types';

const StyledFiltersBar = styled(FiltersBar)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:focus-within': {
    boxShadow: `0 0 0 2px ${theme.palette.mode === 'light' ? 'rgba(19, 55, 236, 0.1)' : 'rgba(19, 55, 236, 0.2)'}`,
  },
  marginBottom: '1rem !important',
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  width: '100%',
  '& .MuiOutlinedInput-root': {
    paddingLeft: 40, // pl-10 equivalent
    backgroundColor: theme.palette.mode === 'light' ? '#f1f5f9' : '#1f2937',
    border: 'none',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
      boxShadow: `0 0 0 2px ${theme.palette.mode === 'light' ? 'rgba(19, 55, 236, 0.5)' : 'rgba(19, 55, 236, 0.7)'}`,
    },
    '& input': {
      fontSize: 14,
      padding: '8px 16px',
    },
  },
}));

const SearchIconWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  color: theme.palette.mode === 'light' ? '#94a3b8' : '#64748b',
  pointerEvents: 'none',
  zIndex: 1,
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: 'auto',
    flex: 'none',
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.mode === 'light' ? '#f1f5f9' : '#1f2937',
    border: 'none',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
      boxShadow: `0 0 0 2px ${theme.palette.mode === 'light' ? 'rgba(19, 55, 236, 0.5)' : 'rgba(19, 55, 236, 0.7)'}`,
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  padding: '8px 32px 8px 12px',
  fontSize: 14,
  '& .MuiSelect-icon': {
    color: theme.palette.mode === 'light' ? '#94a3b8' : '#64748b',
    right: 8,
  },
}));

export const SearchFilter: FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCohort,
  onCohortChange,
  availableCohorts,
}) => {

  return (
    <StyledFiltersBar sx={{ marginBottom: '1rem !important' }}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <SearchIconWrapper position="start">
          <SearchIcon sx={{ fontSize: 20 }} />
        </SearchIconWrapper>
        <SearchTextField
          placeholder="Search by program name or instructor..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: null, // We're using absolute positioning instead
          }}
        />
      </Box>

      <StyledFormControl>
        <StyledSelect
          value={selectedCohort}
          onChange={(e) => onCohortChange(e.target.value as string)}
          IconComponent={KeyboardArrowDownIcon}
          displayEmpty
        >
          <MenuItem value="ALL">All Cohorts</MenuItem>
          {availableCohorts.map((cohort) => (
            <MenuItem key={cohort.id} value={cohort.id}>
              {cohort.name}
            </MenuItem>
          ))}
        </StyledSelect>
      </StyledFormControl>
    </StyledFiltersBar>
  );
};
