import { useCallback, useEffect, useRef, useState } from "react";
import "../App.css";

function InfiniteScroll() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const limit = 10;
  const loader = useRef(null);

  // fetching api data
  const fetchData = useCallback(
    async () => {
      if (loading || !hasMore) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://dummyjson.com/posts?limit=${limit}&skip=${skip}`
        );
        const json = await response.json();

        setData((prev) => [...prev, ...json.posts]);
        setSkip((prev) => prev + limit);
        setHasMore(json.posts.length > 0);
      } catch (error) {
        setError("Error while fetching data", error);
      } finally {
        setLoading(false);
      }
  }, [skip, hasMore, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries)
        if (entries[0].isIntersecting) {
          fetchData();
        }
      },
      { threshold: 1 }
    );

    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [fetchData]);

  if (error) return <p>{error.message}</p>;

  return (
    <ul>
      {data.map((post, index) => (
        <li className="post-card" key={index}>
          {post.id}
          {post.title}
        </li>
      ))}

      {loading && <p>Loading...</p>}
      {!hasMore && <p>This is the end</p>}

      {/* invisible div to trigger loading more */}
      <div ref={loader} className="loadingDiv"></div>
    </ul>
  );
}

export default InfiniteScroll;
