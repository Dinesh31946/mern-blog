import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    TextInput,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../src/firebase";
import { toast } from "react-toastify";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
    deleteUserFailure,
    deleteUSerStart,
    deleteUserSuccess,
    updateFailure,
    updateStart,
    updateSuccess,
    userSignoutFailure,
    userSignoutStart,
    userSignoutSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const DashProfile = () => {
    const { currentUser, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] =
        useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formData, setFormData] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [showModel, setShowModel] = useState(false);
    const [showSignoutModal, setShowSignoutModal] = useState(false);

    const dispatch = useDispatch();
    const filePickerRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage(imageFile);
        }
    }, [imageFile]);

    const uploadImage = async () => {
        setImageFileUploading(true);

        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, `user/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        try {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageFileUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageFileUploadError(
                        "Could not upload image (file must be less than 2 MB)"
                    );
                    toast.error(
                        "Could not upload image (file must be less than 2 MB)"
                    );
                    setImageFileUploadProgress(null);
                    setImageFile(null);
                    setImageFileUrl(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            setImageFileUrl(downloadURL);
                            setFormData({
                                ...formData,
                                profilePicture: downloadURL,
                            });
                            setImageFileUploadError(null);
                            setImageFileUploadProgress(null);
                            setImageFile(null);
                            setImageFileUploading(false);
                            toast.success("Image uploaded successfully!");
                        }
                    );
                }
            );
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleChange = async (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(formData).length === 0) {
            toast.error("No changes detected!");
            return;
        }
        if (imageFileUploading) {
            return;
        }

        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                dispatch(updateFailure(data.message));
                return;
            } else {
                toast.success(data.message);
                dispatch(updateSuccess(data));
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
        }
    };

    const handleDeleteUser = async () => {
        setShowModel(false);
        try {
            dispatch(deleteUSerStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
                toast.error("Something went wrong, please try again later.");
            } else {
                toast.success(data);
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignout = async () => {
        setShowSignoutModal(false);
        try {
            dispatch(userSignoutStart());
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error("Something went wrong, please try again later.");
                dispatch(userSignoutFailure(data.message));
                return;
            } else {
                toast.success(data.message);
                dispatch(userSignoutSuccess(data));
            }
        } catch (error) {
            dispatch(userSignoutFailure(error.message));
        }
    };

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                />
                <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                    {imageFileUploadProgress && (
                        <CircularProgressbar
                            value={imageFileUploadProgress}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62, 152, 199, ${
                                        imageFileUploadProgress / 100
                                    })`,
                                },
                            }}
                        />
                    )}
                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt="user avatar"
                        className={`rounded-full w-full h-full border-8 object-cover border-[lightgray] ${
                            imageFileUploadProgress &&
                            imageFileUploadProgress < 100 &&
                            "opacity-60"
                        } `}
                        onClick={() => filePickerRef.current.click()}
                    />
                </div>
                <TextInput
                    type="text"
                    id="username"
                    placeholder="Username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput
                    type="email"
                    id="email"
                    placeholder="Email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={handleChange}
                />
                <Button type="submit" gradientDuoTone="purpleToBlue" outline>
                    {loading || imageFileUploading ? "Loading..." : "Update"}
                </Button>
                {currentUser.isAdmin && (
                    <Link to={"/create-post"}>
                        <Button
                            type="button"
                            gradientDuoTone="purpleToPink"
                            className="w-full"
                        >
                            Create a Post
                        </Button>
                    </Link>
                )}
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span
                    onClick={() => setShowModel(true)}
                    className="cursor-pointer"
                >
                    Delete Account
                </span>
                <span
                    onClick={() => setShowSignoutModal(true)}
                    className="cursor-pointer"
                >
                    Sign Out
                </span>
            </div>
            <Modal
                show={showModel}
                onClick={() => setShowModel(false)}
                popup
                size="md"
            >
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete your account?
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
                                onClick={() => setShowModel(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                show={showSignoutModal}
                onClick={() => setShowSignoutModal(false)}
                popup
                size="md"
            >
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to signout?
                        </h3>
                        <div className="flex gap-5 justify-center">
                            <Button
                                color="failure"
                                onClick={() => handleSignout()}
                            >
                                Yes, I am sure
                            </Button>
                            <Button
                                color="gray"
                                outline
                                onClick={() => setShowSignoutModal(false)}
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

export default DashProfile;
