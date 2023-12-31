import "../style/newsDetail.css";
import { useParams } from "react-router-dom";
import { useNews } from "../hooks/newsContext";
import { useHotNews } from "../hooks/useHotNews";
import { useBookmark } from "../hooks/markContext";
import { useState ,useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";



export default function NewsDetail() {
  const { news } = useNews();
  // will render twice because hotNews change from [] to [...hotNews]
  const [ hotNews ] = useHotNews();
  const { bookmarks } = useBookmark();
  const { accessToken } = useAuthToken();
  const [ newsDetail, setNewsDetail ] = useState([]);

  const { sourceID, newsID } = useParams();
  const id = parseInt(newsID);

  useEffect(() => {
    async function getNewsDetail(id) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/news/` + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const formatData = data.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          image: item.image,
          author: item.author,
          url: item.url,
        }));
        setNewsDetail(formatData);
      } else {
        console.log("Get news detail failed");
      }
    }

    if(sourceID === "bookmarks"){
      getNewsDetail(bookmarks[id].id);
    }
  }, []);

  let thisNews;
  switch(sourceID){
    case "details":
      thisNews = news[id];
      break;
    case "hotNews":
      thisNews = hotNews[id];
      break;
    case "bookmarks":
      thisNews = newsDetail[0];
      break;
    default:
  }

  return (
    <div className="news_details">
      <h1>{thisNews?.title}</h1>
      {/* <p>{`Author: ${thisNews?.author}`}</p> */}
      <img src={thisNews?.image} className="detail_image" alt="News_Image"></img>
      <article>{thisNews?.content} <a href={thisNews?.url}>[Read More]</a></article>
    </div>
  )
}
