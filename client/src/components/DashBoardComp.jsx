import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    HiAnnotation,
    HiArrowNarrowUp,
    HiDocumentText,
    HiOutlineUserGroup,
} from "react-icons/hi";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
} from "flowbite-react";
import { Link } from "react-router-dom";

const DashBoardComp = () => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(
                    "/api/user/getallusers?limit=5&order=desc"
                );
                const data = await res.json();
                console.log("data=>", data);

                if (res.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUser);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchPosts = async () => {
            try {
                const res = await fetch(
                    "/api/post/getposts?limit=5&order=desc"
                );
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPost);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchComments = async () => {
            try {
                const res = await fetch("/api/comment/getcomments?limit=5");
                const data = await res.json();
                console.log("commentsData=> ", data);

                if (res.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComment);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currentUser]);

    return (
        <div className="p-3 md:mx-auto">
            <div className="flex-wrap flex justify-center gap-4">
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">
                                Total Users
                            </h3>
                            <p className="text-2xl">{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className="bg-teal-600/80 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthUsers ? lastMonthUsers : 0}
                        </span>
                        <div className="text-gray-500">Last month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">
                                Total Comments
                            </h3>
                            <p className="text-2xl">{totalComments}</p>
                        </div>
                        <HiAnnotation className="bg-indigo-600/80 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthComments ? lastMonthComments : 0}
                        </span>
                        <div className="text-gray-500">Last month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">
                                Total posts
                            </h3>
                            <p className="text-2xl">{totalPosts}</p>
                        </div>
                        <HiDocumentText className="bg-lime-600/80 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthPosts ? lastMonthPosts : 0}
                        </span>
                        <div className="text-gray-500">Last month</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center ">
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-slate-800 border border-gray-300">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent users</h1>
                        <Button gradientDuoTone={"purpleToPink"} outline>
                            <Link to={"/dashboard?tab=users"}>See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>user image</TableHeadCell>
                            <TableHeadCell>username</TableHeadCell>
                        </TableHead>
                        {users &&
                            users.map((user) => (
                                <TableBody key={user._id} className="divide-y">
                                    <TableRow className="bg-white dark:border-gray-600 dark:bg-slate-800">
                                        <TableCell>
                                            <img
                                                src={user.profilePicture}
                                                alt="user"
                                                className="w-10 h-10 rounded-full bg-gray-500"
                                            />
                                        </TableCell>
                                        <TableCell>{user.username}</TableCell>
                                    </TableRow>
                                </TableBody>
                            ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-slate-800 border border-gray-300">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Comments</h1>
                        <Button gradientDuoTone={"purpleToPink"} outline>
                            <Link to={"/dashboard?tab=comments"}>See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>Comment Content</TableHeadCell>
                            <TableHeadCell>Likes</TableHeadCell>
                        </TableHead>
                        {comments &&
                            comments.map((comment) => (
                                <TableBody
                                    key={comment._id}
                                    className="divide-y"
                                >
                                    <TableRow className="bg-white dark:border-gray-600 dark:bg-slate-800">
                                        <TableCell className="w-96">
                                            <p className="line-clamp-2">
                                                {comment.content}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            {comment.numberOfLikes
                                                ? comment.numberOfLikes
                                                : 0}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-slate-800 border border-gray-300">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Posts</h1>
                        <Button gradientDuoTone={"purpleToPink"} outline>
                            <Link to={"/dashboard?tab=users"}>See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>Post image</TableHeadCell>
                            <TableHeadCell>Title</TableHeadCell>
                        </TableHead>
                        {posts &&
                            posts.map((post) => (
                                <TableBody key={post._id} className="divide-y">
                                    <TableRow className="bg-white dark:border-gray-600 dark:bg-slate-800">
                                        <TableCell>
                                            <img
                                                src={post.image}
                                                alt="user"
                                                className="w-16 h-15 rounded-md bg-gray-500"
                                            />
                                        </TableCell>
                                        <TableCell>{post.title}</TableCell>
                                    </TableRow>
                                </TableBody>
                            ))}
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default DashBoardComp;
