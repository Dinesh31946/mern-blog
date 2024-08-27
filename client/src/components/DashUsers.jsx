import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { shallowEqual, useSelector } from "react-redux";
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
} from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { ImCheckmark, ImCross } from "react-icons/im";

const DashUsers = () => {
    const { currentUser } = useSelector((state) => state.user, shallowEqual);

    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState("");

    useEffect(() => {
        const fetchusers = async () => {
            try {
                const res = await fetch(`/api/user/getallusers`);
                const data = await res.json();
                console.log(data);

                if (res.ok) {
                    setUsers(data.users);
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                toast.error("Something went wrong, please refresh the page");
                console.log(error.message);
            }
        };

        if (currentUser.isAdmin) {
            fetchusers();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(
                `/api/user/getallusers?startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error("Something went wrong, please try again later.");
            } else {
                toast.success("User deleted successfully");
                setUsers((prev) =>
                    prev.filter((user) => user._id !== userIdToDelete)
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="table-auto md:w-full overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <TableHead>
                            <TableHeadCell>Date created</TableHeadCell>
                            <TableHeadCell>User Image</TableHeadCell>
                            <TableHeadCell>Username</TableHeadCell>
                            <TableHeadCell>Email</TableHeadCell>
                            <TableHeadCell>admin</TableHeadCell>
                            <TableHeadCell>Delete</TableHeadCell>
                        </TableHead>
                        {users.map((user, index) => (
                            <TableBody key={index} className="divide-y">
                                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-700">
                                    <TableCell>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "long", // 'short' for abbreviated month name
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900 dark:text-white">
                                        {user.username}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.isAdmin ? (
                                            <ImCheckmark color="green" />
                                        ) : (
                                            <ImCross color="red" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setUserIdToDelete(user._id);
                                            }}
                                            className="font-medium text-red-500 hover:underline cursor-pointer"
                                        >
                                            Delete
                                        </span>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            className="w-full text-teal-500 self-center text-sm py-7"
                            onClick={handleShowMore}
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>No users added</p>
            )}
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
                            Are you sure you want to delete this account?
                        </h3>
                        <div className="flex gap-5 justify-center">
                            <Button
                                color="failure"
                                onClick={() => handleDeleteUser()}
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

export default DashUsers;
