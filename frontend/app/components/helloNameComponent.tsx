import {useState} from "react";

export default function HelloNameComponent() {
    const [username, setUsername] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    return (
        <>
            <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
            />
            <div>Hello {username}!</div>
        </>
    );
}