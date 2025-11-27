import { FC, useState, ChangeEvent } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';

interface CVUploadProps {
  instructorId: string;
  onUploadComplete: (url: string, path: string) => void;
  existingUrl?: string;
}

export const CVUpload: FC<CVUploadProps> = ({
  instructorId,
  onUploadComplete,
  existingUrl,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const storagePath = `instructors/${instructorId}/cv.pdf`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      onUploadComplete(downloadURL, storagePath);
    } catch (err: any) {
      setError(err.message || 'Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        CV Upload
      </Typography>
      {existingUrl && (
        <Alert severity="info" sx={{ mb: 2 }}>
          CV already uploaded. Upload a new file to replace it.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload CV'}
        <input
          type="file"
          hidden
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </Button>
      {existingUrl && (
        <Button
          variant="text"
          href={existingUrl}
          target="_blank"
          sx={{ ml: 2 }}
        >
          View Current CV
        </Button>
      )}
    </Box>
  );
};

