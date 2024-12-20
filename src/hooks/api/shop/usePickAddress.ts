import { useCallback, useEffect, useMemo, useState } from "react";
import { listDiaChinh } from "src/constants/diachinh";
import { listDiaChinhGHTQ } from "src/constants/diachinhGHTQ";
import { IS_AFFILIATE } from "src/constants/env";

export const usePickAddress = () => {
  const _listDiaChinh: any = IS_AFFILIATE ? listDiaChinh : listDiaChinhGHTQ;

  // set detail address
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [wardId, setWardId] = useState("");

  // listdata
  const [listData, setListData] = useState<any[]>([]);

  // get list data
  useEffect(() => {
    setListData(_listDiaChinh);
  }, []);

  const listProvince = useMemo(() => {
    return listData.filter((item) => item.capDiaChinh === "T");
  }, [listData]);

  const listDistrict = useMemo(() => {
    if (!provinceId) {
      return [];
    }
    return listData.filter((item) => item.diaChinhChaId === provinceId);
  }, [listData, listProvince, provinceId]);

  const listWard = useMemo(() => {
    if (!districtId) {
      return [];
    }
    return listData.filter((item) => item.diaChinhChaId === districtId);
  }, [listData, listDistrict, districtId]);

  // handle pick address
  const handlePickProvince = useCallback(
    (provinceId: string) => {
      console.log("provinceId", provinceId);
      setProvinceId(provinceId);

      setDistrictId("");

      setWardId("");

      // TODO: check lieu provinceId co ton tai hay khong
      if (!listProvince.some((item) => item.id === provinceId)) return;
    },
    [listProvince]
  );

  const handlePickDistrict = useCallback(
    (districtId: string) => {
      console.log("districtId", districtId);

      setDistrictId(districtId);
      setWardId("");

      // TODO: check lieu districtId co ton tai hay khong
      if (!listDistrict.some((item) => item.id === districtId)) return;
    },
    [listDistrict]
  );

  const handlePickWard = useCallback(
    (wardId: string) => {
      setWardId(wardId);
    },
    [listWard]
  );

  const getOptionById = useCallback(
    (id?: string) => {
      const option = _listDiaChinh.find((option: any) => option.id === id);
      if (option) return option;

      return {
        ten: id,
      };
    },
    [_listDiaChinh]
  );

  return {
    provinceId,
    districtId,
    wardId,
    listProvince,
    listDistrict,
    listWard,
    handlePickProvince,
    handlePickDistrict,
    handlePickWard,
    getOptionById,
  };
};
