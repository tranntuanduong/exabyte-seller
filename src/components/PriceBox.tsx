import { Fragment } from "react";
import usePrice from "src/hooks/usePrice";

interface Props {
  price: number | string;
}

const PriceBox = ({price}: Props) => {
  const { price:displayPrice } = usePrice({
    amount: +price,
  });

  return <Fragment>{displayPrice}</Fragment>;
};

export default PriceBox;
