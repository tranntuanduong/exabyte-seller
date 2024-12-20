import styled from "@emotion/styled";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import _ from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import CalendarWeek from "src/components/CalendarWeek";
import { DateType } from "src/types/generality";
import { useDate } from "src/utils/dateFilter";

interface DateFilterDate {
  title: string;
  value: DateType;
}

const dataFilterDate: DateFilterDate[] = [
  {
    title: "Hôm nay",
    value: `today`,
  },
  {
    title: "Hôm qua",
    value: "yesterday",
  },
  {
    title: "Trong 7 ngày qua",
    value: "7days",
  },
  {
    title: "Trong 30 ngày qua",
    value: `30days`,
  },
];

const calendarFilter: DateFilterDate[] = [
  {
    title: "Theo ngày",
    value: "day",
  },
  {
    title: "Theo tuần",
    value: "week",
  },
  {
    title: "Theo tháng",
    value: "month",
  },
  {
    title: "Theo năm",
    value: "year",
  },
];
const dataTypeOrder = [
  {
    title: "Tất cả",
    value: "ALL",
  },
  {
    title: "Chờ chuẩn bị",
    value: "PENDING",
  },
  {
    title: "Đơn hoàn thành",
    value: "COMPLETED",
  },
  {
    title: "Chờ lấy hàng",
    value: "PROCESSING",
  },
  {
    title: "Đang giao hàng",
    value: "SHIPPED",
  },
  {
    title: "Đơn hủy",
    value: "CANCELLED",
  },
];

const isDay = ["today", "yesterday", "day"];
const isWeek = ["7days", "week"];
const isMonth = ["30days", "month"];

interface IFilterGeneralityProps {
  fetchStatistic: (query: any) => Promise<void>;
}
const FilterGenerality = ({ fetchStatistic }: IFilterGeneralityProps) => {
  const { formattedRangeSeven, formattedRangeThirty, timeNow, yesterday } =
    useDate();
  console.log("alo123", {
    formattedRangeSeven,
    formattedRangeThirty,
    timeNow,
    yesterday,
  });
  const MapLabel: Record<DateType, string> = {
    today: "Hôm nay",
    day: "Theo ngày",
    week: "Theo tuần",
    "30days": "Trong 30 ngày qua",
    "7days": "Trong 7 ngày qua",
    year: "Theo năm",
    yesterday: "Hôm qua",
    month: "Theo tháng",
  };
  const router = useRouter();
  const [labelFilter, setLabelFilter] = useState<DateType>("today");
  const [temporaryLabel, setTemporaryLabel] = useState<DateType>("today");
  const [valueFilter, setValueFilter] = useState(new Date());
  console.log("valueX", dayjs(valueFilter).format("DD-MM-YYYY"));

  const [toggleFilterDate, setToggleFilterDate] = useState(false);
  const [typeOrder, setTypeOrder] = useState("ALL");
  const handleChangeTypeOrder = (event: SelectChangeEvent) => {
    setTypeOrder(event.target.value as string);
    router.push({
      query: {
        ...router.query,
        status_order: event.target.value,
      },
    });
  };
  const isCalendar = useMemo(() => {
    return calendarFilter.map((item) => item.value).includes(temporaryLabel);
  }, [temporaryLabel]);
  const renderLabel = (type: DateType) => {
    switch (type) {
      case "day":
        return `${dayjs(valueFilter).format("DD-MM-YYYY")}`;
      case "30days":
        return formattedRangeThirty;
      case "today":
        return `Tới ${timeNow} hôm nay`;
      case "yesterday":
        return yesterday;
      case "7days":
        return formattedRangeSeven;
      case "week":
        return `${dayjs(valueFilter)
          .startOf("week")
          .format("DD-MM-YYYY")} - ${dayjs(valueFilter)
          .endOf("week")
          .format("DD-MM-YYYY")}`;
      case "month":
        return `${dayjs(valueFilter).get("year")}.${
          dayjs(valueFilter).get("month") + 1
        }`;
      case "year":
        return `${dayjs(valueFilter).get("year")}`;
      default:
        break;
    }
  };
  const addQueryFilter = (type: DateType, dateCalendar?: any) => {
    console.log("valueX1", dayjs(dateCalendar).format("DD-MM-YYYY"));
    const typeDate = isDay.includes(type)
      ? "DAY"
      : isWeek.includes(type)
      ? "WEEK"
      : isMonth.includes(type)
      ? "MONTH"
      : "YEAR";
    console.log("typeDate", typeDate);
    const yesterdayDateBegin = dayjs(valueFilter)
      .subtract(1, "day")
      .startOf("day")
      .toISOString();
    const yesterdayDateEnd = dayjs(valueFilter)
      .subtract(1, "day")
      .endOf("day")
      .toISOString();
    const dateBeginning = dayjs(valueFilter).startOf("day").toISOString();
    // const dateBeginning = (date: any) => {
    //   return dayjs(date).startOf("day").format("DD-MM-YYYY HH:mm");
    // };
    const dateEnd = dayjs(valueFilter).endOf("day").toISOString();
    const dateFormat = dayjs(valueFilter).toISOString();
    const sevenDaysAgo = dayjs(valueFilter)
      .subtract(7, "day")
      .startOf("day")
      .toISOString();
    const thirtyDaysAgo = dayjs(valueFilter)
      .subtract(30, "day")
      .startOf("day")
      .toISOString();
    const startWeek = dayjs(dateCalendar ? dateCalendar : valueFilter)
      .startOf("week")
      .toISOString();
    const endWeek = dayjs(dateCalendar ? dateCalendar : valueFilter)
      .endOf("week")
      .toISOString();
    const startMonth = dayjs(dateCalendar ? dateCalendar : valueFilter)
      .startOf("month")
      .toISOString();
    const endMonth = dayjs(dateCalendar ? dateCalendar : valueFilter)
      .endOf("month")
      .toISOString();

    const startYear = dayjs(dateCalendar ? dateCalendar : valueFilter)
      .startOf("year")
      .toISOString();
    const endYear = dayjs(dateCalendar ? dateCalendar : valueFilter)
      .endOf("year")
      .toISOString();
    console.log("dateNpo", {
      dateBD: dayjs(dateCalendar ? dateCalendar : valueFilter)
        .startOf("week")
        .format("DD-MM-YYYY HH:mm"),
      dateEnd: dayjs(dateCalendar ? dateCalendar : valueFilter)
        .endOf("week")
        .format("DD-MM-YYYY HH:mm"),
    });
    let query = { ...router.query };
    switch (type) {
      case "today":
        query.date_from = dateBeginning;
        query.date_to = dateFormat;
        break;
      case "yesterday":
        query.date_from = yesterdayDateBegin;
        query.date_to = yesterdayDateEnd;
        break;
      case "7days":
        query.date_from = sevenDaysAgo;
        query.date_to = dateBeginning;
        break;
      case "30days":
        query.date_from = thirtyDaysAgo;
        query.date_to = dateBeginning;
        break;
      case "day":
        query.date_from = dateBeginning;
        query.date_to = dateEnd;
        break;
      case "week":
        query.date_from = startWeek;
        query.date_to = endWeek;
        break;
      case "month":
        query.date_from = startMonth;
        query.date_to = endMonth;
        break;
      case "year":
        query.date_from = startYear;
        query.date_to = endYear;
        break;
      default:
        break;
    }
    router.push({
      query: { ...query, date: typeDate },
    });
  };
  console.log("labek", router.query);
  const handleFilterDate = (dateSelect: typeof dataFilterDate[0]) => {
    console.log({ dateSelect });
    setLabelFilter(dateSelect.value);
    setToggleFilterDate(false);
    addQueryFilter(dateSelect.value);
  };
  const handleFilterCalendar = (date: any) => {
    setValueFilter(new Date(date));
    setLabelFilter(temporaryLabel);
    addQueryFilter(temporaryLabel, date);
  };
  useEffect(() => {
    if (!router.isReady) return;
    console.log("valueX", router.query.date);
    const dateBeginning = dayjs(valueFilter).startOf("day").toISOString();
    const dateFormat = dayjs(valueFilter).toISOString();
    if (_.isEmpty(router.query)) {
      router.push({
        query: {
          date_from: dateBeginning,
          date_to: dateFormat,
          date: "DAY",
          status_order: "ALL",
        },
      });
    }
    const newQuery = {
      date_from: new Date(router.query.date_from as string ?? Date.now()).toISOString(),
      date_to: new Date(router.query.date_to as string ?? Date.now()).toISOString(),
      date: router.query.date,
      status_order: router.query.status_order,
    };
    if (!newQuery.status_order) return;
    fetchStatistic(newQuery);
  }, [router.query, router.isReady]);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Typography>Khung Thời Gian</Typography>
        {toggleFilterDate && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1,
            }}
            onClick={() => setToggleFilterDate(false)}
          />
        )}
        <FilterBox onClick={() => setToggleFilterDate(!toggleFilterDate)}>
          <div className="input-date">
            <div className="label-filter">
              <HiOutlineCalendarDays />
              <span>{MapLabel[labelFilter]} : </span>
            </div>
            <span>{renderLabel(labelFilter)} </span>
          </div>
          {toggleFilterDate && (
            <div className="menu-filter">
              <ul className="list-filter">
                {dataFilterDate.map((item, idx) => (
                  <li
                    key={idx}
                    onMouseEnter={() => setTemporaryLabel(item.value)}
                    className={`item-filter ${
                      item.value === labelFilter && "active-filter"
                    }`}
                    onClick={() => {
                      handleFilterDate(item);
                    }}
                  >
                    <span className="label-item-filter">{item.title}</span>
                    <span className="value-item-filter">
                      {renderLabel(item.value)}
                    </span>
                  </li>
                ))}
                <hr className="wall" />
                {calendarFilter.map((item, idx) => (
                  <li
                    key={idx}
                    className={`item-filter ${
                      item.value === labelFilter && "active-filter"
                    }`}
                    onMouseEnter={() => setTemporaryLabel(item.value)}
                  >
                    <span className="label-item-filter label-calendar-filter">
                      {item.title}
                    </span>
                    <MdOutlineKeyboardArrowRight />
                  </li>
                ))}
              </ul>
              {isCalendar && temporaryLabel === "year" && (
                <DateCalendar
                  defaultValue={dayjs(valueFilter)}
                  views={["year"]}
                  onChange={(date: any) => handleFilterCalendar(date)}
                  className="calendar"
                />
              )}

              {isCalendar &&
                temporaryLabel !== "year" &&
                temporaryLabel !== "week" && (
                  <DateCalendar
                    defaultValue={dayjs(valueFilter)}
                    views={[temporaryLabel === "day" ? "day" : "month"]}
                    onChange={(date: any) => handleFilterCalendar(date)}
                    className="calendar"
                  />
                )}

              {isCalendar && temporaryLabel === "week" && (
                <CalendarWeek
                  className="calendar"
                  value={
                    isCalendar && temporaryLabel === "week"
                      ? valueFilter
                      : new Date()
                  }
                  setValue={setValueFilter}
                  onChange={(value: any) => addQueryFilter("week", value)}
                  setSelect={setLabelFilter}
                />
              )}
            </div>
          )}
        </FilterBox>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Typography>Loại đơn hàng</Typography>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={typeOrder}
          onChange={handleChangeTypeOrder}
          size="small"
          sx={{
            height: "32px",
            fontSize: "14px",
          }}
        >
          {dataTypeOrder.map((item, idx) => (
            <MenuItem key={idx} value={item.value}>
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};
export default FilterGenerality;
const FilterBox = styled.div`
  position: relative;
  z-index: 100;
  .input-date {
    border-color: #b7b7b7;
    display: flex;
    align-items: center;
    padding: 7px 12px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    color: #333;
    font-size: 14px;
    line-height: 16px;
    background-color: #fff;
    width: fit-content;
    gap: 3px;
  }
  .label-filter {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 500;
  }
  .menu-filter {
    position: absolute;
    will-change: top, left;
    height: fit-content;
    background-color: #fff;
    top: 36px;
    border-radius: 4px;
    z-index: 100;
    color: #333;
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1), 0 8px 16px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e5e5e5;
    width: 480px;
    display: flex;
    align-items: start;
  }
  .list-filter {
    min-width: 160px;
    padding: 8px 0;
    margin: 0;
    font-size: 14px;
    list-style: none;
    border-right: 1px solid #eee;
  }
  .item-filter {
    position: relative;
    height: 32px;
    padding: 0 16px;
    line-height: 32px;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    :hover {
      color: #ee4d2d;
      background-color: #f6f6f6;
      .value-item-filter {
        background-color: #f6f6f6;
      }
    }
  }
  .active-filter {
    color: #ee4d2d;
    .value-item-filter {
      opacity: 1;
    }
  }
  .item-filter:hover .value-item-filter {
    background-color: #f6f6f6;
    opacity: 1;
    color: #ee4d2d;
  }
  .label-calendar-filter {
    width: 100px;
    display: inline-block;
  }
  .value-item-filter {
    opacity: 0;
    position: absolute;
    left: 100%;
    width: 318px;
    padding-left: 16px;
    margin-left: 1px;
  }
  .calendar {
    padding-left: 16px;
    padding-right: 16px;
    margin-left: 1px;
    position: relative;
    background-color: #fff;
    z-index: 100;
    width: 100%;
  }
  .wall {
    border-top: 1px solid #ccc;
    margin: 19px 20px;
  }
`;
