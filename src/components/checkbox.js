export function Checkbox(props) {
    return (
        <>
            <input 
                type="checkbox"
                checked={props.checked}
                onChange={event => {
                    props.onChecked(event.target.checked);
                }}
            />
            <p>{props.text}</p>
        </>
    );
}