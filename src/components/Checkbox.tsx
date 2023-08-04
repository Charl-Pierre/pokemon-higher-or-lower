export default function Checkbox({ label, value, onChange } : {label: string, value: boolean, onChange: (event : boolean)=>void}){
    return (
      <label>
        {label}
        <input className={"mx-2"} type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />        
      </label>
    );
  };