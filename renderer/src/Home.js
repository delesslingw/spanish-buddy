import { useEffect, useRef, useState } from "react";

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef(null);

    useEffect(() => {
        window.api.loadHistory().then((history) => {
            // console.log(history);
            setMessages(history);
        });
    }, []);
    useEffect(() => {
        if (scrollRef && scrollRef.current) {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);
    const handleSend = async () => {
        let text = input.trim();
        if (text === "") return;
        let now = new Date().toISOString();
        setMessages((m) => [...m, { sender: "user", timestamp: now, text }]);
        setInput("");
        const { updatedHistory } = await window.api.sendMessage(input);
        console.log(typeof updatedHistory);
        setMessages([...updatedHistory]);
    };
    const enterKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    return (
        <div
            style={{
                display: "grid",
                placeItems: "center",
                minHeight: "100vh",
                fontFamily: "sans-serif",
                color: "#333333",
            }}
        >
            <div
                style={{
                    width: "70vw",
                    height: "80vh",
                    boxShadow: "4px 4px 8px #eeeeee, -4px -4px 8px #ffffff",
                    borderRadius: 10,
                    padding: 10,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                    }}
                >
                    {/* Scrollbar styles */}
                    <style>{`
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-thumb {
            background: #d1d9e6;
            border-radius: 10px;
            
            
        }
        ::-webkit-scrollbar-track {
            
            border-radius: 10px;
          
        }
    `}</style>
                    <div
                        ref={scrollRef}
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            overflowY: "scroll",

                            gap: 16,
                            marginBottom: 5,
                            padding: 10,
                        }}
                    >
                        {messages.map(({ sender, timestamp, text }, i) => {
                            return <Message sender={sender} timestamp={timestamp} text={text} key={i}></Message>;
                        })}
                    </div>
                    <div style={{ display: "flex", gap: 20 }}>
                        <div
                            style={{
                                minHeight: 75,
                                flex: 1,
                                borderRadius: 10,
                                boxShadow: "inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff",
                            }}
                        >
                            <textarea
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                    backgroundColor: "inherit",
                                    outline: "none",
                                    resize: "none", // prevents resizing
                                    padding: "8px",
                                    fontFamily: "inherit",
                                    fontSize: "16px",
                                    textAlign: "left",
                                    color: "#333333",
                                }}
                                onKeyDown={enterKeyDown}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                }}
                                value={input}
                            />
                        </div>
                        <div style={{ display: "grid", placeItems: "center" }}>
                            <button
                                style={{
                                    backgroundColor: input === "" ? "grey" : "#aaffaa",

                                    height: 50,
                                    width: 50,
                                    borderRadius: 50,
                                    display: "grid",
                                    placeItems: "center",
                                    cursor: "pointer",
                                    border: "none",
                                    boxShadow: "4px 4px 8px #eeeeee, -4px -4px 8 #ffffff",
                                }}
                                onClick={handleSend}
                            >
                                <svg
                                    width="32px"
                                    height="32px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                                        stroke="#000000"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Message = ({ sender, text, timestamp }) => {
    let timeString = formatChatTimestamp(timestamp);
    return (
        <div style={{ alignSelf: sender === "ai" ? "flex-start" : "flex-end", maxWidth: "80%" }}>
            <p
                style={{
                    fontSize: 10,
                    fontColor: "#aaaaaa",
                    margin: 0,
                    paddingLeft: 20,
                    marginBottom: 2,
                }}
            >
                {sender} <span style={{ fontStyle: "italic" }}>{timeString}</span>
            </p>
            <div
                style={{
                    backgroundColor: sender === "ai" ? "#b9e3ed" : "#d7b9ed",
                    borderRadius: 20,
                    padding: "12px 16px",
                    boxShadow: "2px 2px 4px #d1d9e6, -2px -2px 4px #ffffff ",
                }}
            >
                <p style={{ margin: 0 }}>{text}</p>
            </div>
        </div>
    );
};
export default Home;

function formatChatTimestamp(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };

    if (isToday) {
        return date.toLocaleTimeString(undefined, timeOptions);
    } else if (isYesterday) {
        return `Yesterday ${date.toLocaleTimeString(undefined, timeOptions)}`;
    } else {
        const daysAgo = (now - date) / (1000 * 60 * 60 * 24);
        if (daysAgo <= 7) {
            const weekdayOptions = { weekday: "short", ...timeOptions }; // e.g., "Mon"
            return date.toLocaleString(undefined, weekdayOptions);
        } else {
            const olderOptions = {
                month: "2-digit",
                day: "2-digit",
                year: "2-digit",
                ...timeOptions,
            };
            return date.toLocaleString(undefined, olderOptions);
        }
    }
}
