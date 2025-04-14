import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/common/NavBar";
import CustomFooter from "../components/common/CustomFooter";
import { NEWSDATA } from "../constants/newsData";

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating data fetching
    setTimeout(() => {
      setNewsItems(NEWSDATA);
      setLoading(false);
    }, 800);
  }, []);

  const handleArticleClick = (articleId) => {
    navigate(`/news/${articleId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary dark:bg-secondary-dark">
      <NavBar />
      
      <main className="flex-grow w-full pt-24 pb-12">
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
          </div>
        )}

        {/* News Feed Grid with primary background wrapper */}
        {!loading && (
          <div className="bg-primary dark:bg-primary-dark shadow-lg w-full">
            {/* Content container for proper spacing */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Header */}
              <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                  Latest News
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Stay updated with the latest developments and announcements
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsItems.map((newsItem) => (
                  <div
                    key={newsItem.id}
                    onClick={() => handleArticleClick(newsItem.id)}
                    className="bg-secondary dark:bg-secondary-dark rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-102 hover:shadow-xl"
                  >
                    {newsItem.imageUrl && (
                      <div className="w-full h-48 overflow-hidden relative">
                        <img
                          src={newsItem.imageUrl}
                          alt={newsItem.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="inline-block bg-blue-600 text-white px-3 py-1 text-xs rounded-full">
                            {newsItem.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                        {new Date(newsItem.date).toLocaleDateString()}
                      </p>
                      <h2 className="text-xl font-bold text-black dark:text-white mb-3 line-clamp-2">
                        {newsItem.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {newsItem.summary}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                            <img src={newsItem.authorImage} alt={newsItem.author} className="w-full h-full object-cover" />
                          </div>
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {newsItem.author}
                          </span>
                        </div>
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Previous
              </button>
              <button className="px-3 py-2 rounded-md bg-blue-600 text-white">1</button>
              <button className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                2
              </button>
              <button className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                3
              </button>
              <button className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Next
              </button>
            </nav>
          </div>
        )}
      </main>

      <CustomFooter />
    </div>
  );
};

export default NewsPage;