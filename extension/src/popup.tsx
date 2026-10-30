import { useState } from "react"

function IndexPopup() {
    const [isActive, setIsActive] = useState(false)

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: 16,
                width: 300
            }}>
            <h2>The Ghost 👻</h2>
            <p>Status: {isActive ? "Active" : "Dormant"}</p>
            <button onClick={() => setIsActive(!isActive)}>
                {isActive ? "Deactivate" : "Activate"}
            </button>
            <div style={{ marginTop: 10 }}>
                <small>Connected to Brain: 🔴</small>
            </div>
        </div>
    )
}

export default IndexPopup
