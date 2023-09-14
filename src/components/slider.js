export function Slider(props) {
    return (
        <div className="flex space-x-2">
            <p>{props.text}</p>
            <input 
                type="range"
                disabled={props.disabled || false}
                min={props.min} 
                max={props.max}
                value={props.value}
                onChange={event => props.setValue(event.target.value)}
            />
            <input 
                className="w-14 text-black"
                disabled={props.disabled || false}
                type="number"
                min={props.min}
                max={props.max}
                value={props.value}
                onChange={event => props.setValue(event.target.value)}
            />
        </div>
    );
}