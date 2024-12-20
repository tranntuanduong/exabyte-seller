import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import React from "react";
import { IoIosHelpCircleOutline } from "react-icons/io";

interface IGeneralInformationProps {
  number: number;
  title: string;
  colorBorder: string;
  type?: "default" | "price";
}

const GeneralInformation = ({
  title,
  number,
  colorBorder,
  type = "default",
}: IGeneralInformationProps) => {
  const numberCurrency = number.toLocaleString("vi");
  return (
    <InforStyle
      style={{
        borderTop: `4px solid ${colorBorder}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          marginBottom: "15px",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 17,
          }}
        >
          {title}
        </Typography>
        <IoIosHelpCircleOutline
          style={{
            color: "rgba(0,0,0,0.3)",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          gap: "5px",
        }}
      >
        {type === "price" && (
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 20,
              marginBottom: 0.5,
            }}
          >
            đ
          </Typography>
        )}
        <Typography variant="h4">{numberCurrency}</Typography>
      </Box>
    </InforStyle>
  );
};

export default GeneralInformation;

const InforStyle = styled.div`
  padding: 10px 14px;
  min-width: 250px;
  border: 1px solid #ccc;
  width: fit-content;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`;
