import { Box, styled } from "@mui/material";
import { ReactNode } from "react";
import Footer from "../Footer";

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <StyledAuthLayout>
      <div className="header">
        <StyledContainer>
          <div className="header-content">
            {/* <div className="left">
              <img src="/images/logo.svg" alt="" className="logo" />
              <div className="ecommerce-name">GHTQ</div>
              <div className="seller-channel">Kênh người bán</div>
            </div> */}

            <div className="right">
              <div className="helper">Bạn cần hỗ trợ?</div>
            </div>
          </div>
        </StyledContainer>
      </div>
      {children}

      <StyledContainer>
        <StyledEcommerceSell>
          {/* <div className="why">Tại sao nên bán hàng trên GHTQ ?</div> */}

          <div className="card-wrap">
            <div className="sell-card">
              <img src="/images/24h-support.svg" alt="" className="img" />
              <div className="card-title">Hỗ trợ 24/7</div>
              <div className="card-desc">
                Lorem ipsum is placeholder text common
              </div>
            </div>

            <div className="sell-card">
              <img src="/images/protect-shield.svg" alt="" className="img" />
              <div className="card-title">An toàn bảo mật</div>
              <div className="card-desc">
                Lorem ipsum is placeholder text common
              </div>
            </div>

            <div className="sell-card">
              <img src="/images/shopping-bag.svg" alt="" className="img" />
              <div className="card-title">Mua hàng nhanh hóng</div>
              <div className="card-desc">
                Lorem ipsum is placeholder text common
              </div>
            </div>
          </div>
        </StyledEcommerceSell>
      </StyledContainer>

      <Footer />
    </StyledAuthLayout>
  );
};

export default AuthLayout;

const StyledEcommerceSell = styled(Box)`
  display: flex;
  align-items: center;
  color: #333;
  margin-top: 130px;
  margin-bottom: 70px;
  column-gap: 20px;

  .why {
    font-weight: 500;
    font-size: 28px;
    max-width: 302px;
  }

  .card-wrap {
    display: flex;
    column-gap: 20px;
  }

  .sell-card {
    background: #ffffff;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.05);
    border-radius: 20px;
    padding: 20px 10px;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .card-title {
    font-weight: 500;
    font-size: 18px;
    line-height: 1.2;
    margin: 10px 0;
  }

  .card-desc {
  }
`;

const StyledAuthLayout = styled(Box)`
  color: #fff;
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header {
    height: 90px;
    background-color: ${({ theme }) => theme.palette.primary.main};
    display: flex;
    align-items: center;
  }

  .helper {
    font-weight: 500;
    font-size: 18px;
  }

  .seller-channel {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 24px;
    gap: 10px;

    width: 174px;
    height: 39px;

    background: #b8160d;
    border: 1px solid #fbed01;
    border-radius: 44px;

    flex: none;
    order: 2;
    flex-grow: 0;
    cursor: pointer;
    user-select: none;
  }

  .ecommerce-name {
    font-weight: 700;
    font-size: 32px;
    line-height: 39px;
  }

  .left {
    display: flex;
    align-items: center;
    column-gap: 25px;
  }

  .logo {
    width: 40px;
    height: 40px;
  }
`;

const StyledContainer = styled(Box)`
  max-width: 1088px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
`;
