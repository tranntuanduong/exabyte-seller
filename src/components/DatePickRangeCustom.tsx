import styled from '@emotion/styled';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import * as React from 'react';

const DateRangePickerCustomStyled = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const DateRangePickerCustom = (props: any) => {
  const { value, onChange, ...rest } = props;
  const [startDate, setStartDate] = React.useState(0);
  const [endDate, setEndDate] = React.useState(0);
  const [datesPicked, setDatesPicked] = React.useState(0);

  return (
    <DateRangePickerCustomStyled>
      <DatePicker
        value={new Date()}
        minDate={startDate}
        onChange={(date: any) => {
          setDatesPicked(datesPicked + 1);
          if (datesPicked % 2 !== 0) {
            setEndDate(date.$D);
          } else {
            setStartDate(date.$D);
            setEndDate(0);
          }
        }}
        closeOnSelect={false}
        renderDay={(day: { date: () => number; toString: () => React.Key | null | undefined; }, _value: any, DayComponentProps: JSX.IntrinsicAttributes & PickersDayProps<unknown> & React.RefAttributes<HTMLButtonElement>) => {
          const isSelected =
            !DayComponentProps.outsideCurrentMonth &&
            Array.from(
              { length: endDate - startDate + 2 },
              (x, i) => i + startDate - 1
            ).indexOf(day.date()) > 0;
          return (
            <div
              style={
                isSelected
                  ? {
                    backgroundColor: 'blue',
                  }
                  : {}
              }
              key={day.toString()}
            >
              <PickersDay {...DayComponentProps} />
            </div>
          );
        }}
        {...rest}
      />
    </DateRangePickerCustomStyled>
  );
};

export default DateRangePickerCustom