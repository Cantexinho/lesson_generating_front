import { FOOTER_TEXT } from "../../constants/footerText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectTheme } from "../../redux/themeSlice";
import { useSelector } from "react-redux";
import { 
  faArrowRight, 
  faEnvelope, 
  faFileAlt, 
  faInfoCircle, 
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn
} from "@fortawesome/free-brands-svg-icons";

const CustomFooter = () => {
  const theme = useSelector(selectTheme);
  return (
    <footer className="flex flex-col w-full bg-primary dark:bg-primary-dark py-16">
      {/* Main footer content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and copyright section */}
          <div className="flex flex-col">
          <img
          className="w-16 h-16 rounded-2xl"
          src={
            theme.isDarkTheme
              ? require("../../assets/images/legatus-logo-white.png")
              : require("../../assets/images/legatus-logo-black.png")
          }
          alt="Logo"
        />
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">
              {FOOTER_TEXT.logo}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              &copy; {FOOTER_TEXT.year} {FOOTER_TEXT.logo}. {FOOTER_TEXT.allRightsReserved}
            </p>
          </div>
          
          {/* Links section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/login" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#20444D] dark:hover:text-[#C7A154]">
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 mr-2" />
                  {FOOTER_TEXT.startNow}
                </a>
              </li>
              <li>
                <a href="/contact" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#20444D] dark:hover:text-[#C7A154]">
                  <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-2" />
                  {FOOTER_TEXT.contactUs}
                </a>
              </li>
              <li>
                <a href="/privacy" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#20444D] dark:hover:text-[#C7A154]">
                  <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4 mr-2" />
                  {FOOTER_TEXT.privacyPolicy}
                </a>
              </li>
              <li>
                <a href="/terms" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#20444D] dark:hover:text-[#C7A154]">
                  <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4 mr-2" />
                  {FOOTER_TEXT.termsOfService}
                </a>
              </li>
              <li>
                <a href="/about" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#20444D] dark:hover:text-[#C7A154]">
                  <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 mr-2" />
                  {FOOTER_TEXT.aboutUs}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social media section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              {FOOTER_TEXT.followUs}
            </h3>
            <div className="flex flex-wrap gap-4">
              <a href="https://facebook.com" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#20444D] dark:hover:text-[#C7A154]">
                <FontAwesomeIcon icon={faFacebookF} className="w-5 h-5 mr-2" />
                {FOOTER_TEXT.facebook}
              </a>
              <a href="https://twitter.com" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#20444D] dark:hover:text-[#C7A154]">
                <FontAwesomeIcon icon={faTwitter} className="w-5 h-5 mr-2" />
                {FOOTER_TEXT.twitter}
              </a>
              <a href="https://instagram.com" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#20444D] dark:hover:text-[#C7A154]">
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5 mr-2" />
                {FOOTER_TEXT.instagram}
              </a>
              <a href="https://linkedin.com" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#20444D] dark:hover:text-[#C7A154]">
                <FontAwesomeIcon icon={faLinkedinIn} className="w-5 h-5 mr-2" />
                {FOOTER_TEXT.linkedin}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Start now button with image */}
    </footer>
  );
};

export default CustomFooter;