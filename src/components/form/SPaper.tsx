import { SxProps, Theme } from "@mui/material";
import Card from "@mui/material/Card";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const SPaper = ({ children, sx, ...rest }: Props) => {
  return (
    <Card
      sx={{
        py: 4,
        px: 6,

        ...sx,
      }}
    >
      {children}
    </Card>
  );
};

export default SPaper;
