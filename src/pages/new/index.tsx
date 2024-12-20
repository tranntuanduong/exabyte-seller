import {
  Box,
  Button,
  Card,
  CardContent,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import DeleteDialog from "src/components/Popup/DeleteDialog";
import useDeleteNew from "src/hooks/api/new/useDeleteNew";
import useFetchNews from "src/hooks/api/new/useFetchNews";
import UserIcon from "src/layouts/components/UserIcon";

const NewsPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
  });

  const [newIdSelected, setNewIdSelected] = useState<number | null>(null);

  const { list, count, handleGetNews } = useFetchNews();
  const { handleDelete, loading: isDeleting } = useDeleteNew();

  useEffect(() => {
    handleGetNews(filters);
  }, [filters]);


  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 30, fontWeight: 700, color: "black" }}>
          Bản tin
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            my: 3,
          }}
        >
          <Link href={"/new/add"}>
            <Button variant="contained">Đăng bài</Button>
          </Link>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            mt: 6,
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ whiteSpace: "nowrap", textAlign: "center" }}>
                <TableCell align="left">Tiêu đề</TableCell>
                <TableCell align="left">Ngày đăng</TableCell>
                <TableCell align="left">Link</TableCell>
                <TableCell align="left">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list?.map((item: any) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    style={{
                      maxWidth: "230px",
                    }}
                  >
                    <Box
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        display: "-webkit-box",
                      }}
                    >
                      {item.title}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {dayjs(item.createdAt).format("DD/MM/YYYY hh:mm")}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "200px",
                    }}
                  >
                    <Box
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <a
                        href={`https://app.focalfossa.com/new/${item.slug}`}
                        target="_blank"
                      >
                        {`${item.slug}`}
                      </a>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          cursor: "pointer",
                        }}
                      >
                        <Link href={`/new/${item.slug}`}>
                          <AiFillEdit
                            size={"24px"}
                            className="text action-item"
                            color="gray"
                          ></AiFillEdit>
                        </Link>
                      </Box>
                      <Box
                        sx={{
                          cursor: "pointer",
                        }}
                        onClick={() => setNewIdSelected(item.id)}
                      >
                        <UserIcon icon="material-symbols:delete-outline" />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box>
          <Stack>
            <Pagination
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
              count={Math.ceil(count / 10)}
              page={filters.page}
              onChange={(e, value) => {
                setFilters((prev) => ({
                  ...prev,
                  page: +value,
                }));
              }}
            />
          </Stack>
        </Box>
      </CardContent>

      <DeleteDialog
        open={!!newIdSelected}
        handleClose={() => setNewIdSelected(null)}
        onConfirm={async () => {
          await handleDelete({
            param: `${newIdSelected}`,
          });
          handleGetNews(filters);
          setNewIdSelected(null);
        }}
        loading={isDeleting}
      />
    </Card>
  );
};

export default NewsPage;
