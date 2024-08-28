import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

const Comments = ({ comment, onLike }) => {
    const [userData, setUserData] = useState({});
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (res.ok) {
                    setUserData(data);
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.log(error);
            }
        };

        getUser();
    }, [comment]);

    return (
        <div className="flex p-4 border-b dark:border-gray-500 text-sm">
            <div className="flex-shirink-0 mr-3">
                <img
                    className="w-10 h-10 rounded-full bg-gray-200"
                    src={userData && userData.profilePicture}
                    alt=""
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="font-bold mr-1 text-xs truncate">
                        {userData ? `@${userData.username}` : "anonymous user"}
                    </span>
                    <span className="text-gray-500 text-xs">
                        {moment(userData.createdAt).fromNow()}
                    </span>
                </div>
                <p className="text-gray-500 pb-2">{comment.content}</p>
                <div className="flex items-center pt-2 gap-1">
                    <button
                        type="button"
                        onClick={() => onLike(comment._id)}
                        className={`text-gray-400 hover:text-blue-500 ${
                            currentUser &&
                            comment.likes.includes(currentUser._id) &&
                            "!text-blue-500"
                        } `}
                    >
                        <FaThumbsUp className="text-sm" />
                    </button>
                    <p className="text-xs text-gray-500">
                        {comment.numberOfLikes > 0 &&
                            comment.numberOfLikes +
                                " " +
                                (comment.numberOfLikes === 1
                                    ? "like"
                                    : "likes")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Comments;
