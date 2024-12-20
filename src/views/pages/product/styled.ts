import styled from "@emotion/styled";

export const StyledColumn = styled("div")`
  width: 100%;
  font-size: 14px;
  display: flex;
  column-gap: 40px;

  .checkbox {
    flex: 0 0 5px;
  }

  .name {
    flex: 0 0 300px;
  }

  .classify {
    flex: 0 0 160px;
  }

  .price {
    flex: 0 0 120px;
  }

  .inventory {
    flex: 0 0 120px;
  }

  .action {
    flex: 0 0 80px;
  }
`;
