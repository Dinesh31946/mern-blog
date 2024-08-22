import { Button, TextInput} from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../src/firebase';
import { toast } from 'react-toastify'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';


const DashProfile = () => {

    const { currentUser } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formData, setFormData] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);

    const dispatch = useDispatch();
    const filePickerRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    }

    useEffect(() => {
        if(imageFile){
            uploadImage(imageFile);
        }
    }, [imageFile]);

    const uploadImage= async () => {

        setImageFileUploading(true);

        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        try {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageFileUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageFileUploadError("Could not upload image (file must be less than 2 MB)");
                    toast.error("Could not upload image (file must be less than 2 MB)");
                    setImageFileUploadProgress(null);
                    setImageFile(null);
                    setImageFileUrl(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageFileUrl(downloadURL);
                        setFormData({...formData, profilePicture: downloadURL });
                        setImageFileUploadError(null);
                        setImageFileUploadProgress(null);
                        setImageFile(null);
                        setImageFileUploading(false);
                        toast.success("Image uploaded successfully!");
                    });
                }
            );
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleChange = async (e) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(Object.keys(formData).length === 0) {
            toast.error("No changes detected!");
            return;
        }
        if(imageFileUploading){
            return;
        }

        try {

            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            console.log("data=> ", data);
            
            if(!res.ok){
                toast.error(data.message);
                dispatch(updateFailure(data.message));
                return;
            }else{
                toast.success(data.message);
                dispatch(updateSuccess(data));
            }

        } catch (error) {
            dispatch(updateError(error.message));
        }

    }
    
    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                    {
                        imageFileUploadProgress && (
                            <CircularProgressbar 
                                value={imageFileUploadProgress} 
                                text={`${imageFileUploadProgress}%`} 
                                strokeWidth={5}
                                styles={{ 
                                    root:{
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                    },
                                    path:{
                                        stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                                    }
                                 }}
                            />
                        )
                    }
                    <img
                        src={ imageFileUrl || currentUser.profilePicture}
                        alt="user avatar"
                        className={`rounded-full w-full h-full border-8 object-cover border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'} `}
                        onClick={() => filePickerRef.current.click()}
                    />
                </div>
                <TextInput 
                    type='text' 
                    id='username' 
                    placeholder='Username' 
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput 
                    type='email' 
                    id='email' 
                    placeholder='Email' 
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput 
                    type='password' 
                    id='password' 
                    placeholder='Password'
                    onChange={handleChange}
                />
                <Button type='submit' gradientDuoTone="purpleToBlue" outline>
                    Update
                </Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    )
}

export default DashProfile
