import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    ["📶", "Wi-Fi", "My Wi-Fi is not working"],
    ["🔐", "Password", "I forgot my password"],
    ["🌐", "VPN", "My VPN is not connecting"],
    ["🖨️", "Printer", "My printer is not printing"],
    ["📧", "Email", "I cannot access my email"],
    ["🔊", "Audio", "My laptop has no sound"],
    ["🖥️", "Slow PC", "My computer is running slowly"],
    ["⌨️", "Keyboard / Mouse", "My keyboard is not working"],
    ["📁", "File Access", "I cannot open a file"],
    ["🔒", "Account", "My account is locked"],
  ];

  const selectCategory = (example) => {
    setQuestion(example);
    setAnswer("");
  };

  const askSmartDesk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        }
      );

      const data = await response.json();

      setAnswer(
        data.answer ||
        data.error ||
        "Something went wrong."
      );
    } catch (error) {
      setAnswer(
        "Unable to connect to SmartDesk AI backend."
      );
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h1 style={styles.title}>🤖 SmartDesk AI</h1>

        <p style={styles.subtitle}>
          AI-Powered IT Support Assistant
        </p>

        <h2 style={styles.heading}>
          How can we help you today?
        </h2>

        <div style={styles.categories}>
          {categories.map(([icon, name, example]) => (
            <button
              key={name}
              onClick={() => selectCategory(example)}
              style={styles.category}
            >
              <span style={styles.icon}>{icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>

        <p style={styles.or}>
          Or describe your problem:
        </p>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Example: My Wi-Fi is not working..."
          style={styles.textarea}
        />

        <button
          onClick={askSmartDesk}
          disabled={loading}
          style={styles.askButton}
        >
          {loading ? "Thinking..." : "Ask SmartDesk"}
        </button>

        {answer && (
          <div style={styles.answer}>
            <h3>💡 Solution</h3>
            <p>{answer}</p>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#e8f5f2",
    padding: "25px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "850px",
    maxWidth: "100%",
    padding: "40px",
    background: "#ffffff",
    borderRadius: "22px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.10)",
  },

  title: {
    textAlign: "center",
    marginBottom: "8px",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
  },

  heading: {
    fontSize: "21px",
    marginBottom: "18px",
  },

  categories: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "12px",
  },

  category: {
    padding: "15px 8px",
    border: "1px solid #d4e7e4",
    borderRadius: "12px",
    background: "#f5faf9",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "7px",
  },

  icon: {
    fontSize: "25px",
  },

  or: {
    color: "#666",
    marginTop: "28px",
    marginBottom: "10px",
  },

  textarea: {
    width: "100%",
    height: "120px",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
    resize: "none",
  },

  askButton: {
    width: "100%",
    marginTop: "15px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#2f8f83",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  answer: {
    marginTop: "25px",
    padding: "20px",
    borderRadius: "12px",
    background: "#f2f8f7",
    lineHeight: "1.6",
  },
};

export default App;