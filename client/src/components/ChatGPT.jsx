import "../style/chatGPT.css";
import { useAuthToken } from "../AuthTokenContext";
import { useParams } from "react-router-dom";
import { useNews } from "../hooks/newsContext";
import { useBookmark } from "../hooks/markContext";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const GPTIcon = "https://raw.githubusercontent.com/SAP-Custom-Widget/ChatGptWidget/main/icon.png";

export default function ChatGPT() {
  const { user } = useAuth0();
  const { bookmarks } = useBookmark();
  const {newsID} = useParams();
  const index = parseInt(newsID);
  const thisNews = bookmarks[index];
  

  const [input, setInput] = useState("");
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);

  async function getResponse(){

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'User-Agent': 'MyApplication/1.0'
      },
      body: JSON.stringify({
        model:"gpt-3.5-turbo",
        messages: [{role: "user", content: `${input}`}], 
        temperature: 0.1,
        stop: "\n",
      })
    };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
    if(response.ok){
        const data = await response.json();
        setText(data.choices[0].message.content);
        setHistory((prev) => [...prev, data.choices[0].message.content]);
        console.log(history);
    }
    } catch (err) {
      console.log(err);
    }
  }

  function saveResponse(){}
    return (
      <div className="container">
        <h2>
          Ask me about the news "<span>{thisNews?.title}</span>... "
        </h2>

        {text &&
          <ul className="GPT_wrapper">
            {history.map((item, index) => {
              return (
                <li key={index} className="GPT_response"> 
                    {index % 2 ? <img src={GPTIcon} className="GPTlogo" alt="GPT_Logo"></img> :
                                  <img src={user.picture} className="Userlogo" alt="GPT_Logo"></img>   }
                    <p>{item}</p>
                </li>)
            })}
          </ul>
        }

        <div className="input_wrapper">
          <textarea className="GPT_input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={1}
            cols={100}
            placeholder="Ask ChatGPT about this news"
          />
          <button className="input_button" title="send" onClick={() => {
            setHistory((prev) => [...prev, input]);
            setInput("");
            getResponse()
          }}>
            <box-icon name='send' type="solid"></box-icon>
          </button> 
          <button className="input_button" title="save" onClick={saveResponse}>
            <box-icon name='save'></box-icon>
          </button>
        </div>
      </div>
    );
  }