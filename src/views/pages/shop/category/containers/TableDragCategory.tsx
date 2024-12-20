import {
  Box,
  Button,
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
import { DataCategory, DataOrderProps } from "src/types/shop.type";
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineEye,
  AiOutlinePlus,
} from "react-icons/ai";
import { MdOutlineDragIndicator } from "react-icons/md";
import PopupEditCategory from "./PopupEditCategory";
import { useRouter } from "next/router";
import PopupAddProductCategory from "./PopupAddProductCategory";
import useDeleteShopCategory from "src/hooks/api/shop/useDeleteShopCategory";
import useFetchShopCategory from "src/hooks/api/shop/useFetchShopCategory";
import useChangeStatusShopCategory from "src/hooks/api/shop/useChangeStatusShopCategory";
import useChangeOrderShopCategory from "src/hooks/api/shop/useChangeOrderShopCategory";
import useUpdateCategoryOrder from "src/hooks/api/category/useUpdateCategoryOrder";

interface TableDragCategoryProps {
  fetchShopCategory?: () => void;
  dataCategory: DataCategory[];
  onDragSuccess?: () => void;
}

const TableDragCategory = ({
  fetchShopCategory,
  dataCategory,
  onDragSuccess,
}: TableDragCategoryProps) => {
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setChecked(event.target.checked);
  // };

  const router = useRouter();

  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalAddProduct, setOpenModalAddProduct] = useState(false);
  const [idCategory, setIdCategory] = useState<number>();
  const [valueEdit, setValueEdit] = useState<string>();
  const [dataOrder, setDataOrder] = useState<DataCategory[]>([]);
  const [dragId, setDragId] = useState("");

  const [dataChangeOrder, setDataChangeOrder] = useState<
    DataOrderProps[] | any[]
  >();

  useEffect(() => {
    setDataOrder(dataCategory);
  }, [dataCategory]);

  const [{}, handleChangeStatusCategory] = useChangeStatusShopCategory();
  const [dataUpdate, setDataUpdate] = useState<any>();
  const [{}, handleChangeOrderCategory] = useChangeOrderShopCategory();
  const { data, loading, handleUpdateCategoryOrder } = useUpdateCategoryOrder({
    onSuccess: () => {
      setDataChangeOrder(data);
      onDragSuccess && onDragSuccess();
    },
  });
  const onDragEnd = (result: any) => {
    console.log("result", result);
    if (!result.destination) return;
    const items = Array.from(dataOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDataOrder(items);
    setDragId("");
    const dataDrag = items.map((item: any, index) => {
      return {
        id: item.id,
        order: index,
      };
    });

    setDataUpdate(dataDrag);
  };

  const handleUpdateStatusCategory = async (id: number) => {
    await handleChangeStatusCategory(id);
    fetchShopCategory && fetchShopCategory();
  };

  const handleChangeOrder = async () => {
    console.log("aaaaaaaaaaa");
    if (dataChangeOrder) {
      await handleChangeOrderCategory(dataChangeOrder);
    }
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
              <TableCell>Tên danh mục</TableCell>
              <TableCell align="center">Sản phẩm</TableCell>
              <TableCell align="center">Bật/Tắt</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={(e) => {
              setDragId(e.draggableId);
            }}
            // onDragUpdate={() => setDragId("")}
          >
            <Droppable droppableId="table">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {dataOrder?.map((row, index) => (
                    <Draggable
                      key={row.id}
                      draggableId={String(row.id)}
                      index={index}
                    >
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            ...(dragId === String(row.id) && {
                              display: "flex",
                              background: "#fff",
                            }),
                          }}
                        >
                          <TableCell
                            sx={{
                              flex: 1,
                            }}
                            component="th"
                            scope="row"
                          >
                            {row.name}
                          </TableCell>
                          <TableCell
                            sx={{
                              flex: 1,
                            }}
                            align="center"
                          >
                            {row.order}
                          </TableCell>
                          <TableCell
                            sx={{
                              flex: 1,
                            }}
                            align="center"
                          >
                            <Box>
                              <Switch
                                checked={row.status === "ON" ? true : false}
                                onChange={() =>
                                  handleUpdateStatusCategory(row.id)
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell
                            {...provided.dragHandleProps}
                            sx={{
                              flex: 1,
                            }}
                            align="center"
                          >
                            <MdOutlineDragIndicator />
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </TableContainer>
      <Button
        onClick={() => {
          if (dataUpdate) {
            handleUpdateCategoryOrder(dataUpdate);
          }
          if (!dataUpdate) {
            onDragSuccess && onDragSuccess();
          }
        }}
        variant="contained"
        sx={{
          marginBottom: "10px",
          float: "right",
        }}
      >
        Lưu
      </Button>
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
    </div>
  );
};

export default TableDragCategory;
