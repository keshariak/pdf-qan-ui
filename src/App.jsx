import { useRef, useState } from "react";
import axios from "axios";
import Top from "./components/Top";
import Footer from "./components/Footer";
import ReactMarkdown from "react-markdown";

export default function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [pdfText, setPdfText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile) return alert("Please select a PDF file");

    const formData = new FormData();
    formData.append("pdf", pdfFile);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/upload", formData);
      setPdfText(response.data.text);
      alert("PDF uploaded successfully");
    } catch (error) {
      console.error("Error uploading PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question) return alert("Please enter a question");
    if (!pdfText) return alert("Upload a PDF first");

    const userMessage = { text: question, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/ask", {
        question,
        pdfText
      });

      const botMessage = { text: response.data.answer, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Error asking question:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputRef = useRef(null);

  const handleScrollToInput = () => {
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    inputRef.current?.focus(); // Focus the input box after scrolling
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <Top />

      <div className="bg-slate-100 pt-10 flex justify-center">
        <div className="h-screen p-3 flex w-screen flex-col items-center">
          <div className="relative text-slate-500 bg-slate-200 font-semibold text-sm p-1 px-4 mb-10 rounded-full shadow-lg ">
            It is now public!
          </div>

          <h1 className="text-6xl font-bold text-center">Chat with your</h1>
          <h1 className="text-6xl font-bold text-center">
            <span className="text-blue-600">Documents</span> in seconds.
          </h1>
          <p className="w-2/3 mt-5 text-center">
            It allows you to have conversations with any PDF document. Simply upload your file and start asking questions right away.
          </p>
          <button onClick={handleScrollToInput} className="bg-blue-500 rounded-2xl py-1 px-6 font-semibold text-white mt-5 animate-gradient">
            Get started ➝
          </button>

          <div className="md:w-1/2 md:h-2/3 w-full h-1/3 mt-5 overflow-hidden">
            <img
              className="w-full h-full object-cover object-top"
              src="https://images.ctfassets.net/lzny33ho1g45/ku1xXkCsTJ7Zp2GGbTiWB/de0cdacab1063a7945d47fd44ff3dbb7/create-google-docs-template-04-template-example-bio-for-dogs.png?w=1400"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 px-6 mt-10 ">
        <h1 className="text-3xl font-bold text-gray-900">Start chatting in minutes</h1>
        <p className="text-gray-600 mt-2">Chatting with your PDF files has never been easier than with Quill.</p>

        <div className=" flex gap-8 mt-8 text-center">
          {[
           
            { step: "Step 1", title: "Upload your PDF file", desc: "We’ll process your file so you can chat with it." },
            { step: "Step 2", title: "Start asking questions", desc: "It’s that simple! Try out Quill today." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="space-y-2">
              <h3 className="text-blue-600 font-semibold">{step}</h3>
              <h2 className="font-medium text-gray-800">{title}</h2>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        {/* File Upload Section Inside "My Files" */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-12 w-full max-w-lg">
          <h2 className="text-gray-800 text-lg font-semibold mb-4">My Files</h2>
          <div className="border-dashed border-2 border-gray-300 p-6 rounded-lg text-center">
            <p className="text-gray-600">Click to upload or drag and drop</p>
            <p className="text-gray-500 text-sm">PDF files (max 10MB)</p>

            {/* Uploading Box */}
            <form onSubmit={handleUpload} className="mt-4">
              <input 
                type="file" 
                accept="application/pdf" 
                ref={inputRef} 
                onChange={(e) => setPdfFile(e.target.files[0])} 
                className="border p-2 rounded-md"
              />
              <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
                Upload
              </button>
            </form>
          </div>
        </div>

        {/* WhatsApp-style Chat Box (Visible Only After PDF Upload) */}
{pdfText && (
  <div className="w-full md:max-w-2/3 max-w-lg bg-white shadow-lg rounded-lg p-4 mt-8">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Chat with Document</h2>
    
    <div className="h-80 overflow-y-auto border p-3 rounded-md bg-gray-100">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
          <div className={`p-3 rounded-lg max-w-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
            
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        </div>
      ))}
      {loading && <p className="text-gray-500 text-sm">Loading...</p>}
    </div>

    {/* Chat Input */}
    <div className="flex mt-4">
      <input
        type="text"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAsk()} // Send message on Enter key
        className="border p-2 rounded-md w-full"
      />
      <button onClick={handleAsk} className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md">
        Ask
      </button>
    </div>
  </div>
)}

      </div>
      <Footer></Footer>
    </div>
  );
}
