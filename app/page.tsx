"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Mail, AtSign, X } from "lucide-react";
import partnersBase from "./data/partners";

const StudentChapterMap = dynamic(() => import("./components/StudentChapterMap"), { ssr: false });

const chapters = [
  {
    university: "University of Sheffield", city: "Sheffield", active: true, logo: "/logos/sheflogo.png", lat: 53.3811, lng: -1.4701,
    email: "WomensHealthUnion.soc@sheffield.ac.uk",
    instagram: "https://www.instagram.com/whu_sheffield/",
  },
];

// ---- Success stories. Put the images in public/ with the file names below.
// Wrap a phrase in **double asterisks** to show it in magenta.
const successStories = [
  {
    id: "endopad",
    title: "From Student Collaboration to Award-Winning Innovation",
    image: "/endopad.jpg",
    paragraphs: [
      "At a women's health hackathon organised by the founder of WHU, a group of students came together to explore challenges in women's healthcare. Their team chose to focus on **endometriosis**, developing an idea for a **diagnostic kit that uses biomarkers in menstrual blood** to help make diagnosis faster and more accessible.",
      "After winning the hackathon, the students took the initiative to develop their idea further, entering the University of Sheffield's entrepreneurship competition, where they went on to win the **Conceptual Idea Award**. The team continues to develop their concept, **EndoPad**, with the ambition of bringing their idea closer to reality.",
      "This is the kind of impact the WHU exists to create: **empowering students** to identify gaps in women's health, **collaborate across disciplines**, and turn ideas into meaningful innovation.",
      "The Women's Health Union's flagship hackathon will return through its student chapters, creating more opportunities for students to innovate and develop solutions to challenges in women's health. We hope to see many more success stories like this emerge!",
    ],
  },
  {
    id: "red-bank",
    title: "From Hackathon Networking to Professional Opportunity",
    image: "/red-bank1.jpeg",
    paragraphs: [
      "At a women's health hackathon organised by the founder of WHU, Biomedical Science student **Aditi Murthy** explored the potential of **menstrual blood biomarkers** for diagnosing conditions such as endometriosis.",
      "Following the hackathon, Aditi connected with one of the professional panellists from **Health Innovation Yorkshire & Humber**. Taking the initiative to build on this connection, she successfully **secured an internship** with the organisation, where she has gained valuable experience in health innovation, research and translating scientific ideas into real-world patient impact.",
      "Aditi has since continued exploring women's health innovation, developing **Red Bank**, a diagnostic concept investigating how menstrual blood biomarkers could support earlier detection of conditions including endometriosis and cardiovascular disease.",
      "Her journey highlights how **bringing students and professionals together** around women's health can spark new connections, support emerging ideas and open doors to opportunities beyond the university.",
    ],
  },
];

const magentaKeywords = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="font-bold text-[#B03577]">{part.slice(2, -2)}</strong>
    ) : (
      part
    )
  );

const InstagramIcon = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
);


export default function Home() {
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [activeStory, setActiveStory] = useState<(typeof successStories)[number] | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showAllPartners, setShowAllPartners] = useState(false);
  const [partnerPage, setPartnerPage] = useState(1);

  // Enquiry form state
  const [formData, setFormData] = useState({ name: "", email: "", reason: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert("Please fill in your name, email, and message.");
      return;
    }
    setIsSubmitting(true);
    try {
      const fullMessage = formData.reason
        ? `[Reason: ${formData.reason}]\n\n${formData.message}`
        : formData.message;

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: fullMessage,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Your enquiry has been sent!');
        setFormData({ name: "", email: "", reason: "", message: "" });
      } else {
        alert(result.error || 'Failed to send enquiry.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send enquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const partnersPerPage = 4;
  const totalPartnerPages = Math.ceil(partnersBase.length / partnersPerPage);

  const visiblePartners = partnersBase.slice(
    (partnerPage - 1) * partnersPerPage,
    partnerPage * partnersPerPage
  );

  const changePartnerPage = (page: number) => {
    setPartnerPage(page);

    document.getElementById("all-partners")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Smooth-scroll helper for nav links
  const scrollTo = useCallback((id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Open the full directory on the page holding this partner and scroll to their bio.
  const jumpToBio = (name: string) => {
    const index = partnersBase.findIndex((p) => p.name === name);
    if (index < 0) return;
    setShowAllPartners(true);
    setPartnerPage(Math.floor(index / partnersPerPage) + 1);
    setTimeout(() => {
      document.getElementById(`partner-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  // Bios can contain [text](url) links. Plain version (for hover cards) and clickable version (for the directory).
  const plainAbout = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  const richAbout = (text: string) =>
    text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
      const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      return m ? (
        <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#A82F6B] underline underline-offset-4 decoration-[#D45995]/40 hover:decoration-[#D45995]">
          {m[1]}
        </a>
      ) : (
        part
      );
    });

  // Duplicate for seamless marquee loop
  const marqueeItems = [...partnersBase, ...partnersBase];

  return (
    <main className="min-h-screen bg-[#F1EEF4] text-[#4A4045] font-sans selection:bg-[#E786B6] selection:text-white pb-24">

      {/* Navigation - Clean Modern Pill */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 rounded-2xl bg-white/90 backdrop-blur-md px-8 py-4 hidden md:flex justify-between items-center shadow-lg border border-black/5">
        <div className="font-extrabold text-2xl tracking-tighter text-[#D45995]">WHU</div>
        <div className="hidden md:flex gap-8 font-bold text-sm tracking-wide text-[#4A4045]">
          <a href="#about" onClick={scrollTo("about")} className="hover:text-[#D45995] transition-colors cursor-pointer">About</a>
          <a href="#chapters" onClick={scrollTo("chapters")} className="hover:text-[#D45995] transition-colors cursor-pointer">Chapters</a>
          <a href="#partners" onClick={scrollTo("partners")} className="hover:text-[#D45995] transition-colors cursor-pointer">Partners</a>
          <a href="#get-involved" onClick={scrollTo("get-involved")} className="hover:text-[#D45995] transition-colors cursor-pointer">Join Us</a>
          <a href="#contact" onClick={scrollTo("contact")} className="hover:text-[#D45995] transition-colors cursor-pointer">Contact</a>
        </div>
      </nav>

      {/* Shared gradient across Hero + About Us */}
      <div className="w-full bg-gradient-to-b from-[#D45995] from-20% to-[#F1EEF4] to-65%">

        {/* Section 1: Hero */}
        <section className="w-full min-h-[calc(100svh-18rem)] pt-14 pb-8 md:pt-48 md:pb-20 relative">          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-8 md:gap-12">
          {/* Left side: Logo & Motto */}
          <div className="md:w-1/2 flex flex-col items-center text-center md:translate-y-6 md:-translate-x-4">            <h1 className="font-black text-[8rem] md:text-[clamp(12rem,18vw,14rem)] leading-[0.85] tracking-tighter text-white drop-shadow-[0_6px_10px_rgba(90,20,55,0.25)] select-none">
            WHU
          </h1>
            <div className="text-white font-extrabold text-2xl sm:text-3xl md:text-2xl lg:text-4xl whitespace-nowrap leading-tight px-2 py-3 mt-6">
              Women's Health Union
            </div>
          </div>
          {/* Right side: 5% Stat Card with Yellow Highlight */}
          <div className="md:w-1/2 flex justify-center md:justify-end w-full">
            <div className="w-full max-w-lg bg-white text-[#1E1B1D] rounded-3xl p-6 md:p-10 shadow-xl border border-black/5 transform md:rotate-1 hover:rotate-0 transition-transform duration-300">
              <h3 className="font-bold leading-snug text-center md:text-left">
                <span className="font-black tracking-tight whitespace-nowrap block md:inline">
                  <span className="text-[#D45995] text-[length:min(7.2vw,2.25rem)] md:text-[length:min(calc(6.6vw_-_21px),3rem)]">Fewer than </span><span className="text-[#EAB308] text-[length:min(15vw,4rem)] md:text-[length:min(calc(8.25vw_-_26px),3.75rem)] max-md:leading-none">5%</span>
                </span>
                <span className="text-[#1E1B1D] font-extrabold leading-snug block mt-1 text-2xl md:text-3xl max-md:text-balance">
                  of UK universities have women’s health societies. <span className="text-[#D45995] whitespace-nowrap">Let’s change this!</span>
                </span>
              </h3>
            </div>
          </div>
        </div>
        </section>

        {/* About Us — card matching the stat card style */}
        <section
          id="about"
          className="scroll-mt-28 w-[90%] max-w-6xl mx-auto px-2 md:px-4 py-8 md:py-12"
        >
          <div className="w-full bg-white text-[#1E1B1D] rounded-3xl p-8 md:p-10 shadow-xl border border-black/5">
            <h2 className="font-extrabold text-2xl md:text-4xl tracking-tight mb-6 text-[#1E1B1D]">
              About Us
            </h2>
            <p className="text-[#4A4045] text-lg md:text-xl leading-relaxed max-w-none mb-5">
              The Women’s Health Union (WHU) is a national umbrella organisation helping students set up women’s health societies across the UK and connecting them with industry leaders in the field.
            </p>
            <p className="text-[#4A4045] text-lg md:text-xl leading-relaxed max-w-none">
              By building a student community around women’s health, we give students role models, visibility of careers in the field and a clear pathway into innovating in one of healthcare’s most underfunded areas.
            </p>
          </div>
        </section>

        {/* Give the gradient room to finish below the card */}
        <div className="h-16 md:h-24" aria-hidden="true" />


        {/* Your existing remaining sections */}
        <div className="w-[90%] max-w-6xl mx-auto space-y-16 [&>section]:scroll-mt-28">

          {/* Section 2: Student Chapters */}
          <section
            id="chapters"
            className="scroll-mt-28 px-2 md:px-4 py-10 md:py-14"
          >
            <header className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center justify-items-center mb-10 gap-6 pb-6">
              <div className="hidden md:block" aria-hidden="true" />
              <h2 className="font-extrabold text-2xl md:text-4xl text-[#1E1B1D] tracking-tight text-center">
                Our Student Chapters
              </h2>
              {/* Toggle Switch */}
              <div className="flex items-center bg-[#F1EEF4] rounded-full p-1 border border-black/5 md:justify-self-end">
                <button
                  onClick={() => setViewMode("list")}
                  aria-pressed={viewMode === "list"}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all cursor-pointer ${viewMode === "list" ? 'bg-[#D45995] text-white shadow-md' : 'text-[#7C6E76] hover:text-[#1E1B1D]'}`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  aria-pressed={viewMode === "map"}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all cursor-pointer ${viewMode === "map" ? 'bg-[#D45995] text-white shadow-md' : 'text-[#7C6E76] hover:text-[#1E1B1D]'}`}
                >
                  Map
                </button>
              </div>
            </header>

            {viewMode === "list" ? (
              <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
                {chapters.map((chapter, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedChapter(chapter)}
                    className="flex flex-col w-full md:w-[calc(50%-1rem)] p-8 bg-[#F1EEF4]/60 rounded-3xl border border-black/5 hover:border-[#D45995]/40 hover:bg-white hover:shadow-xl transition-all duration-300 text-left group cursor-pointer"
                    aria-label={`Open ${chapter.university} chapter details`}
                  >
                    {/* Logo container */}
                    <div className="w-full h-48 bg-white rounded-2xl flex items-center justify-center p-6 mb-6 shadow-sm group-hover:scale-[1.02] transition-transform">
                      {chapter.logo ? (
                        <img src={chapter.logo} alt={`${chapter.university} logo`} className="max-h-24 w-auto object-contain" />
                      ) : (
                        <span className="font-extrabold text-4xl text-[#D45995]">
                          {chapter.city.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#D45995] uppercase tracking-wider">{chapter.city}</span>
                    </div>
                    <h3 className="font-bold text-xl text-[#1E1B1D] group-hover:text-[#D45995] transition-colors leading-snug">
                      {chapter.university}
                    </h3>
                    <div className="mt-6 pt-4 border-t border-gray-200/80 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#1E1B1D]">
                      <span>See More</span>
                      <span className="group-hover:translate-x-1 transition-transform text-[#D45995] text-sm">→</span>
                    </div>
                  </button>
                ))}
                <p className="w-full text-center text-sm md:text-base font-semibold text-[#7C6E76] pt-2">
                  More student chapters coming soon
                </p>
              </div>
            ) : (
              <StudentChapterMap chapters={chapters} onChapterClick={setSelectedChapter} />
            )}
          </section>
        </div> {/* End shared gradient wrapper */}
        {/* Section 3: Partners — Infinite Marquee Strip */}
        {/* Section 3: Partners */}
        <section
          id="partners"
          className="scroll-mt-28 px-2 md:px-4 py-10 md:py-14 overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center gap-1.5 mb-10 text-center">
            <h2 className="font-extrabold text-2xl md:text-4xl text-[#1E1B1D] tracking-tight">
              We are proud to partner with
            </h2>
          </div>

          {/* Marquee wrapper */}
          <div
            className="relative"
          >
            <div className="marquee-track py-6">
              {marqueeItems.map((partner, i) => {

                return (
                  <div
                    key={`${partner.name}-${i}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Read ${partner.name}'s full bio`}
                    onClick={() => jumpToBio(partner.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        jumpToBio(partner.name);
                      }
                    }}
                    className="relative flex-shrink-0 mx-4 w-72 h-64 md:w-80 md:h-72 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300 group overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D45995] cursor-pointer"
                  >
                    {/* Full-card image */}
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D45995] to-[#8C3E73]" />
                    )}

                    {/* Gradient keeps the partner name readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    {/* About text revealed on hover or keyboard focus */}
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300" />

                    <div className="absolute inset-x-0 top-0 bottom-20 flex flex-col items-center justify-center gap-3 px-6 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm text-center leading-relaxed line-clamp-5">
                        {plainAbout(partner.about)}
                      </p>
                      {partner.about.length > 200 && (
                        <span className="text-white/90 text-xs font-semibold underline underline-offset-4 text-center">
                          Read full bio →
                        </span>
                      )}
                    </div>

                    {/* Name stays visible at the bottom */}
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-white font-bold text-lg md:text-xl leading-snug drop-shadow-md">
                        {partner.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Show / hide directory */}
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => {
                if (!showAllPartners) {
                  setPartnerPage(1);
                }

                setShowAllPartners((previous) => !previous);
              }}
              aria-expanded={showAllPartners}
              aria-controls="all-partners"
              className="inline-flex items-center gap-3 border-b-2 border-[#D45995] px-1 py-2 text-sm font-bold text-[#1E1B1D] hover:text-[#D45995] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D45995]"
            >
              {showAllPartners ? "Hide partners" : "Show all partners"}

              <span
                aria-hidden="true"
                className={`inline-block transition-transform duration-200 ${showAllPartners ? "rotate-180" : ""
                  }`}
              >
                ↓
              </span>
            </button>
          </div>

          {/* Expanded directory — maximum four partners per page */}
          <div
            id="all-partners"
            hidden={!showAllPartners}
            className="scroll-mt-28"
          >
            <div className="mt-12 divide-y divide-[#4A4045]/15">
              {visiblePartners.map((partner, index) => (
                <article
                  key={`${partner.name}-${partnerPage}-${index}`}
                  id={`partner-${partnersBase.indexOf(partner)}`}
                  className="scroll-mt-28 grid grid-cols-1 md:grid-cols-[15rem_minmax(0,1fr)] gap-6 md:gap-12 py-10"
                >
                  {/* Left: logo, name and links */}
                  <div className="flex flex-col items-start">
                    {partner.logo && (
                      <div className="w-full max-w-[15rem] h-36 flex items-center justify-start mb-5">
                        <img
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}

                    <h3 className="font-bold text-lg text-[#1E1B1D]">
                      {partner.name}
                    </h3>

                    <div className="flex flex-col items-start gap-2 mt-4 w-full min-w-0">
                      {partner.links
                        .filter((link) => link.url && link.url !== "#")
                        .map((link, linkIndex) => (
                          <a
                            key={`${link.url}-${linkIndex}`}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="max-w-full text-sm font-semibold text-[#A82F6B] underline underline-offset-4 decoration-[#D45995]/40 hover:decoration-[#D45995] transition-colors break-all"
                          >
                            {link.url
                              .replace(/^https?:\/\/(www\.)?/, "")
                              .replace(/\/$/, "")}
                            <span aria-hidden="true"> ↗</span>
                          </a>
                        ))}
                    </div>
                  </div>

                  {/* Right: description */}
                  <div className="md:pt-2 min-w-0">
                    <p className="text-base md:text-lg leading-relaxed text-[#4A4045] whitespace-pre-line">
                      {richAbout(partner.about)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPartnerPages > 1 && (
              <nav
                aria-label="Partner directory pages"
                className="flex flex-wrap items-center justify-center gap-3 mt-8"
              >
                <button
                  type="button"
                  onClick={() => changePartnerPage(partnerPage - 1)}
                  disabled={partnerPage === 1}
                  className="px-4 py-2 text-sm font-semibold text-[#4A4045] hover:text-[#A82F6B] disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPartnerPages }, (_, index) => {
                  const page = index + 1;
                  const isActive = partnerPage === page;

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => changePartnerPage(page)}
                      aria-label={`Go to partner page ${page}`}
                      aria-current={isActive ? "page" : undefined}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors cursor-pointer ${isActive
                        ? "bg-[#D45995] text-white"
                        : "text-[#4A4045] hover:bg-[#D45995]/10"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => changePartnerPage(partnerPage + 1)}
                  disabled={partnerPage === totalPartnerPages}
                  className="px-4 py-2 text-sm font-semibold text-[#4A4045] hover:text-[#A82F6B] disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next →
                </button>
              </nav>
            )}

            {partnersBase.length > 0 && (
              <p
                role="status"
                className="text-center text-sm text-[#7C6E76] mt-5"
              >
                Showing {(partnerPage - 1) * partnersPerPage + 1}–
                {Math.min(partnerPage * partnersPerPage, partnersBase.length)} of{" "}
                {partnersBase.length} partners
              </p>
            )}
          </div>
        </section>
        {/* Section: Join Us — Start a Chapter / Become a Partner */}
        <section
          id="get-involved"
          className="scroll-mt-28 px-2 md:px-4 py-10 md:py-14"
        >
          <div className="text-center mb-10">
            <h2 className="font-extrabold text-2xl md:text-4xl text-[#1E1B1D] tracking-tight">
              Join Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            {/* Start a Chapter */}
            <div className="flex flex-col gap-4 rounded-3xl bg-[linear-gradient(to_top,#F6D6E7_0%,#EBEBEE_70%)] border-2 border-[#D45995] text-[#1E1B1D] p-8 md:p-10 shadow-xl">
              <h3 className="font-black text-3xl md:text-5xl tracking-tight">
                <span className="bg-[#FDE047] text-[#1E1B1D] px-3 py-1 rounded-none box-decoration-clone leading-[1.5]">Start a Chapter</span>
              </h3>
              <p className="text-lg md:text-xl font-semibold leading-snug">
                Bring <span className="text-[#B03577]">women’s health</span> to your university, with everything ready so you’re not starting from zero.
              </p>
              <div className="h-px bg-black/15 my-1" />
              <div className="rounded-2xl bg-white border border-black/5 p-5 md:p-6 flex flex-col gap-4">
                  <p className="font-extrabold text-xl md:text-2xl text-[#B03577] tracking-tight">
                  Every chapter gets:
                </p>
                <ul className="space-y-3 text-base md:text-lg">
                  {[
                    <><strong className="text-[#B03577]">The WHU Chapter Starter Kit:</strong> branded templates, trackers and everything you need to launch a society</>,
                    <>Ready-made event formats, including a full <strong className="text-[#B03577]">hackathon guide</strong></>,
                    <>A <strong className="text-[#B03577]">monthly newsletter</strong> with opportunities in women’s health</>,
                    <>Direct connections to <strong className="text-[#B03577]">partners</strong> for talks and collaborations</>,
                    <>A <strong className="text-[#B03577]">national network</strong> of chapters to collaborate and run events with</>,
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#B03577] text-white text-sm font-black">✓</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Become a Partner */}
            <div className="flex flex-col gap-4 rounded-3xl bg-[linear-gradient(to_top,#F6D6E7_0%,#EBEBEE_70%)] border-2 border-[#D45995] text-[#1E1B1D] p-8 md:p-10 shadow-xl">
              <h3 className="font-black text-3xl md:text-5xl tracking-tight">
                <span className="bg-[#FDE047] text-[#1E1B1D] px-3 py-1 rounded-none box-decoration-clone leading-[1.5]">Become a Partner</span>
              </h3>
              <p className="text-lg md:text-xl font-semibold leading-snug">
                Join a network of <span className="text-[#B03577]">women’s health professionals, founders and advocates</span> inspiring future innovators.
              </p>
              <div className="h-px bg-black/15 my-1" />
              <p className="text-base md:text-lg leading-snug">
                Be a role model for students exploring careers in women’s health. There are <strong className="text-[#B03577]">three ways to get involved</strong>, depending on what suits you:
              </p>
              <ul className="space-y-3 text-base md:text-lg">
                {[
                  <><strong className="text-[#B03577]">Written:</strong> share your thoughts and experiences in our newsletter, or answer student questions</>,
                  <><strong className="text-[#B03577]">Recorded:</strong> contribute to our student-led content, such as an interviews or podcast conversations</>,
                  <><strong className="text-[#B03577]">Live:</strong> join an online panel or webinar, or attend student events in person</>,
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#B03577]" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 rounded-2xl bg-white border border-black/5 p-5 text-base md:text-lg leading-snug">
                <strong className="text-[#B03577]">What you get:</strong> a listing on the WHU website, visibility across our student chapters, and the chance to meet motivated students. <strong className="text-[#B03577]">There is no minimum commitment.</strong>
              </div>
            </div>

          </div>

          <p className="text-center text-2xl md:text-3xl font-bold text-[#1E1B1D] mt-10">
            Interested in either?{" "}
            <a
              href="#contact"
              onClick={scrollTo("contact")}
              className="text-[#B03577] underline underline-offset-4 decoration-[#B03577]/40 hover:decoration-[#B03577] cursor-pointer"
            >
              Get in touch ↓
            </a>
          </p>
        </section>

        {/* Section: Success Stories */}
        <section id="success-stories" className="scroll-mt-28 px-2 md:px-4 py-10 md:py-14">
          <div className="text-center mb-10">
            <h2 className="font-extrabold text-2xl md:text-4xl text-[#1E1B1D] tracking-tight">
              Success Stories
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
            {successStories.map((story) => (
              <div
                key={story.id}
                role="button"
                tabIndex={0}
                aria-label={`Read: ${story.title}`}
                onClick={() => setActiveStory(story)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveStory(story);
                  }
                }}
                className="relative w-full md:w-[calc(50%-1rem)] h-72 md:h-80 rounded-2xl bg-gradient-to-br from-[#D45995] to-[#8C3E73] shadow-md hover:shadow-xl transition-shadow duration-300 group overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D45995]"
              >
                <img
                  src={story.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[#D45995]/90 flex items-center justify-center p-8 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-extrabold text-xl md:text-2xl text-center leading-snug">
                    {story.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Contact — full width, one row */}
        <section
          id="contact"
          className="scroll-mt-28 px-2 md:px-4 py-10 md:py-14 border-t border-[#4A4045]/15"
        >
          <div className="mb-10 pb-6 border-b border-gray-100">
            <h2 className="font-extrabold text-2xl md:text-4xl text-[#1E1B1D] tracking-tight">
              Interested? Get in touch
            </h2>
            <p className="mt-3 text-base md:text-lg text-[#4A4045] max-w-2xl">
              Want to start a chapter, become a partner, or just find out more? Send us a message and we’ll get back to you.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-10">

            {/* Left: Socials */}
            <div className="md:w-1/3 flex flex-col gap-4 order-2 md:order-1">

              <a
                href="https://www.linkedin.com/company/women’s-health-union/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#F1EEF4]/60 border border-black/5 hover:border-[#D45995]/40 hover:bg-white hover:shadow-md transition-all text-[#1E1B1D] group"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-black/5 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-2 group-hover:scale-105 transition-transform">
                  <img
                    src="/logos/LI-In-Bug.png"
                    alt="LinkedIn"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C6E76]">LinkedIn</span>
                  <span className="font-bold text-sm">Women's Health Union</span>
                </div>
              </a>

              <a
                href="mailto:join.whu.uk@gmail.com"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#F1EEF4]/60 border border-black/5 hover:border-[#D45995]/40 hover:bg-white hover:shadow-md transition-all text-[#1E1B1D] group"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-black/5 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-2 group-hover:scale-105 transition-transform">
                  <img
                    src="/logos/mail.png"
                    alt="Email"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C6E76]">Email</span>
                  <span className="font-bold text-sm truncate">join.whu.uk@gmail.com</span>
                </div>
              </a>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-200 self-stretch mx-2 md:order-2" />

            {/* Right: Contact Form */}
            <div className="flex-1 order-1 md:order-3">
              <p className="font-bold text-xs uppercase tracking-widest text-[#7C6E76] mb-4">Send an Enquiry</p>
              <form className="flex flex-col gap-4" onSubmit={handleEnquirySubmit}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E1B1D]">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-5 py-3 rounded-xl bg-[#F1EEF4]/60 border border-black/10 outline-none font-medium text-sm text-[#1E1B1D] placeholder-[#A6979F] focus:border-[#D45995] focus:bg-white focus:ring-2 focus:ring-[#D45995]/20 transition-all"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E1B1D]">Your Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-5 py-3 rounded-xl bg-[#F1EEF4]/60 border border-black/10 outline-none font-medium text-sm text-[#1E1B1D] placeholder-[#A6979F] focus:border-[#D45995] focus:bg-white focus:ring-2 focus:ring-[#D45995]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1E1B1D]">What's your enquiry about?</label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-[#F1EEF4]/60 border border-black/10 outline-none font-medium text-sm text-[#1E1B1D] focus:border-[#D45995] focus:bg-white focus:ring-2 focus:ring-[#D45995]/20 transition-all cursor-pointer"
                  >
                    <option value="" className="text-[#A6979F]">Select reason (optional)</option>
                    <option value="I want to start a chapter">I want to start a chapter</option>
                    <option value="I want to become a partner">I want to become a partner</option>
                    <option value="I want to learn more">I want to learn more</option>
                    <option value="Something else">Something else</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more..."
                    className="w-full px-5 py-3 rounded-xl bg-[#F1EEF4]/60 border border-black/10 outline-none font-medium text-sm text-[#1E1B1D] placeholder-[#A6979F] focus:border-[#D45995] focus:bg-white focus:ring-2 focus:ring-[#D45995]/20 transition-all resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-start px-8 py-3.5 rounded-xl bg-[#D45995] hover:bg-[#b83e7a] disabled:opacity-50 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer mt-2 flex items-center gap-2"
                >
                  {isSubmitting ? "Sending..." : "Send message →"}
                </button>
              </form>
            </div>

          </div>
        </section>

      </div>

      {/* Chapter Modal */}
      {
        selectedChapter && (
          <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedChapter(null)}
          >
            <div
              className="modal-pop w-full max-w-5xl md:min-h-[540px] bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-black/10 relative flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#F1EEF4] hover:bg-[#e4dfe7] text-[#1E1B1D] flex items-center justify-center transition-colors cursor-pointer z-10"
                onClick={() => setSelectedChapter(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {/* Left Column: Vertical Title */}
              <div className="w-full md:w-36 flex items-center justify-center relative md:border-r border-gray-100 md:mr-10 pb-6 md:pb-0 mb-6 md:mb-0 border-b md:border-b-0 flex-shrink-0">
                <h2 className="md:absolute md:-rotate-90 md:origin-center text-[#D45995] font-extrabold text-3xl md:text-5xl whitespace-nowrap tracking-tight md:w-[460px] text-center md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                  WHU × {selectedChapter.city}
                </h2>
              </div>

              {/* Right Column */}
              <div className="flex-1 flex flex-col gap-6 pt-2 min-w-0">

                {/* University name */}
                <div>
                  <h3 className="font-extrabold text-2xl md:text-4xl text-[#1E1B1D] pr-12">{selectedChapter.university}</h3>
                </div>

                {/* Leadership committee + Instagram */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col justify-center gap-2 p-6 rounded-2xl bg-[#F1EEF4]/60 border border-black/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D45995]">Contact</span>
                    <span className="font-extrabold text-xl text-[#1E1B1D] leading-tight">Leadership Committee</span>
                    <a
                      href={`mailto:${selectedChapter.email}`}
                      className="text-sm font-semibold text-[#D45995] hover:underline break-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {selectedChapter.email}
                    </a>
                  </div>
                  {selectedChapter.instagram && (
                    <a
                      href={selectedChapter.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${selectedChapter.university} on Instagram`}
                      className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-[#F1EEF4]/60 border border-black/5 text-[#1E1B1D] hover:bg-[#D45995] hover:text-white hover:shadow-md transition-all duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <InstagramIcon size={64} />
                      <span className="text-sm font-bold">Follow on Instagram</span>
                    </a>
                  )}
                </div>

              </div>
            </div>
          </div>
        )
      }

      {/* Success Story Modal */}
      {activeStory && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
          onClick={() => setActiveStory(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeStory.title}
            className="modal-pop w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-black/10 relative flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-[#F1EEF4] text-[#1E1B1D] flex items-center justify-center transition-colors cursor-pointer z-10 shadow"
              onClick={() => setActiveStory(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <div className="md:w-2/5 flex-shrink-0 h-56 md:h-auto relative bg-gradient-to-br from-[#D45995] to-[#8C3E73] md:rounded-l-3xl rounded-t-3xl md:rounded-tr-none overflow-hidden">
              <img
                src={activeStory.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
            <div className="flex-1 p-6 md:p-10 flex flex-col gap-4">
              <h3 className="font-extrabold text-2xl md:text-3xl text-[#1E1B1D] leading-tight pr-10">
                {activeStory.title}
              </h3>
              {activeStory.paragraphs.map((para, i) => (
                <p key={i} className="text-base md:text-lg text-[#4A4045] leading-relaxed">
                  {magentaKeywords(para)}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

    </main >
  );
}
