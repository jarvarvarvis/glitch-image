'use client';

import { useState } from 'react';

import { MAX_UPLOAD_FILE_SIZE_MB } from '@/constants';
import ReactModal from 'react-modal';

export default function Home() {
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    
    function resetImage() {
        setImage(null);
        setImageURL(null);
    }

    function resetFileInput() {
        var fileInput = document.querySelector("#fileInput");
        fileInput.value = [];
    }

    function onUpdateClientImage(event) {
        /// Input validation ///
        // Files array exists
        if (!event.target.files) {
            resetImage();
            setErrorMessage("No files were selected");
            setModalIsOpen(true);
            return;
        }

        // Files array has a value at index 0
        var file = event.target.files[0];
        if (!file) {
            resetImage();
            setErrorMessage("No files or file input was invalid were selected");
            setModalIsOpen(true);
            return;
        }

        // The file's mime type is correct (PNG or JPG image)
        if (file.type != "image/png" && file.type != "image/jpeg") {
            resetImage();
            setErrorMessage("Selected file doesn't have supported type (supported: png, jpg/jpeg)");
            setModalIsOpen(true);
            return;
        }

        const sourceImage = event.target.files[0];
    
        setImage(sourceImage);
        setImageURL(URL.createObjectURL(sourceImage));
    }

    function download(blob, name) {
        var url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    async function submitToServer() {
        if (image) {
            const body = new FormData();

            body.append("file", image);
            
            setLoading(true);
            fetch("/api/v1/glitch", {
                method: "POST",
                body
            }).then(async (response) => {
                var responseText = await response.text();
                var responseData = JSON.parse(responseText);
                
                // If the request to the API was not successful, inform
                // the user about the error.
                if (response.status != 200) {
                    setLoading(false);
                    console.error(responseData.errorMessage);
                    setErrorMessage(responseData.errorMessage);
                    setModalIsOpen(true);
                    return;
                }

                // Get the image data from the response and create a blob
                // that will then be downloaded.
                var imageBytes = responseData.imageBytes.data;
                var imageArray = new Uint8Array(imageBytes, imageBytes.length);
                var blob = new Blob([imageArray], {
                    type: image.type
                });

                console.log("Got data of length " + imageBytes.length + ", now downloading.");
                download(blob, image.name);
                setLoading(false);
            }).catch(err => {
                console.error(String(err));
                setErrorMessage(String(err));
                setModalIsOpen(true);
            });
        }
    }

    return (
        <div className="font-sans">
            <div className="relative">
                <img src={imageURL}></img>
            </div>
            
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
                isOpen={modalIsOpen}
            >
                <h1 className="text-lg font-semibold">Error</h1>
                <p>{errorMessage}</p>
                <button className="font-medium items-center justify-center h-9 px-6 rounded-md text-slate-300 border border-slate-200" onClick={
                    _ => {
                        setModalIsOpen(false);
                    }
                }>Close</button>
            </ReactModal>

            <form className="flex-auto p-6 space-y-5">
                <h1 className="flex-auto text-lg font-semibold">
                    Select Image
                </h1>
                
                <div className="space-x-2">
                    <input
                        id="fileInput"
                        type="file" 
                        accept="image/png, image/jpeg"
                        disabled={isLoading} 
                        onChange={onUpdateClientImage}
                    ></input>
                    <a>(Upload size: {MAX_UPLOAD_FILE_SIZE_MB}MB)</a>
                </div>

                <div className="space-x-2">
                    <button
                        className="font-medium items-center justify-center h-9 px-6 rounded-md text-slate-300 border border-slate-200"
                        type="button" 
                        disabled={isLoading} 
                        onClick={submitToServer}
                    >
                        Submit
                    </button>
                    <button
                        className="font-medium items-center justify-center h-9 px-6 rounded-md text-slate-300 border border-slate-200"
                        type="button" 
                        disabled={isLoading} 
                        onClick={_ => {
                            resetFileInput();
                            resetImage();
                        }}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    )
}
