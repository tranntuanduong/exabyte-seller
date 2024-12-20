// import type { SvgIconComponent } from '@mui/icons-material';
// import NoteIcon from '@mui/icons-material/Note';
import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { DropzoneOptions } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import UserIcon from "src/layouts/components/UserIcon";

interface Props extends DropzoneOptions {
  icon?: string;
  sx?: BoxProps["sx"];
}

const FileDropZone = (props: Props) => {
  const {
    accept,
    maxFiles,
    maxSize,
    minSize,
    onDrop,
    multiple = false,
    icon,
    sx,
  } = props;
  const { t } = useTranslation();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onDrop,
    multiple,
  });

  return (
    <Wrapper isDragActive={isDragActive} sx={sx} {...getRootProps()}>
      <input {...getInputProps()} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon && <UserIcon icon={icon} />}
        <Typography variant="caption" align="center" sx={{ mt: 1 }}>
          {t("dropzone.description")}
        </Typography>
        {maxFiles && multiple && (
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold" }}
            color="text.secondary"
          >
            {`(${t("dropzone.maximum", {
              maxFiles,
            })})`}
          </Typography>
        )}
      </Box>
    </Wrapper>
  );
};

const Wrapper = styled(Box)<{ isDragActive: boolean }>(
  ({ theme, isDragActive }) => ({
    display: "flex",
    flexGrow: 1,
    border: 3,
    borderStyle: "dashed",
    borderColor: theme.palette.divider,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    padding: theme.spacing(2),
    ...(isDragActive && {
      backgroundColor: theme.palette.action.active,
      opacity: 0.5,
    }),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      cursor: "pointer",
      opacity: 0.5,
    },
  })
);

export default FileDropZone;
