import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const Home = () => {
    const [posts, setPosts] = useState();

    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch("/api/post/getposts");
            const data = await res.json();
            if (res.ok) {
                setPosts(data.posts);
            }
        };
        fetchPost();
    }, []);

    return (
        <div>
            <div className="flex flex-col gap-6 px-5 p-28  max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold lg:text-6xl capitalize">
                    Welcome to my blog
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm dark:text-gray-300/70">
                    Welcome to my blog! Explore a treasure trove of insights,
                    tips, and trends in technology and lifestyle. Join me on
                    this exciting journey and spark your curiosity with every
                    read!
                </p>
                <Link
                    to={"/search"}
                    className="text-xm sm:text-sm text-teal-500 font-bold hover:underline capitalize"
                >
                    View All post
                </Link>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-violet-800">
                <CallToAction />
            </div>
            {/* Post section */}
            <div className="max-w-6xl mx-auto justify-center p-5 flex flex-col gap-8 py-7">
                {posts && posts.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-semibold w-full text-center">
                            Recent Posts
                        </h2>
                        <div className="flex flex-wrap gap-7 justify-center">
                            {posts.map((post, index) => (
                                <PostCard key={index} post={post} />
                            ))}
                        </div>
                        <Link
                            to={"/search"}
                            className="text-xm sm:text-sm text-center text-teal-500 font-bold hover:underline capitalize"
                        >
                            View All post
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
