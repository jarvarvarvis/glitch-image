import ReactModal from 'react-modal';

export function ErrorModal(props) {
    return (
        <>
            <ReactModal
                className="
                    absolute 
                    top-1/2 left-1/2 
                    grid justify-center items-center 
                    translate-x-[-50%] translate-y-[-50%] 
                    space-y-3 p-3 
                    bg-neutral-900
                    rounded-xl
                "
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }
                }}
                isOpen={props.isOpen}
            >
                <h1 className="text-lg font-semibold">{props.errorTitle}</h1>
                <p>{props.errorMessage}</p>
                <button 
                    className="font-medium items-center justify-center h-9 px-6 rounded-md text-slate-300 border border-slate-200" 
                    onClick={_ => props.setModalIsOpen(false)}
                >
                    Close
                </button>
            </ReactModal>
        </>
    );
}