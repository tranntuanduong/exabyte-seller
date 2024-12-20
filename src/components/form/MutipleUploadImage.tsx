// ** React Imports
import {
  Dispatch,
  Fragment,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

// ** MUI Imports
import Box from "@mui/material/Box";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { swapElement } from "src/utils/array";
import { IMAGE_BASE_URL } from "src/constants/aws";
import { getImageCheck } from "src/utils/image";
import { SxProps } from "@mui/material";
import { previousDay } from "date-fns";

interface FileProp {
  name: string;
  type: string;
  size: number;
}

export interface PreviewImgs {
  url: string;
  [key: string]: any;
}

export interface PreViewVideo {
  url: string;
  [key: string]: any;
}

interface Props {
  label?: string;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  setPreviewImgs?: Dispatch<SetStateAction<any[]>>;
  previewImgs?: PreviewImgs[];
  preViewVideo?: PreViewVideo[];
  setPreviewVideo?: Dispatch<SetStateAction<any[]>>;
  size?: number;
  isVideoInput?: boolean;
  className?: SxProps;
  required?: boolean;
}

const MutipleUploadImage = ({
  label,
  files,
  setFiles,
  previewImgs = [],
  preViewVideo = [],
  setPreviewVideo,
  setPreviewImgs,
  size = 10,
  required,
  isVideoInput = false,
  className = {},
}: Props) => {
  const [dragFileIndex, setDragFileIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const ERROR_MESSAGE: Record<string, string> = {
    "too-many-files": `Bạn chỉ có thể thêm tối đa ${size} ảnh`,
    "file-too-large": "Kích thước file tối đa là 2MB",
  };
  const ERROR_MESSAGE_VIDEO: Record<string, string> = {
    "too-many-files": "Bạn chỉ có thể thêm tối đa 1 video",
    "file-too-large": "Kích thước file tối đa là 5MB",
  };

  console.log("previewImgs", previewImgs);
  // ** State

  const MAX_SIZE = isVideoInput ? 5 : 2;

  const videoPreview = useMemo(() => {
    if (!isVideoInput || (files.length === 0 && !previewImgs[0]?.url))
      return <></>;

    const video = previewImgs[0];

    console.log("video", video);

    const objectUrl = files[0]
      ? URL?.createObjectURL?.(files[0])
      : `${IMAGE_BASE_URL}/${video.url}`;

    return (
      <video width="90" height="90" controls>
        <source src={objectUrl} />
        Your browser does not support HTML5 video.
      </video>
    );
  }, [files, isVideoInput, previewImgs]);

  const MAX_FILE = useMemo(() => {
    return size - previewImgs.length;
  }, [previewImgs]);

  const customeValidateSize = (file: File) => {
    if (file.size > 1024 * 1024 * MAX_SIZE) {
      return {
        code: "file-too-large",
        message: `Kích thước file tối đa là ${MAX_SIZE}MB`,
      };
    }
    return null;
  };

  console.log("render");

  // ** Hooks
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      ...(isVideoInput
        ? {
            "video/mp4": [".mp4", ".MP4"],
          }
        : {
            "image/png": [".png", ".jpeg", ".jpg"],
          }),
    },
    onDrop: (acceptedFiles: File[]) => {
      let newFiles: File[] = [];
      if (isVideoInput) {
        newFiles = [...acceptedFiles.map((file) => file)];
      } else {
        newFiles = [...files, ...acceptedFiles.map((file) => file)];
      }

      console.log("newFiles", newFiles, MAX_FILE);

      if (newFiles.length > MAX_FILE) {
        if (isVideoInput) {
          toast.error("Bạn chỉ có thể thêm tối đa 1 video");
          return;
        }
        toast.error(`Bạn chỉ có thể thêm tối đa ${size} ảnh`);
        return;
      }
      setFiles(newFiles);
    },
    maxFiles: size,
    validator: customeValidateSize,
  });

  //error
  {
    isVideoInput
      ? useEffect(() => {
          if (fileRejections.length === 0) return;
          const error = ERROR_MESSAGE_VIDEO[fileRejections[0].errors[0].code];
          toast.error(error);
        }, [fileRejections])
      : useEffect(() => {
          if (fileRejections.length === 0) return;
          const error = ERROR_MESSAGE[fileRejections[0].errors[0].code];
          toast.error(error);
        }, [fileRejections]);
  }

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          style={{
            width: "100%",
            objectFit: "contain",
            aspectRatio: "1/1",
            margin: "auto",
          }}
          alt={file.name}
          src={URL.createObjectURL(file as any)}
        />
      );
    } else {
      return <Icon icon="mdi:file-document-outline" />;
    }
  };

  const handleRemoveFile = (index: number) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter(
      (_, fileIndex: number) => fileIndex !== index
    );

    setFiles([...filtered]);
  };

  const handleRemovePreviewImg = (id: number) => {
    if (!setPreviewImgs) return;
    const filtered = previewImgs.filter((_img) => _img.id !== id);

    setPreviewImgs([...filtered]);
  };

  const handleDragStart = (index: number) => () => {
    setDragFileIndex(index);
  };
  const handleDragOver = (index: number) => () => {
    setDragOverIndex(index);
  };
  const handleDrop = () => {
    const newFiles = swapElement(files, dragFileIndex!, dragOverIndex!);
    setFiles(newFiles);
  };
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const fileList = files?.map((file: FileProp, index) => {
    return (
      <Box
        component={"div"}
        key={index}
        onDragStart={handleDragStart(index)}
        onDragOver={handleDragOver(index)}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        sx={{
          border: "1px solid #e0e0e0",
          width: "90px",
          height: "90px",
          position: "relative",
          overflow: "hidden",
          ".close-btn": {
            display: "none",
          },

          "&:hover": {
            "& .close-btn": {
              display: "flex",
            },
          },
        }}
      >
        <div className="file-details">
          <div className="file-preview">{renderFilePreview(file)}</div>
        </div>
        <Box
          className="close-btn"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "25px",
            height: "25px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#fff",
            cursor: "pointer",
          }}
          onClick={() => handleRemoveFile(index)}
        >
          <Icon icon="mdi:close" fontSize={20} color="#000" />
        </Box>
      </Box>
    );
  });

  const savedImgsView = useMemo(() => {
    return previewImgs.map((img: PreviewImgs, index: number) => (
      <Fragment>
        <Box
          component={"div"}
          key={img.id}
          onDragStart={handleDragStart(index)}
          onDragOver={handleDragOver(index)}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          sx={{
            border: "1px solid #e0e0e0",
            width: "90px",
            height: "90px",
            position: "relative",
            overflow: "hidden",
            ".close-btn": {
              display: "none",
            },
            "&:hover": {
              "& .close-btn": {
                display: "flex",
              },
            },
          }}
        >
          <div className="file-details">
            <div className="file-preview">
              <img
                style={{
                  width: "100%",
                  objectFit: "contain",
                  aspectRatio: "1/1",
                  margin: "auto",
                }}
                src={getImageCheck(img.url)}
                // src={`${IMAGE_BASE_URL}${img.url}`}
              />
            </div>
          </div>
          <Box
            className="close-btn"
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "25px",
              height: "25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#fff",
              cursor: "pointer",
            }}
            onClick={() => handleRemovePreviewImg(img.id)}
          >
            <Icon icon="mdi:close" fontSize={20} color="#000" />
          </Box>
        </Box>
      </Fragment>
    ));
  }, [previewImgs]);

  const isShowInput = useMemo(() => {
    if (!isVideoInput) {
      return files.length < size;
    }

    console.log("files", previewImgs);

    if (previewImgs.length === 0 && files.length >= size) return false;

    if (previewImgs.length > 0) {
      return false;
    }

    return true;
  }, [files, previewImgs, isVideoInput]);

  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "20px",
        ...className,
      }}
    >
      <Box
        sx={{
          mb: 2,
          width: "200px",
          textAlign: "right",
        }}
        id="label"
      >
        {label}
        {required && (
          <Box
            component="span"
            sx={{
              color: "red",
              opacity: "0.7",
            }}
          >
            *
          </Box>
        )}
      </Box>
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: "10px",
            rowGap: "10px",
            position: "relative",
          }}
        >
          {!isVideoInput && (
            <>
              {savedImgsView?.length > 0 && (
                <Fragment>{savedImgsView}</Fragment>
              )}
              {files?.length > 0 && <Fragment>{fileList}</Fragment>}
            </>
          )}

          {isVideoInput && (files.length > 0 || previewImgs[0]?.url) ? (
            <Box
              onClick={() => setFiles([])}
              sx={{
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translateX(-50%)",
                height: "30px",
                width: "90%",
                fontSize: "13px",
                textAlign: "center",
                lineHeight: "30px",
                backgroundColor: "#00000056",
                color: "#fff",
                cursor: "pointer",
                zIndex: 3,
              }}
            >
              Xóa
            </Box>
          ) : (
            ""
          )}

          {isShowInput && (
            <Box
              {...getRootProps({ className: "dropzone" })}
              sx={{
                borderRadius: "5px",
                border: "2px dashed #ccc",
                userSelect: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#ccc",
                position: "relative",
                overflow: "hidden",
                width: "90px",
                height: "90px",
                "&:hover": {
                  borderColor: "#908f8f",
                  color: "#908f8f",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  zIndex: 0,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    color: "#908f8f",
                    fontSize: "10px",
                  }}
                >
                  {isVideoInput ? (
                    <>Thêm video (0/1)</>
                  ) : (
                    <>
                      Thêm hình ảnh ({(files?.length ?? 0) + previewImgs.length}
                      /{size})
                    </>
                  )}
                </Box>
              </Box>
              <input {...getInputProps()} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: ["column", "column", "row"],
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: ["center", "center", "inherit"],
                  }}
                ></Box>
              </Box>
            </Box>
          )}
          {videoPreview}
        </Box>
      </Box>
    </Box>
  );
};

export default MutipleUploadImage;
