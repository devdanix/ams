import React, {useState} from 'react'
import _ from 'lodash'


// Components
import DatePicker from './DatePicker.jsx';


export default function FormField(props) {
  const [startDate, setStartDate] = useState(new Date());

    let handleColor = (time) => {
      return time.getHours() > 12 ? "text-success" : "text-error";
    };

  return (
    <div key={props.label} className="entry-wrapper relative">
      {props.extraType == 'date' ?
          <DatePicker
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            timeClassName={handleColor}
          />:
      <input
        {...props.attrs}
        onChange={props.onChange}
        id={props.id}
        type={props.type}
        className={props.inputClassName}
        label={props.label}
        name={props.name}
        ref={props.ref}
      />
    }
      {/* <input
        {...props.attrs}
        onChange={props.onChange}
        id={props.id}
        type={props.type}
        className={props.inputClassName}
        label={props.label}
        name={props.name}
        ref={props.ref}
      /> */}
      <label
        id={`${props.id}-label`}
        className={props.labelClassName}
        htmlFor={props.label}>
          {_.capitalize(props.label)}
      </label>
    </div>
  );
}




