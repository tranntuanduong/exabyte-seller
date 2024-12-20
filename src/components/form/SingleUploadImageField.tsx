import { Icon } from "@iconify/react";
import { Box, Button, Grid, InputAdornment, TextField } from "@mui/material";
import { FieldPath } from "react-hook-form";
import SingleImageUploader from "../upload/SingleImageUploader";
import { Dispatch, SetStateAction } from "react";

interface Props {
  label?: string;
  isRounded?: boolean;
  size?: string;
  hasLabel?: boolean;
  file: File | null;
  setFile?: (file: File) => void;
  direction?: "row" | "column";
  demoImg?: string;
}

const SingleUploadImageField = ({
  label = "Logo shop",
  isRounded = true,
  size = "200px",
  hasLabel = true,
  file,
  setFile,
  direction = "row",
  demoImg,
}: Props) => {
  return (
    <Box
      sx={{
        fontSize: "1rem",
        display: "flex",
        columnGap: "20px",
        flexDirection: direction,
      }}
    >
      {hasLabel && (
        <Box
          sx={{
            mb: 2,
            textAlign: direction === "column" ? "left" : "right",
            width: "200px",
          }}
        >
          {label}
        </Box>
      )}

      <SingleImageUploader
        isRounded={isRounded}
        size={size}
        file={file}
        setFile={setFile}
        demoImg={demoImg}
      />
    </Box>
  );
};

export default SingleUploadImageField;
