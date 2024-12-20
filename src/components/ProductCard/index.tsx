import { Box, Grid, styled, Typography } from "@mui/material";
// import { Product } from "src/types/product";
import Image from "next/image";
import { StyledColumn } from "src/views/pages/product/styled";
import { useRouter } from "next/router";

interface Props {
  product: any;
}

const ProductCard = ({ product }: Props) => {
  const router = useRouter();

  console.log("product", product);

  const { classify1, classify2, classifyDetails } = product;

  return (
    <StyledCard>
      <StyledColumn>
        <div className="name">
          <div className="product">
            <img className="thumb" src={product?.images?.[0]?.url} alt="" />
            <div className="info-wrap">
              <Typography className="product-name" variant="body2">
                {product.name}
              </Typography>
              <div className="desc">{product.description}</div>
            </div>
          </div>
        </div>

        <div className="classify">
          {product?.options?.map((_option: any) => (
            <div key={_option.id} className="text">
              {_option.name}
            </div>
          ))}
        </div>

        <div className="price">
          {product?.options?.map((_option: any) => (
            <div key={_option.id} className="text">
              {parseFloat(_option.price).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </div>
          ))}
        </div>

        <div className="inventory">
          {product?.options?.map((_option: any) => (
            <div key={_option.id} className="text">
              {_option.stock}
            </div>
          ))}
        </div>

        <div className="action">
          <div className="text action-item">Xem</div>
          <div
            className="text action-item"
            onClick={() => router.push(`/product/${product._id}`)}
          >
            Cập nhật
          </div>
          <div className="text action-item">Ẩn</div>
        </div>
      </StyledColumn>
    </StyledCard>
  );
};

export default ProductCard;

const StyledCard = styled(Box)`
  width: 100%;
  padding: 10px 16px;

  .thumb {
    width: 56px;
    height: 56px;
    object-fit: cover;
  }

  .info-wrap {
    flex: 1;
  }

  .product {
    display: flex;
    column-gap: 10px;
  }

  .product-name,
  .desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-name {
    font-weight: bold;
    color: #333;
  }

  .desc {
    font-size: 13px;
    line-height: 1.3;
    color: #666;
  }

  .action {
    color: #2672dd;
  }

  .action-item {
    cursor: pointer;

    :hover {
      color: #0046a8;
    }
  }
`;
