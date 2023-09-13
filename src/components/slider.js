export function Slider(props) {
    return (
        <>
            <p>{props.text}</p>
            <input 
                type="range" min={props.min} max={props.max}
                value={props.value}
                onChange={event => props.setValue(event.target.value)}
            />
            <input 
                className="w-14 text-black"
                type="number" min={props.min} max={props.max}
                value={props.value}
                onChange={event => props.setValue(event.target.value)}
            />
        </>
    );
}