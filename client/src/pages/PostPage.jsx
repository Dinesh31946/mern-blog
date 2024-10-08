import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Atom } from "react-loading-indicators";
import { Button } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState({});
    const [recentPost, setRecentPost] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `/api/post/getposts?slug=${postSlug}`
                );
                const data = await response.json();

                if (!response.ok) {
                    toast.error("Failed to load post");
                    // navigate("/not-found");
                    return;
                } else {
                    setPost(data.posts[0]);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load post");
                setLoading(false);
                // navigate("/not-found");
            }
        };
        fetchPost();
    }, [postSlug]);

    useEffect(() => {
        try {
            const fetchRecentPost = async () => {
                const res = await fetch("/api/post/getposts?&limit=3");
                const data = await res.json();

                if (res.ok) {
                    setRecentPost(data.posts);
                }
            };
            fetchRecentPost();
        } catch (error) {
            console.log(error.message);
        }
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Atom color="#1ebbd9" size="medium" text="" textColor="" />
            </div>
        );
    return (
        <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
            <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                {post && post.title}
            </h1>
            <Link
                to={`/search?category=${post && post.category}`}
                className="self-center mt-5"
            >
                <Button color="gray" pill size="xs">
                    {post && post.category}
                </Button>
            </Link>
            <img
                src={post && post.image}
                alt={post && post.title}
                className="mt-5 sm:mt-10 p-3 max-h-[600px] w-full object-cover"
            />
            <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl sm:max-w-4xl text-xs italic">
                <span>
                    {post &&
                        new Date(post.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long", // 'short' for abbreviated month name
                            year: "numeric",
                        })}
                </span>
                <span>
                    {post && (post.content.length / 1000).toFixed(0)} mins read
                </span>
            </div>
            <div
                className="p-3 mt-5 sm:mt-10 max-w-2xl sm:max-w-4xl mx-auto w-full post-content"
                dangerouslySetInnerHTML={{ __html: post && post.content }}
            ></div>
            <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
            </div>
            <CommentSection postId={post._id} />
            <div className="flex flex-col items-center flex-shrink-0 justify-center mb-5 p-3">
                <h1 className="text-xl mt-5 font-semibold font-sans">
                    Recent Article
                </h1>
                <div className="flex flex-col sm:flex-row gap-6">
                    {recentPost &&
                        recentPost.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                </div>
            </div>
        </main>
    );
};

export default PostPage;
