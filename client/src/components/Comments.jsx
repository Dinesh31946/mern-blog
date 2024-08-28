import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Textarea,
} from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Comments = ({ comment, onLike, onEdit, onDelete }) => {
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [showModal, setShowModal] = useState(false);

    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

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

    const handleEditClick = async () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editedContent }),
            });
            if (res.ok) {
                setIsEditing(false);
                onEdit(comment, editedContent);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDeleteComment = async () => {
        if (!currentUser) {
            navigate("/sign-in");
            return;
        }
        try {
            const res = await fetch(
                `/api/comment/deleteComment/${comment._id}`,
                {
                    method: "DELETE",
                }
            );
            if (res.ok) {
                setShowModal(false);
                onDelete(comment._id);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

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
                {isEditing ? (
                    <>
                        <Textarea
                            className="focus:outline-none focus:ring-0 focus:border-gray-400 mb-2"
                            placeholder="Write a comment here..."
                            rows="4"
                            maxLength="250"
                            onChange={(e) => setEditedContent(e.target.value)}
                            value={editedContent}
                        />
                        <div className="flex justify-end gap-2 text-xs">
                            <Button
                                type="button"
                                size="sm"
                                gradientDuoTone={"purpleToBlue"}
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                gradientDuoTone={"purpleToPink"}
                                outline
                                onClick={() => setIsEditing(false)}
                            >
                                Cancle
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
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
                            {currentUser &&
                                (currentUser._id === comment.userId ||
                                    currentUser.isAdmin) && (
                                    <>
                                        <button
                                            onClick={handleEditClick}
                                            type="button"
                                            className="text-xs text-gray-400 hover:text-blue-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            type="button"
                                            className="text-xs text-gray-400 hover:text-red-500"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                        </div>
                    </>
                )}
            </div>
            <Modal
                show={showModal}
                onClick={() => setShowModal(false)}
                popup
                size="md"
            >
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this comment?
                        </h3>
                        <div className="flex gap-5 justify-center">
                            <Button
                                color="failure"
                                onClick={() => handleDeleteComment()}
                            >
                                Yes, I am sure
                            </Button>
                            <Button
                                color="gray"
                                outline
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default Comments;
