import { Box, Grid } from "@mui/material";
import { styled } from "@mui/system";

const Footer = () => {
  return (
    <StyledFooter>
      <StyledContainer>
        <Grid
          container
          sx={{
            py: 10,
            px: 2,
          }}
          columnGap="60px"
        >
          <Grid item xs={3}>
            <div className="common">
              {/* <div className="ecommerce">
                <img src="/images/logo.svg" alt="" className="logo" />
                <div className="ecommerce-name">GHTQ</div>
              </div> */}

              <div className="hotline">
                <div className="icon-wrap">
                  <img
                    src="/images/icons/hotline.svg"
                    alt=""
                    className="hotline-icon"
                  />
                </div>
                <div className="hotline-info">
                  <div className="desc">Hotline free 24/24</div>
                  <div className="number">1800-999-2991</div>
                </div>
              </div>

              <div className="text">
                Địa chỉ: Số xxx Lê Văn Thiêm, Thanh Xuân Trung, Thanh Xuân, Hà
                Nội
              </div>
              <div className="text">Email: abc@gmail.com</div>
            </div>
          </Grid>

          <Grid xs={1}>
            <div className="section-name">Information</div>
            <div className="text text-hover">About Us</div>
            <div className="text text-hover">Contact us</div>
            <div className="text text-hover">Privacy Policy</div>
            <div className="text text-hover">Terms & Condition</div>
            <div className="text text-hover">Checkout</div>
            <div className="text text-hover">Faq</div>
          </Grid>
          <Grid xs={1}>
            <div className="section-name">Catagories</div>
            <div className="text text-hover">About Us</div>
            <div className="text text-hover">Contact us</div>
            <div className="text text-hover">Privacy Policy</div>
            <div className="text text-hover">Terms & Condition</div>
            <div className="text text-hover">Checkout</div>
            <div className="text text-hover">Faq</div>
          </Grid>
          <Grid xs={1}>
            <div className="section-name">Brands</div>
            <div className="text text-hover">About Us</div>
            <div className="text text-hover">Contact us</div>
            <div className="text text-hover">Privacy Policy</div>
            <div className="text text-hover">Terms & Condition</div>
            <div className="text text-hover">Checkout</div>
            <div className="text text-hover">Faq</div>
          </Grid>
          <Grid xs={3}>
            <div className="section-name">Sign Up Newsletter</div>
            <div className="text text-hover">
              Get the lastest updates on new products àn upcoming sales
            </div>
          </Grid>
        </Grid>
      </StyledContainer>
    </StyledFooter>
  );
};

export default Footer;

const StyledFooter = styled("footer")`
  background: #252f3f;

  .ecommerce {
    display: flex;
    column-gap: 8px;
    align-items: center;

    .logo {
      width: 68px;
      height: 68px;
    }
  }

  .text {
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    opacity: 0.5;
    margin-top: 8px;
  }

  .text-hover:hover {
    opacity: 1;
    cursor: pointer;
  }

  .section-name {
    font-weight: 600;
    font-size: 16px;
    color: #fff;
    margin-bottom: 20px;
  }

  .hotline {
    margin-top: 10px;
    display: flex;
    align-items: center;
    column-gap: 15px;
  }

  .icon-wrap {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #2c3d58;
    border-radius: 50%;
  }

  .hotline-info {
    .number {
      font-size: 20px;
      color: #f6ee00;
      font-weight: bold;
    }
  }

  .hotline-icon {
    width: 20px;
  }
`;

const StyledContainer = styled(Box)`
  max-width: 1400px;
  margin: auto;
`;
