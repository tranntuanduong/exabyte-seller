import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

export interface FilePreview extends File {
  preview: string;
}

interface Props {
  previews: FilePreview[];
  images?: string[] | null;
  dense?: boolean;
}

const ImagePreview = (props: Props) => {
  const { previews, images, dense } = props;
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!previews.length && images) {
      setImagePreviews(images);
    } else {
      setImagePreviews(previews.map((file: FilePreview) => file.preview));
    }
  }, [previews, images]);

  const column = dense ? 4 : 3;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${column}, 1fr)`,
        gap: 1,
      }}
    >
      {imagePreviews.slice(0, 6).map((item, i) => (
        <Box
          key={i}
          sx={{
            border: 1,
            borderColor: 'divider',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
            src={item}
            style={{
              width: 1,
              height: 1,
              objectFit: 'cover',
              aspectRatio: '1 / 1',
            }}
          />
          {imagePreviews.length > 6 && i === 5 && (
            <Box
              sx={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: 'absolute',
                color: 'common.white',
                bgcolor: 'action.disabled',
                userSelect: 'none',
                display: 'grid',
                placeContent: 'center',
              }}
            >
              <Typography variant="h6">+{imagePreviews.length - 6}</Typography>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ImagePreview;
