import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const StyledFieldWrap = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  column-gap: 20px;
  background-color: #f5f5f5;
  width: 100%;
  padding: 15px;

  & + & {
    margin-top: 20px;
  }
`;

export const StyledFieldItem = styled(Box)`
  width: 100%;
  display: flex;
  column-gap: 10px;
  margin-top: 16px;
`;
