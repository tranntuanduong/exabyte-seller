import { useMemo } from "react";
import { Order, OrderItem } from "src/types/order";
import { Warehouse } from "src/types/warehouse";

interface Props {
  orderDetails?: Order;
  warehouseSelected?: Warehouse;
}

const useCheckWarehouseEnable = ({
  orderDetails,
  warehouseSelected,
}: Props) => {
  const checkProductExistInWarehouse = (
    orderItem: OrderItem,
    warehouseDetails?: Warehouse
  ) => {
    const warehouseOption = warehouseDetails?.warehouseOptions?.find(
      (item) =>
        item.productId == orderItem?.product?.id &&
        item.productOptionId == orderItem?.optionId
    );

    if (orderItem?.optionId) {
      if (!warehouseOption?.optionStock) return false;
      return warehouseOption.optionStock > 0;
    } else {
      if (!warehouseOption?.productStock) return false;

      return warehouseOption.productStock > 0;
    }
  };

  const isAllProductExistInWarehouse = useMemo(() => {
    if (!warehouseSelected) return true;
    return orderDetails?.orderItems?.every((item) =>
      checkProductExistInWarehouse(item, warehouseSelected)
    );
  }, [orderDetails, warehouseSelected]);

  const checkWarehouseDisable = (warehouse: Warehouse, orderItem?: any) => {
    // if (orderDetails?.orderItems?.length !== 1) return false;

    if (orderItem) {
      return !checkProductExistInWarehouse(orderItem, warehouse);
    } else {
      return orderDetails?.orderItems?.every(
        (item) => !checkProductExistInWarehouse(item, warehouse)
      );
    }
  };

  return {
    checkProductExistInWarehouse,
    checkWarehouseDisable,
    isAllProductExistInWarehouse,
  };
};

export default useCheckWarehouseEnable;
