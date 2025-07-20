import React from "react";

interface FooterLink {
  href: string;
  label: string;
}

interface FooterProps {
  className?: string;
  copyrightText?: string;
  links?: FooterLink[];
}

const Footer: React.FC<FooterProps> = ({
  className = "",
  copyrightText = "© 2025 FMovies. All rights reserved.",
  links = [
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Contact" },
  ],
}) => {
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ): void => {
    if (href === "#") {
      e.preventDefault();
      // Handle placeholder link clicks here
      console.log("Footer link clicked");
    }
  };

  return (
    <footer
      className={`bg-opacity-80 backdrop-blur-sm border-t border-gray-800 py-8 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
        <p>{copyrightText}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {links.map((link: FooterLink, index: number) => (
            <a
              key={`${link.label}-${index}`}
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors"
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
