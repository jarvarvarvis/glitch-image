'use client';

import { useState } from 'react';

import ReactModal from 'react-modal';


import { 
    MAX_UPLOAD_FILE_SIZE_MB,
    SELECTED_FILE_SIZE_DISPLAY_PRECISION,
    MEGABYTES_FACTOR,
    MAX_UPLOAD_FILE_SIZE_BYTES
} from '@/constants';

import { Slider } from '@/components/slider';
import { ActionButton } from '@/components/action_button';

export default function Home() {
    // Image-related state
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [cachedImageBlob, setCachedImageBlob] = useState(null);
    const [selectedFileSize, setSelectedFileSize] = useState(0);
    const [isLoading, setLoading] = useState(false);
    
    // Config-related state
    const [cfg, setCfg] = useState({
        downloadMask: false,
        minThreshold: 0,
        maxThreshold: 60
    });

    // Error-related state
    const [errorMessage, setErrorMessage] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // Error-related functions
    function setError(message) {
        setErrorMessage(message);
        setModalIsOpen(true);
    }
    
    // Image and uploading-related functions
    function resetImage() {
        setImage(null);
        setImageURL(null);
        setSelectedFileSize(0);
        setCachedImageBlob(null);
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
            setError("No files were selected");
            return;
        }

        // Files array has a value at index 0
        var file = event.target.files[0];
        if (!file) {
            resetImage();
            setError("No files or file input was invalid were selected");
            return;
        }

        // The file's mime type is correct (PNG or JPG image)
        if (file.type != "image/png" && file.type != "image/jpeg") {
            resetImage();
            setError("Selected file doesn't have supported type (supported: png, jpg/jpeg)");
            return;
        }

        var fileSizeInBytes = file.size;

        var precision = Math.pow(10, SELECTED_FILE_SIZE_DISPLAY_PRECISION - 1);
        var displaySize = Math.ceil(fileSizeInBytes / MEGABYTES_FACTOR * precision) / precision;

        if (fileSizeInBytes > MAX_UPLOAD_FILE_SIZE_BYTES) {
            resetImage();
            setError("Selected file exceeds maximum size of " + MAX_UPLOAD_FILE_SIZE_MB + "MB");
            return;
        }
        
        setSelectedFileSize(displaySize);

        const sourceImage = event.target.files[0];
    
        setImage(sourceImage);
        setImageURL(URL.createObjectURL(sourceImage));
    }

    function download(blob, name) {
        if (!blob) {
            setError("No image was submitted to the server yet (no cached image blob)");
            return;
        }

        var url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        return url;
    }

    async function submitToServer() {
        if (image) {
            const body = new FormData();

            body.append("file", image);
            body.append("cfg", JSON.stringify(cfg));
            
            setCachedImageBlob(null);
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
                    setError(responseData.errorMessage);
                    return;
                }

                // Get the image data from the response and create a blob
                var imageBytes = responseData.data.data;
                var imageArray = new Uint8Array(imageBytes, imageBytes.length);
                var blob = new Blob([imageArray], {
                    type: image.type
                });

                console.log("Got data of length " + imageBytes.length + ", now downloading.");
                
                setCachedImageBlob(blob);
                setLoading(false);

                var url = URL.createObjectURL(blob);
                setImageURL(url);
            }).catch(err => {
                setError(String(err));
            });
        }
    }

    // Config-related functions
    function setMinThreshold(minThreshold) {
        var maxThreshold = Math.max(minThreshold, cfg.maxThreshold);
        setCfg({
            ...cfg,
            minThreshold: parseInt(minThreshold),
            maxThreshold: parseInt(maxThreshold),
        })
    }

    function setMaxThreshold(maxThreshold) {
        var minThreshold = Math.min(maxThreshold, cfg.minThreshold);
        setCfg({
            ...cfg,
            minThreshold: parseInt(minThreshold),
            maxThreshold: parseInt(maxThreshold),
        })
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
                <button 
                    className="font-medium items-center justify-center h-9 px-6 rounded-md text-slate-300 border border-slate-200" 
                    onClick={_ => setModalIsOpen(false)}
                >
                    Close
                </button>
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
                    />
                </div>

                <a>(Upload size: {selectedFileSize} / {MAX_UPLOAD_FILE_SIZE_MB}MB)</a>

                <div className="space-x-2">
                    <ActionButton text="Submit" disabled={isLoading} onClick={submitToServer} />
                    <ActionButton 
                        text="Reset" 
                        disabled={isLoading} 
                        onClick={_ => {
                            resetFileInput();
                            resetImage();
                        }}
                    />
                    <ActionButton 
                        text="Download Result" 
                        disabled={isLoading || cachedImageBlob == null} 
                        onClick={_ => {
                            download(cachedImageBlob, image.name);
                        }}
                    />
                </div>

                <h1 className="flex-auto text-lg font-semibold">
                    Configuration
                </h1>

                <div className="space-y-4 grid justify-items-start w-100">
                    <div className="flex space-x-2">
                        <input 
                            type="checkbox"
                            checked={cfg.downloadMask}
                            onChange={event => {
                                setCfg({
                                    ...cfg,
                                    downloadMask: event.target.checked
                                })
                            }}
                        />
                        <p>Download Mask?</p>
                    </div>

                    <hr className="border-dashed w-64" />

                    <div className="space-y-0 justify-items-end grid">
                        <div className="flex space-x-2">
                            <Slider
                                text="Min Threshold: "
                                min={0}
                                max={255}
                                value={cfg.minThreshold}
                                setValue={value => setMinThreshold(value)}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <Slider
                                text="Max Threshold: "
                                min={0}
                                max={255}
                                value={cfg.maxThreshold}
                                setValue={value => setMaxThreshold(value)}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
