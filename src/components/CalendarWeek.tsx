import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { DateType } from "src/types/generality";

dayjs.extend(isBetweenPlugin);

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  dayIsBetween: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;
}

interface ICalendarWeekProps {
  className: string;
  value: Date;
  setValue: React.Dispatch<React.SetStateAction<Date | any>>;
  setSelect: React.Dispatch<React.SetStateAction<DateType>>;
  onChange: (value: any) => void;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "dayIsBetween" && prop !== "isFirstDay" && prop !== "isLastDay",
})<CustomPickerDayProps>(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(isLastDay && {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
})) as React.ComponentType<CustomPickerDayProps>;

function Day(props: PickersDayProps<Dayjs> & { selectedDay?: Dayjs | null }) {
  const { day, selectedDay, ...other } = props;

  if (selectedDay == null) {
    return <PickersDay day={day} {...other} />;
  }

  const start = selectedDay.startOf("week");
  const end = selectedDay.endOf("week");

  const dayIsBetween = day.isBetween(start, end, null, "[]");
  const isFirstDay = day.isSame(start, "day");
  const isLastDay = day.isSame(end, "day");

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={dayIsBetween ? { px: 2.5, mx: 0 } : {}}
      dayIsBetween={dayIsBetween}
      isFirstDay={isFirstDay}
      isLastDay={isLastDay}
    />
  );
}

export default function CalendarWeek({
  className,
  value,
  setValue,
  setSelect,
  onChange,
}: ICalendarWeekProps) {
  // const start = React.useMemo(() => {
  //   dayjs(dateSelect).startOf("week");
  // }, [dateSelect]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        className={className}
        value={dayjs(value)}
        onChange={(newValue) => {
          setValue(newValue);
          setSelect("week");
          onChange(newValue);
        }}
        slots={{ day: Day }}
        slotProps={{
          day: {
            selectedDay: dayjs(value),
          } as any,
        }}
      />
    </LocalizationProvider>
  );
}
