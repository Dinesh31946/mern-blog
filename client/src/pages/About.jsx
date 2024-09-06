const About = () => {
    return (
        <div>
            <div className="min-h-screen  my-20">
                <div className="max-w-6xl mx-auto p-3 text-center">
                    <h1 className="text-3xl font-semibold">
                        Welcome to
                        <span className="ml-4 px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            Technical
                        </span>
                        Dinesh
                    </h1>
                    <p className="text-xl text-gray-500 mt-4">
                        Your Gateway to Modern JavaScript Development
                    </p>
                </div>
                <div className="max-w-6xl mx-auto p-6 sm:p-3 md:p-6 text-start">
                    <section className="my-10">
                        <h2 className="text-3xl font-semibold text-blue-500">
                            Why JavaScript?
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            JavaScript is more than just a programming language;
                            it's the backbone of the modern web. From
                            interactive user interfaces to real-time server
                            communication, JavaScript is everywhere. If you're
                            passionate about building things that people use
                            every day, this is the place to be!
                        </p>
                    </section>

                    <section className="my-10">
                        <h2 className="text-3xl font-semibold text-blue-500">
                            What You'll Learn
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Each post will break down complex topics into
                            easy-to-understand explanations. We'll cover:
                        </p>
                        <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
                            <li className="my-2">
                                <span className="font-semibold text-gray-700">
                                    Frontend Mastery:
                                </span>{" "}
                                Learn how to build sleek, fast web interfaces
                                with frameworks like React.js, Vue.js, and
                                Angular.
                            </li>
                            <li className="my-2">
                                <span className="font-semibold text-gray-700">
                                    Backend Development:
                                </span>{" "}
                                Dive deep into building APIs and full-stack
                                applications using Node.js, Express.js, and
                                other backend technologies.
                            </li>
                            <li className="my-2">
                                <span className="font-semibold text-gray-700">
                                    JavaScript Fundamentals:
                                </span>{" "}
                                We'll go back to basics and ensure you have a
                                strong foundation in JavaScript, making learning
                                advanced frameworks easier.
                            </li>
                            <li className="my-2">
                                <span className="font-semibold text-gray-700">
                                    Real-World Projects:
                                </span>{" "}
                                Get hands-on experience by working on projects
                                that mimic real-world scenarios, from e-commerce
                                platforms to social networks.
                            </li>
                        </ul>
                    </section>

                    <section className="my-10">
                        <h2 className="text-3xl font-semibold text-blue-500">
                            For the Curious Minds
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            If you're a curious learner who loves experimenting
                            and discovering new tools and techniques, this blog
                            is for you. We’ll keep things fun with examples,
                            tips, and challenges that push your skills to the
                            next level.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;
