'use client';

import { useState } from 'react';

import { 
    MAX_UPLOAD_FILE_SIZE_MB,
    SELECTED_FILE_SIZE_DISPLAY_PRECISION,
    MEGABYTES_FACTOR,
    MAX_UPLOAD_FILE_SIZE_BYTES
} from '@/constants';

import { Slider } from '@/components/slider';
import { ActionButton } from '@/components/action_button';
import { ErrorModal } from '@/components/error_modal';
import { Checkbox } from '@/components/checkbox';
import { ConfigContainer } from '@/components/config_container';
import { Selector } from '@/components/selector';

export default function Home() {
    // Image-related state
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [cachedImageBlob, setCachedImageBlob] = useState({
        blob: null,
        fileName: "none",
    });
    const [selectedFileSize, setSelectedFileSize] = useState(0);
    const [isLoading, setLoading] = useState(false);
    
    // Config-related state
    const [cfg, setCfg] = useState({
        getFilterMask: false,
        filterFunction: "luminance",
        minThreshold: 0,
        maxThreshold: 60,

        addRandomSpanOffset: true,
        maxRandomSpanOffset: 0,
        
        sortEvaluatorFunction: "rgb",
        sortComparisonFunction: "ascending",
    });

    // Error-related state
    const [errorMessage, setErrorMessage] = useState("");
    const [errorScope, setErrorScope] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // Error-related functions
    function setError(scope, message) {
        setErrorScope(scope);
        setErrorMessage(message);
        setModalIsOpen(true);
    }
    
    // Image and uploading-related functions
    function resetImage() {
        setImage(null);
        setImageURL(null);
        setSelectedFileSize(0);
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
            setError("Client", "No files were selected");
            return;
        }

        // Files array has an element
        var file = event.target.files[0];
        if (!file) {
            resetImage();
            setError("Client", "No files were selected");
            return;
        }

        // The file's mime type is correct (PNG or JPG image)
        if (file.type != "image/png" && file.type != "image/jpeg") {
            resetImage();
            setError("Client", "Selected file doesn't have supported type (supported: png, jpg/jpeg)");
            return;
        }

        var fileSizeInBytes = file.size;

        var precision = Math.pow(10, SELECTED_FILE_SIZE_DISPLAY_PRECISION - 1);
        var displaySize = Math.ceil(fileSizeInBytes / MEGABYTES_FACTOR * precision) / precision;

        if (fileSizeInBytes > MAX_UPLOAD_FILE_SIZE_BYTES) {
            resetImage();
            setError("Client", "Selected file exceeds maximum size of " + MAX_UPLOAD_FILE_SIZE_MB + "MB");
            return;
        }
        
        setSelectedFileSize(displaySize);

        const sourceImage = event.target.files[0];
    
        setImage(sourceImage);
        setImageURL(URL.createObjectURL(sourceImage));
    }

    function download(blob, name) {
        if (!blob) {
            setError("Client", "No image was submitted to the server yet (no cached image blob)");
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
           
            setCachedImageBlob({
                blob: null,
                fileName: "none"
            });
            setLoading(true);

            var responseText = null;

            fetch("/api/v1/glitch", {
                method: "POST",
                body
            }).then(async (response) => {
                responseText = await response.text();
                var responseData = JSON.parse(responseText);
                
                // If the request to the API was not successful, inform
                // the user about the error.
                if (response.status != 200) {
                    resetImage();
                    setLoading(false);
                    setError("Server", responseData.error.message);
                    return;
                }

                // Get the image data from the response and create a blob
                var imageBytes = responseData.data.data;
                var imageArray = new Uint8Array(imageBytes, imageBytes.length);
                var blob = new Blob([imageArray], {
                    type: image.type
                });

                console.log("Got data of length " + imageBytes.length + ", caching for download...");
                
                setCachedImageBlob({
                    blob,
                    fileName: image.name
                });
                setLoading(false);

                var url = URL.createObjectURL(blob);
                setImageURL(url);
            }).catch(err => {
                resetImage();
                var message = String(err);
                if (responseText) {
                    message += ", raw response: " + responseText;
                }
                
                setError("Client", message);
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
            
            <ErrorModal 
                isOpen={modalIsOpen} 
                setModalIsOpen={setModalIsOpen}
                errorTitle={"Error (" + errorScope + ")"}
                errorMessage={errorMessage} 
            />

            <form className="flex-auto p-6 space-y-5">
                <h1 className="text-lg font-semibold">
                    Select Image
                </h1>
                
                <input
                    id="fileInput"
                    type="file" 
                    accept="image/png, image/jpeg"
                    disabled={isLoading} 
                    onChange={onUpdateClientImage}
                />

                <br />

                <a>(Upload size: {selectedFileSize} / {MAX_UPLOAD_FILE_SIZE_MB}MB)</a>

                <div className="flow-root">
                    <div className="-m-1 flex flex-wrap">
                        <ActionButton 
                            text="Submit"
                            className="m-1"
                            disabled={isLoading} 
                            onClick={submitToServer} 
                        />
                        <ActionButton 
                            text="Reset" 
                            className="m-1"
                            disabled={isLoading} 
                            onClick={_ => {
                                resetFileInput();
                                resetImage();
                            }}
                        />
                        <ActionButton 
                            text={"Download Result (" + cachedImageBlob.fileName + ")"}
                            className="m-1"
                            disabled={isLoading || cachedImageBlob.blob == null} 
                            onClick={_ => {
                                download(cachedImageBlob.blob, cachedImageBlob.fileName);
                            }}
                        />
                    </div>
                </div>

                <hr className="border-dashed w-full" />

                <h1 className="text-lg font-semibold">
                    Configuration
                </h1>

                <div className="space-y-4 flow max-w-[500px]">
                    <ConfigContainer>
                        <Checkbox 
                            text="Get Filter Mask?"
                            checked={cfg.getFilterMask}
                            onChecked={checked => {
                                setCfg({
                                    ...cfg,
                                    getFilterMask: checked
                                })
                            }}
                        />

                        <Selector
                            text="Filter Function:"
                            setValue={value => {
                                setCfg({
                                    ...cfg,
                                    filterFunction: value
                                })
                            }}
                        >
                            <option value="luminance">Luminance</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                        </Selector>
                        
                        <Slider
                            text="Min Threshold: "
                            min={0}
                            max={255}
                            value={cfg.minThreshold}
                            setValue={value => setMinThreshold(value)}
                        />
                        <Slider
                            text="Max Threshold: "
                            min={0}
                            max={255}
                            value={cfg.maxThreshold}
                            setValue={value => setMaxThreshold(value)}
                        />
                    </ConfigContainer>

                    <hr className="border-dashed" />

                    <ConfigContainer>
                        <Selector
                            text="Sort Evaluator Function:"
                            setValue={value => {
                                setCfg({
                                    ...cfg,
                                    sortEvaluatorFunction: value
                                })
                            }}
                        >
                            <option value="rgb">Weighted RGB</option>
                            <option value="bgr">Weighted BGR</option>
                            <option value="luminance">Luminance</option>
                        </Selector>

                        <Selector
                            text="Comparison Function:"
                            setValue={value => {
                                setCfg({
                                    ...cfg,
                                    sortComparisonFunction: value
                                })
                            }}
                        >
                            <option value="ascending">Ascending</option>
                            <option value="descending">Descending</option>
                        </Selector>
                    </ConfigContainer>
                </div>
            </form>
        </div>
    )
}
