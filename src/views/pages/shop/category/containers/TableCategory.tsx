import {
  Box,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useEffect, useState } from "react";
import ControlledSwitches from "src/pages/shop/settings/BoxSettings";
import { DataCategory } from "src/types/shop.type";
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineEye,
  AiOutlinePlus,
} from "react-icons/ai";
import PopupEditCategory from "./PopupEditCategory";
import { useRouter } from "next/router";
import PopupAddProductCategory from "./PopupAddProductCategory";
import useDeleteShopCategory from "src/hooks/api/shop/useDeleteShopCategory";
import useFetchShopCategory from "src/hooks/api/shop/useFetchShopCategory";
import useChangeStatusShopCategory from "src/hooks/api/shop/useChangeStatusShopCategory";
import PopupCancelDeleteCategory from "./PopupCancelDeleteCategory";

interface TableCategoryProps {
  fetchShopCategory?: () => void;
  dataCategory: DataCategory[];
}

const TableCategory = ({
  fetchShopCategory,
  dataCategory,
}: TableCategoryProps) => {
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setChecked(event.target.checked);
  // };

  const router = useRouter();

  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalAddProduct, setOpenModalAddProduct] = useState(false);
  const [idCategory, setIdCategory] = useState<number>();
  const [valueEdit, setValueEdit] = useState<string>();
  const [openDialogDeleteCategory, setOpenDialogDeleteCategory] =
    useState(false);
  const [deleteSelected, setDeleteSelected] = useState<any>();

  const [{ response }, handleDeleteShopCategory] = useDeleteShopCategory({
    onSuccess: fetchShopCategory,
  });
  console.log("mmm", response);

  const [{}, handleChangeStatusCategory] = useChangeStatusShopCategory();
  const handleDeleteCate = async (id: number) => {
    await handleDeleteShopCategory(id);
  };

  const handleUpdateStatusCategory = async (id: number) => {
    await handleChangeStatusCategory(id);
    fetchShopCategory && fetchShopCategory();
  };
  const handleDeleteCategory = async (id: number) => {
    setOpenDialogDeleteCategory(false);
    await handleDeleteShopCategory(id);
  };

  // useEffect(() => {
  //   if (fetchShopCategory) {
  //     fetchShopCategory();
  //   }
  // }, [response, openModalEdit, openModalAddProduct]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell onKeyDown={(e) => e.target.addEventListener}>
                Tên danh mục
              </TableCell>
              <TableCell align="center">Sản phẩm</TableCell>
              <TableCell align="center">Bật/Tắt</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataCategory?.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.products.length}</TableCell>
                <TableCell align="center">
                  <Box>
                    <Switch
                      checked={row.status === "ON" ? true : false}
                      onChange={() => handleUpdateStatusCategory(row.id)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      columnGap: "20px",
                    }}
                  >
                    <AiOutlineEye
                      onClick={() => router.push(`/shop/category/${row.id}`)}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                    />
                    <AiOutlinePlus
                      onClick={() => {
                        setIdCategory(row.id);
                        setOpenModalAddProduct(true);
                      }}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                    />
                    <AiFillEdit
                      onClick={() => {
                        setIdCategory(row.id);
                        setValueEdit(row.name);
                        setOpenModalEdit(true);
                      }}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                    />
                    <AiFillDelete
                      // onClick={() => handleDeleteCate(row.id)}
                      onClick={() => {
                        setDeleteSelected(row),
                          setOpenDialogDeleteCategory(true);
                      }}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PopupEditCategory
        idCategory={idCategory ?? 0}
        value={valueEdit ?? ""}
        open={openModalEdit}
        handleClose={() => setOpenModalEdit(false)}
        onSuccess={fetchShopCategory}
      />
      <PopupAddProductCategory
        idCategory={idCategory ?? 0}
        open={openModalAddProduct}
        handleClose={() => setOpenModalAddProduct(false)}
        onSuccess={fetchShopCategory}
      />
      <PopupCancelDeleteCategory
        openDialogDeleteCategory={openDialogDeleteCategory}
        setOpenDialogDeleteCategory={setOpenDialogDeleteCategory}
        deleteSelected={deleteSelected}
        handleDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
};

export default TableCategory;
