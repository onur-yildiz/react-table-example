import { format } from "date-fns";

interface DateInputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: Date;
}

const DateInput = (props: DateInputProps) => {
  return (
    <input
      value={format(props.value, "yyyy-MM-dd")}
      className="input--date"
      type="date"
      onChange={props.onChange}
      max={format(new Date(), "yyyy-MM-dd")}
    />
  );
};

export default DateInput;
