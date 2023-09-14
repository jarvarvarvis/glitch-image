export function Checkbox(props) {
    return (
        <div className="flex space-x-2">
            <p>{props.text}</p>
            <input 
                type="checkbox"
                disabled={props.disabled || false}
                checked={props.checked}
                onChange={event => {
                    props.onChecked(event.target.checked);
                }}
            />
        </div>
    );
}