import React from "react";

interface InformationSectionData {
  title: string;
  content: string;
}

interface InformationSectionProps {
  className?: string;
}

const InformationSection: React.FC<InformationSectionProps> = ({
  className = "",
}) => {
  const sections: InformationSectionData[] = [
    {
      title: "FMovies - Watch Free Movies Online | FMovies.to",
      content:
        "Cord-cutting is becoming a huge trend as people worldwide move away from costly cable TV and streaming subscriptions. FMovies provides an alternative by offering free movies and TV shows. However, the platform has faced numerous legal challenges due to copyright concerns.",
    },
    {
      title: "What is FMovies?",
      content:
        "FMovies is a file-sharing website that allows users to stream a vast selection of movies and TV shows for free. While many original domains have been blocked due to copyright enforcement, several mirror sites continue to operate, making it accessible worldwide.",
    },
    {
      title: "The History of FMovies",
      content:
        'Launched in 2016, FMovies quickly gained popularity but faced legal setbacks, including Google removing it from search results and lawsuits over piracy. Despite being labeled as a "notorious" piracy platform by U.S. authorities in 2018, FMovies continues to exist through alternative domains.',
    },
    {
      title: "How to Access FMovies from Anywhere?",
      content:
        "Due to regional restrictions, accessing FMovies can be challenging. A VPN can help bypass these restrictions by masking your IP and routing your connection through a different country where FMovies remains accessible. Additionally, VPNs enhance privacy and security.",
    },
    {
      title: "Pros of Using FMovies",
      content:
        "FMovies offers a vast selection of content, a user-friendly interface, and frequent updates with new movies and TV shows. While legal concerns remain, the platform is widely trusted by users, and precautions like VPN usage can improve safety.",
    },
    {
      title: "Can You Use FMovies on a Smart TV?",
      content:
        "Yes! While FMovies does not have an official app, you can access it through a web browser on your smart TV or streaming device like Firestick or Android TV.",
    },
    {
      title: "Should You Be Worried If You've Used FMovies?",
      content:
        "No, as copyright enforcement typically targets distribution rather than individual users. However, to ensure safety, it's recommended to use a VPN and regularly scan your device for malware.",
    },
    {
      title: "Disclaimer",
      content:
        "FMovies does not host any content itself. It merely provides links to content available on the internet. Users should be aware of the legal implications of streaming copyrighted material in their respective regions.",
    },
  ];

  return (
    <div className={`mt-8 sm:mt-12 lg:mt-16 ${className}`}>
      <div className="bg-gray-600 bg-opacity-60 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="grid gap-6 sm:gap-8 lg:gap-10">
            {sections.map((section: InformationSectionData, index: number) => (
              <section key={`${section.title}-${index}`} className="group">
                <div className="border-b border-gray-700/50 last:border-b-0 pb-6 sm:pb-8 lg:pb-10 last:pb-0">
                  <h2 className="text-lg sm:text-xl lg:text-2xl text-cyan-400 mb-3 sm:mb-4 lg:mb-5 font-semibold leading-tight group-hover:text-cyan-300 transition-colors duration-300">
                    {section.title}
                  </h2>
                  <p className="text-base lg:text-lg leading-relaxed text-gray-200 group-hover:text-gray-100 transition-colors duration-300">
                    {section.content}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationSection;
