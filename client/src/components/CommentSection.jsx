import { Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState("");
    const [commentPosting, setCommentPosting] = useState(false);

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
            } else {
                toast.error("Failed to post comment!");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
            setCommentPosting(false);
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
        </div>
    );
};

export default CommentSection;
