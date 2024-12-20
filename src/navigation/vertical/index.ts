// ** Type import
import { VerticalNavItemsType } from "src/@core/layouts/types";
import { IS_AFFILIATE } from "src/constants/env";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Tổng quan",
      path: "/home",
      icon: "mdi:home-outline",
    },
    {
      title: "Quản lý sản phẩm",
      icon: "material-symbols:shopping-bag-outline",
      children: [
        {
          path: "/shop/product",
          title: "Danh sách sản phẩm",
          // icon: "mdi:shield-outline",
        },
        {
          path: "/shop/product/add",
          title: "Thêm sản phẩm",
          // icon: "mdi:shield-outline",
        },
        ...(!IS_AFFILIATE
          ? [
              {
                path: "/shop/connect-app",
                title: "Kết nối app",
              },
            ]
          : []),
      ],
    },
    {
      title: "Quản lý đơn hàng",
      icon: "mdi:calendar-text-outline",
      children: [
        {
          path: "/order",
          title: "Danh sách đơn hàng",
          // icon: "mdi:shield-outline",
        },
        {
          path: "/order?type=canceled",
          title: "Đơn hủy",
          // icon: "mdi:shield-outline",
        },
        // {
        //   path: "/order/generality",
        //   title: "Tổng quan",
        // },
      ],
    },
    {
      title: "Quản lý shop",
      icon: "mdi:store",
      children: [
        {
          path: "/shop/profile",
          title: "Hồ sơ shop",
          // icon: "mdi:shield-outline",
        },

        ...(!IS_AFFILIATE
          ? [
              {
                path: "/shop/theme",
                title: "Trang trí shop",
                // icon: "mdi:shield-outline",
              },
            ]
          : []),
        ...(IS_AFFILIATE
          ? [
              {
                path: "/shop/affiliate",
                title: "Người giới thiệu",
                // icon: "mdi:shield-outline",
              },
            ]
          : []),
        {
          path: "/shop/category",
          title: "Danh mục shop",
          // icon: "mdi:shield-outline",
        },
      ],
    },
    // {
    //   title: "Thiết lập shop",
    //   icon: "mdi:cog-outline",
    //   children: [
    //     {
    //       path: "/shop/address",
    //       title: "Địa chỉ",
    //       // icon: "mdi:shield-outline",
    //     },
    //     {
    //       path: "/shop/settings",
    //       title: "Thiết lập shop",
    //       // icon: "mdi:shield-outline",
    //     },
    //   ],
    // },
    {
      path: "/shop/settings",
      title: "Thiết lập shop",
      icon: "mdi:cog-outline",
    },
    {
      title: "Quản lý kho hàng",
      icon: "mdi:warehouse",
      children: [
        {
          path: "/warehouse",
          title: "Danh sách kho hàng",
        },
      ],
    },
    {
      path: "/new",
      title: "Bản tin",
      icon: "mdi:newspaper-variant-multiple-outline",
    },
  ];
};

export default navigation;
