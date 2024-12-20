import { Box, Pagination } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import useTabList from 'src/hooks/useTabList';
import ProductList from './ProductList';
import { Product } from 'src/types/product';
import useDeleteShopProduct from 'src/hooks/api/shop/useDeleteShopProduct';
import { useRouter } from 'next/router';
import useFetchProduct from 'src/hooks/api/shop/useFetchProduct';
import { useAuth } from 'src/hooks/useAuth';
import Stack from "@mui/material/Stack";
import styled from "@emotion/styled";

interface Props {
  // products: Product[];
  // onDeleteSuccess: () => void
  // onChangeTab: (value: string) => void
  filter: any
  countStatus: any
}
const ProductViolate = ({ filter, countStatus }: Props) => {
  const [newpage, setNewPage] = useState(1);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setNewPage(value);
    fetchProduct({
      status: tabValue,
      page: value,
    });
  };
  const tabs = [
    {
      label: `Đã tạm khóa (${countStatus?.UPDATE})`,
      value: "UPDATE",
    },
    {
      label: `Đã xóa bởi GHTQ (${countStatus?.BANNED})`,
      value: "BANNED",
    },
  ]
  const { TabList, TabContext, TabPanel, tabValue } = useTabList({
    tabs
  });

  const [{ products, count }, fetchProduct] = useFetchProduct({});

  const handleDeleteSuccess = () => {
  };

  useEffect(() => {
    fetchProduct({
      ...filter,
      status: tabValue,

    });
  }, [tabValue, filter])
  return (
    <Box>
      <TabContext value={tabValue}>
        <TabList />
        <TabPanel value="UPDATE">

          <ProductList
            fetchProduct={fetchProduct}
            products={products}
            onDeleteSuccess={handleDeleteSuccess}
            
          />
        </TabPanel>
        <TabPanel value="BANNED" >
          <ProductList
            fetchProduct={fetchProduct}
            products={products}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </TabPanel>
      </TabContext>
      <StyledTableWrap>
        <Stack>
          <Pagination
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
            count={Math.ceil(count / 5)}
            page={newpage}
            onChange={handleChange}
          />
        </Stack>
      </StyledTableWrap>
    </Box>
  )
}

export default ProductViolate
const StyledTableWrap = styled(Box)`
  margin-bottom: 30px;
`;
