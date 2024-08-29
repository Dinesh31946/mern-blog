import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
    return (
        <div className="group relative w-full sm:w-[350px] border  h-[360px] overflow-hidden rounded-xl mt-5 hover:border-indigo-500/50 hover:border-4 border-gray-300 shadow-lg">
            <Link to={`/post/${post.slug}`}>
                <img
                    className="h-[220px] w-full object-cover group-hover:h-[160px] transition-all duration-300 z-20"
                    src={post.image}
                    alt={post.title}
                />
            </Link>
            <div className="p-3 flex flex-col gap-2">
                <p className="text-lg font-semibold line-clamp-2">
                    {post.title}
                </p>
                <span className="italic text-sm">
                    <Button color="gray" pill size="xs" className="italic">
                        {post.category}
                    </Button>
                </span>
                <Link
                    to={`/post/${post.slug}`}
                    className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border transition-all duration-300 text-center py-2 rounded-md !rouded-tl-none mb-5 mx-5
                    bg-gradient-to-r from-purple-400 via-blue-500 to-blue-700  p-4 text-white font-semibold"
                >
                    Read Article
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
