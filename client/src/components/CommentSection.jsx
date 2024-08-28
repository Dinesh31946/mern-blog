import { Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Comments from "./Comments";

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState("");
    const [commentPosting, setCommentPosting] = useState(false);
    const [comments, setComments] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCommentPosting(true);
        if (comment.length > 200) {
            toast.error("Comment cannot be longer that 200 characters!");
            return;
        }
        if (comment.trim() === " ") {
            toast.error("Comment cannot be empty!");
            return;
        }
        try {
            setCommentPosting(true);
            const res = await fetch(`/api/comment/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: comment,
                    postId: postId,
                    userId: currentUser._id,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Comment posted successfully!");
                setComment("");
                setCommentPosting(false);
                setComments([data, ...comments]);
            } else {
                toast.error("Failed to post comment!");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
            setCommentPosting(false);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments/${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    toast.error("Failed to fetch comments");
                    return;
                }
                setComments(data);
            } catch (error) {
                toast.error("Something went wrong");
                console.log(error);
            }
        };
        fetchComments();
    }, [postId]);

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                toast.error("You must be signed in to like a comment!");
                navigate("/sign-in");
                return;
            }

            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                console.log("data=> ", data);

                setComments(
                    comments.map((comment) =>
                        comment._id === commentId
                            ? {
                                  ...comment,
                                  likes: data.likes,
                                  numberOfLikes: data.likes.length,
                              }
                            : comment
                    )
                );
            } else {
                toast.error("Failed to like comment!");
            }
        } catch (error) {
            console.error("Error liking comment:", error);
            toast.error("Something went wrong while liking the comment.");
        }
    };

    return (
        <div className="max-w-2xl w-full mx-auto p-3">
            {currentUser ? (
                <div className=" flex items-center my-5 text-gray-500 text-sm gap-2">
                    <p>Signed in as: </p>
                    <img
                        className="h-5 w-5 object-cover rounded-full"
                        src={currentUser.profilePicture}
                        alt=""
                    />
                    <Link
                        to={"/dashboard?tab=profile"}
                        className="text-[rgb(79,149,188)] hover:underline"
                    >
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div className="text-sm text-teal-500 my-5 flex gap-1">
                    You must be sign in to comment
                    <Link
                        className="text-blue-500 hover:underline"
                        to={"/sign-in"}
                    >
                        Sign In
                    </Link>
                </div>
            )}
            {currentUser && (
                <form
                    className="border border-teal-500 rounded-md p-3"
                    onSubmit={handleSubmit}
                >
                    <Textarea
                        className="focus:outline-none focus:ring-0 focus:border-gray-400"
                        placeholder="Write a comment here..."
                        rows="4"
                        maxLength="250"
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className="flex justify-between items-center mt-5">
                        <p className="text-gray-500 text-xs ml-2">
                            {200 - comment.length} characters remaining
                        </p>
                        <Button
                            type="submit"
                            gradientDuoTone="purpleToBlue"
                            outline
                            disabled={commentPosting}
                        >
                            {commentPosting ? "Loading.." : "Submit"}
                        </Button>
                    </div>
                </form>
            )}
            {comments.length === 0 ? (
                <p className="text-sm my-5 mx-2 text-gray-500">
                    No comments yet
                </p>
            ) : (
                <>
                    <div className="text-sm my-5 flex items-center gap-1">
                        <p>Comments</p>
                        <div className=" border border-gray-400 py-0.5 px-2 rounded-sm">
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {comments.map((comment, index) => (
                        <Comments
                            comment={comment}
                            key={index}
                            onLike={handleLike}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default CommentSection;
