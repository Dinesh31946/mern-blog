import { asyncThunkCreator } from "@reduxjs/toolkit";
import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/PostCard";

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        order: "desc",
        category: "",
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [categories, setCategories] = useState([]);
    console.log("posts=> ", posts);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const sortFromUrl = urlParams.get("order");
        const categoryFromUrl = urlParams.get("category");
        if (searchTermFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                order: sortFromUrl,
                category: categoryFromUrl,
            });
        }

        try {
            const fetchData = async () => {
                setLoading(true);
                const searchQuery = urlParams.toString();
                const res = await fetch(`/api/post/getposts?${searchQuery}`);
                if (!res.ok) {
                    setLoading(false);
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data.posts);
                    setLoading(false);
                    console.log("length=>", data.posts.length);

                    if (data.posts.length === 9) {
                        setShowMore(true);
                    }
                }
            };
            fetchData();
        } catch (error) {
            console.log(error.message);
        }
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === "searchTerm") {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }
        if (e.target.id === "sort") {
            const sort = e.target.value || "desc";
            setSidebarData({ ...sidebarData, order: sort });
        }
        if (e.target.id === "category") {
            const category = e.target.value || "";
            setSidebarData({ ...sidebarData, category: category });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("order", sidebarData.order);
        urlParams.set("category", sidebarData.category);
        const searchQuery = urlParams.toString();
        console.log("searchQuery=> ", searchQuery);

        navigate(`/search?${searchQuery}`);
    };
    // console.log("sidebarData=> ", sidebarData);

    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
            return;
        }
        if (res.ok) {
            const data = await res.json();
            setPosts([...posts, ...data.posts]);
            if (data.posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">
                            Search Term:
                        </label>
                        <TextInput
                            type="text"
                            placeholder="Search...."
                            id="searchTerm"
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort:</label>
                        <Select
                            onChange={handleChange}
                            defaultValue={sidebarData.order}
                            id="sort"
                        >
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Category:</label>
                        <Select
                            onChange={handleChange}
                            defaultValue={sidebarData.category}
                            id="category"
                        >
                            <option value="">All</option>
                            <option value="nodejs">Node.js</option>
                            <option value="reactjs">React.js</option>
                            <option value="nextjs">Next.js</option>
                            <option value="javascript">JavaScript</option>
                        </Select>
                    </div>
                    <Button
                        type="submit"
                        size={"sm"}
                        gradientDuoTone={"purpleToBlue"}
                        outline
                    >
                        Apply Filter
                    </Button>
                </form>
            </div>
            <div className="w-full ">
                {/* <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
                    Post results:
                </h1> */}
                <div className="p-7 mx-auto flex flex-wrap justify-center gap-4">
                    {!loading && posts.length === 0 && (
                        <p className="text-xl text-gray-500">No posts found.</p>
                    )}
                    {loading && (
                        <div className="mx-auto md:my-32 min-h-screen">
                            <Atom
                                color="#1ebbd9"
                                size="medium"
                                text=""
                                textColor=""
                            />
                        </div>
                    )}
                    {!loading &&
                        posts.length != 0 &&
                        posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className="text-teal-500 text-lg hover:underline w-full"
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
