import {helloWorldFunction} from "@/app/actions/helloWorldAction";
import {useEffect, useState} from "react";

export default function HelloWorldComponent() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        helloWorldFunction()
            .then(setMessage)
            .catch(console.error);
    }, []);

    return (
        <div>
            {message}
        </div>
    );
}