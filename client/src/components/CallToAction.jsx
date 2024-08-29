import { Button } from "flowbite-react";

const CallToAction = () => {
    return (
        <div className="flex flex-col sm:flex-row p-3 border-4 border-indigo-500/50 justify-center items-center text-center rounded-tl-3xl rounded-br-3xl">
            <div className="flex-1 justify-center flex flex-col">
                <h2 className="text-2xl font-semibold">
                    Want to learn more about JavaScript?
                </h2>
                <p className="text-gray-500 my-2">
                    Checkout these resources with JavaScript Projects{" "}
                </p>
                <Button
                    gradientDuoTone="purpleToPink"
                    className="rounded-tl-xl rounded-bl-none rounded-tr-none rounded-br-xl"
                >
                    <a
                        href="https://github.com/Dinesh31946"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        100 JavaScript Projects
                    </a>
                </Button>
            </div>
            <div className="flex-1 p-7">
                <img src="/callToActionImg.webp" alt="image" />
            </div>
        </div>
    );
};

export default CallToAction;
