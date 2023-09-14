export function Selector(props) {
    return (
        <div className="flex space-x-2">
            <p>{props.text}</p>
            <select
                disabled={props.disabled || false}
                className="text-black"
                onChange={event => {
                    props.setValue(event.target.value)
                }}
            >
                {props.children}
            </select>
        </div>
    );
}