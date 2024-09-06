import React, { useEffect, useState } from "react";

const RecentArticle = () => {
    const [recentPost, setRecentPost] = useState({});

    useEffect(() => {
        try {
            const fetchRecentPost = async () => {
                const res = await fetch(
                    "/api/post/getposts?order=desc&limit=3"
                );
                const data = await res.json();
                if (!res.ok) {
                    console.error("Failed to fetch recent posts");
                    return;
                }
                if (res.ok) {
                    setRecentPost(data.posts);
                }
            };
            fetchRecentPost();
        } catch (error) {
            console.log(error.message);
        }
    }, []);
    console.log("recentPost=>", recentPost);

    return (
        <>
            <div className="flex flex-col items-center justify-center mb-5">
                <h1 className="text-xl mt-5">Recent Article</h1>
            </div>
            <div className="">
                {recentPost && recentPost.map((post) => <h1>{post.title}</h1>)}
            </div>
        </>
    );
};

export default React.memo(RecentArticle);
