/**
 * partners.ts
 * ───────────
 * Single source of truth for all partner profiles displayed on the site.
 * Each entry has:
 *   name    – display name of the partner / organisation
 *   about   – one-sentence blurb shown on hover in the marquee
 *   logo    – path relative to /public (null = show name pill instead)
 *   links   – labelled URLs (website, instagram, linkedin, etc.)
 */

export interface PartnerProfile {
  name: string;
  about: string;
  logo: string | null;
  links: { label: string; url: string }[];
}

const partners: PartnerProfile[] = [
  {
    name: "Katy Jackson",
    about: "Katy is Clinical Director of Women’s Health at Voy, a global health technology company, where she leads the UK’s largest female hormonal health division, encompassing Voy Menopause and Menopause Care. She brings extensive clinical and operational leadership experience, having previously served as Chief Clinical Officer at Newson Health and held senior NHS roles, including Chief Operating Officer. A passionate advocate for women’s health, Katy also mentors young women in leadership, helping them build confidence and develop their careers.",
    logo: "/logos/katyjackson.jpg",
    links: [
      { label: "Website", url: "#" },
    ],
  },
  {
    name: "Imogen Clarke",
    about: "Imogen is the Director for HerSay.Uk, building a community to help close the gender health gap. Working across women's health for 5+ years, with a strong qualitative research background (MRes Security, Conflict and Human Rights & BA Anthropology), Imogen’s goal is to use these ethical research skills to help close the gender data gap across a whole range of sectors, starting with health.  Imogen is also the Partnerships & Growth Manager at Micrima. Here she is focused on relationship building across the private healthcare and employer landscape for a CE marked breast medical device. Previously, she led high-value partners for W Group's global Women's Health Week conferences and accelerators. Building a valuable global network focused on accelerating Femtech.",
    logo: "/logos/imogenclarke.jpg",
    links: [
      { label: "Website", url: "#" },
      { label: "LinkedIn", url: "#" },
    ],
  },
  {
    name: "HerSay",
    about: "HerSay is focused on reducing the gender health gap. We host educational talks & wellness activities to bring women together and open up conversation around some of the biggest gaps in women's health and lived experiences.\n\nWomen all over the UK can also sign up to express interest in participating in research, which is fed back into products, spaces and businesses who want to design with women in mind.\n\nFollow on Instagram [@hersay.uk](https://www.instagram.com/hersay.uk/) or LinkedIn [HerSay.uk](https://www.linkedin.com/company/hersay-uk/)",
    logo: "/logos/hersay.png",
    links: [
      { label: "Instagram", url: "https://www.instagram.com/hersay.uk/" },
      { label: "LinkedIn", url: "https://www.linkedin.com/company/hersay-uk/" },
    ],
  },
  {
    name: "Anya Sizer",
    about: "Anya is a longstanding women’s health campaigner with decades of experience in fertility, reproductive health and family policy. A former Fertility Network UK regional representative and fertility-in-the-workplace lead, she has championed equitable access to fertility treatment and supported people experiencing infertility. She is a board member of the Human Fertilisation and Embryology Authority (HFEA) and Vice Chair of the Fabian Women’s Network Executive Committee, working to influence policy and improve outcomes in women’s health.",
    logo: "/logos/anyasizer.jpg",
    links: [
      { label: "Website", url: "#" },
      { label: "Instagram", url: "#" },
    ],
  },
  {
    name: "Nina Larsen",
    about: "Nina Elisabeth Larsen is a women’s health advocate and entrepreneur committed to improving maternal health and closing the gender health gap. Her work focuses on raising awareness of women’s unmet health needs, championing innovation in healthcare, and driving greater recognition of maternal mental health and perinatal wellbeing.",
    logo: "/logos/ninalarsen.png",
    links: [
      { label: "Website", url: "#" },
    ],
  },
  {
    name: "Omaia",
    about: "Omaia is a women’s health technology company focused on emotional wellbeing in pregnancy and early parenthood. Its personalised digital platform provides evidence-informed emotional and practical support throughout the family-building journey, from fertility and pregnancy to birth and early parenthood. By combining technology with clinical expertise, Omaia aims to make maternal wellbeing an integral part of maternity care, ensuring families feel supported, understood and less alone.",
    logo: "/logos/omaia.png",
    links: [
      { label: "Website", url: "#" },
      { label: "Instagram", url: "#" },
    ],
  },
  {
    name: "Laura Sullivan",
    about: "Laura Sullivan is a women’s health advocate and researcher with an MSc in Psychology, specialising in women’s experiences of identity across the menstrual cycle. She is co-founder and lead researcher of We Are Together, an online platform supporting couples through miscarriage and early pregnancy loss. Her work centres on lived experience, inclusive support and addressing gaps in care for women and their families.",
    logo: "/logos/laurasullivan.png",
    links: [
      { label: "Website", url: "#" },
      { label: "Instagram", url: "#" },
    ],
  },
  {
    name: "Sophie Sulehria",
    about: "Sophie Sulehria is a journalist, presenter and women’s health advocate with over 20 years of experience in media, including a decade at the BBC. She champions women’s health through journalism, podcasting and digital storytelling, with a particular focus on menopause, fertility and women’s rights in the workplace. She creates video content and presents The Heat Seat podcast for Menopause Mandate, helping to raise awareness, amplify women’s voices and make expert insights accessible.",
    logo: "/logos/sophiesulehria.png",
    links: [
      { label: "Website", url: "#" },
      { label: "LinkedIn", url: "#" },
    ],
  },
  {
    name: "Dimple Khatiri",
    about: "Dimple Khatiri is a women’s health advocate and Mental Health Pharmacist with over 12 years’ clinical experience. She is passionate about improving understanding of women’s hormonal and mental health, particularly Premenstrual Dysphoric Disorder (PMDD), and championing greater awareness, education and more inclusive, evidence-based care for women.",
    logo: "/logos/dimplekhatiri.png",
    links: [
      { label: "Website", url: "#" },
      { label: "Instagram", url: "#" },
    ],
  },
  {
    name: "Ceri Cashell",
    about: "Dr Ceri Cashell is an Irish GP with over 25 years of medical experience, specialising in hormonal health, particularly perimenopause, menopause, PMS and PMDD. She is co-founder of Healthy Hormones, a free, evidence-based online community dedicated to improving hormonal health education for both healthcare professionals and the public. Through medical education and public speaking, she works to raise awareness and make women’s hormonal health better understood.",
    logo: "/logos/cericashell.jpg",
    links: [
      { label: "Website", url: "#" },
      { label: "LinkedIn", url: "#" },
    ],
  },
  {
    name: "Claire Phipps",
    about: "Dr Claire Phipps is a GP and menopause specialist, and co-founder of The Menopause Sisters. She is dedicated to raising awareness of menopause and improving women’s access to evidence-based information, support and care. Through her clinical work and education, she helps empower women to better understand and manage their health through perimenopause and menopause.",
    logo: "/logos/clairephipps.png",
    links: [
      { label: "Website", url: "#" },
    ],
  },
  {
    name: "Anna O’Sullivan",
    about: "Anna O’Sullivan is a women’s health advocate and communications specialist, co-founder of CensHERship and founder of FutureFemHealth. She works to address barriers facing women’s health organisations, particularly online censorship and restrictions on health information. Through research, advocacy and industry analysis, she champions greater visibility for women’s health and supports the growth of the women’s health innovation sector.",
    logo: "/logos/annaosullivan.png",
    links: [
      { label: "Website", url: "#" },
    ],
  }
];

export default partners;
