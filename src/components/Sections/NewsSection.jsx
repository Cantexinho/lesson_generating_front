import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const NewsSection = () => {
  const navigate = useNavigate();
  
  const newsItems = [
    {
      id: 1,
      title: "New Research Breakthrough in Renewable Energy",
      content: "Scientists have discovered a revolutionary method to improve solar panel efficiency by 40%.",
      image: require("../../assets/images/futuristic_solar_panels.png"),
      slug: "renewable-energy-breakthrough"
    },
    {
      id: 2,
      title: "Global Tech Conference Announces Dates",
      content: "The annual technology summit will be held virtually this year with keynote speakers from major tech companies.",
      image: require("../../assets/images/futuristic_virtual_technology_summit.png"),
      slug: "tech-conference-dates"
    },
    {
      id: 3,
      title: "Health Officials Release New Dietary Guidelines",
      content: "Updated recommendations focus on plant-based nutrition and reduced processed food consumption.",
      image: require("../../assets/images/vibrant_plant_based_meal.png"),
      slug: "new-dietary-guidelines"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextSlide = useCallback((e) => {
    if (e) e.stopPropagation(); // Prevent click from bubbling to the container
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  }, [newsItems.length]);

  const prevSlide = useCallback((e) => {
    if (e) e.stopPropagation(); // Prevent click from bubbling to the container
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
    );
  }, [newsItems.length]);

  const goToArticle = () => {
    navigate(`/news/${newsItems[currentIndex].slug}`);
  };

  // Auto-rotate slides every 5 seconds, reset timer when currentIndex changes
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, nextSlide]);

  return (
    <section className="flex items-center justify-center w-full py-5 md:py-10 bg-secondary dark:bg-secondary-dark">
      <div className="relative flex items-center w-full max-w-7xl px-6">
        {/* Left Arrow */}
        <button 
          onClick={prevSlide}
          className="absolute w-12 h-12 left-6 p-3 text-primary-dark dark:text-primary bg-transparent-light hover:bg-primary dark:bg-transparent-dark dark:hover:bg-primary-dark rounded-full focus:outline-none"
          aria-label="Previous slide"
        >
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>
        
        {/* News Content - Fixed height container */}
        <div 
          className="w-full mx-16 overflow-hidden bg-primary dark:bg-primary-dark rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-xl"
          onClick={goToArticle}
          role="link"
          aria-label={`Read full article: ${newsItems[currentIndex].title}`}
        >
          <div className="flex flex-col md:flex-row md:h-128"> {/* Taller fixed height for medium and up */}
            {/* Image - Fixed size container */}
            <div className="w-full md:w-1/2 h-80 md:h-full relative">
              <img 
                src={newsItems[currentIndex].image} 
                alt={newsItems[currentIndex].title}
                className="absolute w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Text Content */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center">
              <div className="flex flex-col w-full">
                <h2 className="mb-4 md:mb-8 text-2xl md:text-3xl font-bold text-primary-dark dark:text-primary">
                  {newsItems[currentIndex].title}
                </h2>
                <p className="text-base md:text-lg text-primary-dark dark:text-primary">
                  {newsItems[currentIndex].content}
                </p>
                <div className="flex justify-between mt-4 md:mt-8">
                  <div className="flex space-x-3">
                    {newsItems.map((_, index) => (
                      <div 
                        key={index}
                        className={`h-3 w-3 rounded-full ${index === currentIndex ? 'bg-main dark:bg-main-dark' : 'bg-secondary dark:bg-secondary-dark'}`}
                      />
                    ))}
                  </div>
                  <span className="text-base italic text-transparent-dark dark:text-transparent-light">Click to read more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Arrow */}
        <button 
          onClick={nextSlide}
          className="absolute w-12 h-12 right-6 p-3 text-primary-dark dark:text-primary bg-transparent-light hover:bg-primary dark:bg-transparent-dark dark:hover:bg-primary-dark rounded-full focus:outline-none"
          aria-label="Next slide"
        >
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </button>
      </div>
    </section>
  );
};

export default NewsSection;