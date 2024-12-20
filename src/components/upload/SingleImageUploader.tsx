import { HTMLAttributes } from "react";

import UserIcon from "src/layouts/components/UserIcon";

// ** MUI Imports
import Box from "@mui/material/Box";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { IMAGE_BASE_URL } from "src/constants/aws";

interface FileProp {
  name: string;
  type: string;
  size: number;
}

interface Props extends HTMLAttributes<any> {
  label?: string;
  onUploadFile?: (file: File) => void;
  defaultImage?: string;
  size?: string;
  isRounded?: boolean;
  file: File | string | null;
  setFile?: (file: File) => void;
  demoImg?: string;
}

const SingleImageUploader = ({
  label,
  onUploadFile,
  defaultImage,
  size = "120px",
  isRounded = true,
  file,
  setFile,
  demoImg,
}: Props) => {
  // ** State

  // ** Hook
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: {
      "image/jpeg": [".jpeg", ".png", ".jpg"],
    },
    onDrop: (acceptedFiles: File[]) => {
      if (!setFile) return;
      console.log("acceptedFiles", acceptedFiles);
      setFile(acceptedFiles.map((file: File) => Object.assign(file))[0]);
      if (onUploadFile) {
        onUploadFile(acceptedFiles[0]); //upload only one file
      }
    },
  });

  console.log("filefilefilefile", file);

  const imgSrc = "";
  // typeof file === "object"
  //   ? URL.createObjectURL(file as any)
  //   : `${IMAGE_BASE_URL}/${file}`;

  const getImgSrc = () => {
    try {
      return typeof file === "object"
        ? URL.createObjectURL(file as any)
        : `${IMAGE_BASE_URL}/${file}`;
    } catch (error) {
      return "";
    }
  };

  const img = file && (
    <img
      key={typeof file === "string" ? file : file?.name}
      alt={typeof file === "string" ? file : file?.name}
      src={getImgSrc()}
      style={{
        height: "100%",
        objectFit: "contain",
      }}
    />
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          fontSize: "16px",
          color: "#908f8f",
          marginBottom: "4px",
        }}
      >
        {label}
      </Box>
      <Box
        {...getRootProps({ className: "dropzone" })}
        sx={{
          width: size,
          height: size,
          borderRadius: isRounded ? "50%" : "5px",
          border: "3px dashed #ccc",
          userSelect: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#ccc",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            borderColor: "#908f8f",
            color: "#908f8f",
          },
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            position: "absolute",
            zIndex: 0,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <UserIcon icon="ic:baseline-add" fontSize={60} />
        </Box>

        <Box
          sx={{
            widows: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {file ? img : null}
          <img
            src={demoImg ?? defaultImage}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              aspectRatio: "1/1",
              borderRadius: "50%",
            }}
          />
        </Box>
        {(file || demoImg) && (
          <Box
            sx={{
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
              height: "30px",
              width: "100%",
              textAlign: "center",
              lineHeight: "30px",
              backgroundColor: "#00000056",
              color: "#fff",
            }}
          >
            Sửa
          </Box>
        )}
      </Box>

      {/* <Box
        sx={{
          ml: 5,
        }}
      >
        <Typography variant="body2">
          · Recommended image dimensions: width 300px, height 300px
        </Typography>
        <Typography variant="body2">· Maximum file size: 2.0MB</Typography>
        <Typography variant="body2">
          · Image format accepted: JPG,JPEG,PNG
        </Typography>
      </Box> */}
    </Box>
  );
};

export default SingleImageUploader;
