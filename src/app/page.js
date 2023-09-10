'use client';

import { useState } from 'react';

export default function Home() {
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [isLoading, setLoading] = useState(false);

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
            return;
        }

        // Files array has a value at index 0
        var file = event.target.files[0];
        if (!file) {
            resetImage();
            return;
        }

        // The file's mime type is correct (PNG or JPG image)
        if (file.type != "image/png" && file.type != "image/jpeg") {
            resetImage();
            return;
        }

        const i = event.target.files[0];
    
        setImage(i);
        setImageURL(URL.createObjectURL(i));
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
                setLoading(false);
                console.log(response);
            });
        }
    }
    
    return (
        <div className="font-sans">
            <div className="relative">
                <img src={imageURL}></img>
            </div>

            <form className="flex-auto p-6 space-y-5">
                <h1 className="flex-auto text-lg font-semibold">
                    Select Image
                </h1>
                
                <div className="space-x-1">
                    <input
                        id="fileInput"
                        type="file" 
                        accept="image/png, image/jpeg"
                        disabled={isLoading} 
                        onChange={onUpdateClientImage}
                    ></input>
                    <a>(Upload size: 5MB)</a>
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
