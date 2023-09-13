export function ActionButton(props) {
    return (
        <>
            <button
                className={
                    "font-medium h-9 px-6 rounded-md text-slate-300 border border-slate-200 disabled:bg-slate-100 hover:scale-105 " +
                    props.className
                }
                type="button"
                disabled={props.disabled}
                onClick={props.onClick}
            >
                {props.text}
            </button>
        </>
    );
}