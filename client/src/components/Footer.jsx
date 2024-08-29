import {
    Footer,
    FooterCopyright,
    FooterDivider,
    FooterIcon,
    FooterLink,
    FooterLinkGroup,
    FooterTitle,
} from "flowbite-react";
import { Link } from "react-router-dom";
import {
    BsDribbble,
    BsFacebook,
    BsGithub,
    BsInstagram,
    BsTwitter,
} from "react-icons/bs";

const FooterComponent = () => {
    return (
        <Footer container className="border border-t-8 border-indigo-500/50">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link
                            to="/"
                            className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
                        >
                            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                                Dinesh's
                            </span>
                            Blog
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-6 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <FooterTitle title="About" />
                            <FooterLinkGroup col>
                                <FooterLink
                                    href="https://100jsprojects.com"
                                    target="_blank"
                                >
                                    100 JS Projects
                                </FooterLink>
                                <FooterLink href="/about" target="_blank">
                                    Dinesh's Blog
                                </FooterLink>
                            </FooterLinkGroup>
                        </div>
                        <div>
                            <FooterTitle title="Follow Us" />
                            <FooterLinkGroup col>
                                <FooterLink
                                    href="https://github.com/Dinesh31946"
                                    target="_blank"
                                >
                                    Github
                                </FooterLink>
                                <FooterLink href="#">Discord</FooterLink>
                            </FooterLinkGroup>
                        </div>
                        <div className="mt-2 sm:mt-0">
                            <FooterTitle title="Leagle" />
                            <FooterLinkGroup col>
                                <FooterLink href="#">Privacy Policy</FooterLink>
                                <FooterLink href="#">
                                    Terms &amp; Conditions
                                </FooterLink>
                            </FooterLinkGroup>
                        </div>
                    </div>
                </div>
                <FooterDivider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <FooterCopyright
                        href="#"
                        by="Dinesh's Blog"
                        year={new Date().getFullYear()}
                    />
                    <div className="flex gap-6 mt-2 sm:justify-center">
                        <FooterIcon
                            href="#"
                            icon={BsFacebook}
                            style={{ color: "#1877F2" }}
                        />
                        <FooterIcon
                            href="#"
                            icon={BsInstagram}
                            style={{ color: "#E4405F" }}
                        />
                        <FooterIcon
                            href="#"
                            icon={BsTwitter}
                            style={{ color: "#1DA1F2" }}
                        />
                        <FooterIcon
                            href="#"
                            icon={BsGithub}
                            style={{ color: "#333" }}
                        />
                        <FooterIcon
                            href="#"
                            icon={BsDribbble}
                            style={{ color: "#EA4C89" }}
                        />
                    </div>
                </div>
            </div>
        </Footer>
    );
};

export default FooterComponent;
