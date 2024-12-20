import { Button, Card, CardContent, Typography } from "@mui/material";
import ListCategory from "src/views/pages/shop/category/ListCategory";

const CategoryPage = () => {
  return (
    <Card>
      <CardContent>
        <ListCategory />
      </CardContent>
    </Card>
  );
};

export default CategoryPage;
