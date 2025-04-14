import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavBar from "../components/common/NavBar";
import CustomFooter from "../components/common/CustomFooter";
import { NEWSDATA } from "../constants/newsData";

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const referrerPage = location.state?.from || 1;

  useEffect(() => {
    const fetchArticle = () => {
      setLoading(true);
      setTimeout(() => {
        const foundArticle = NEWSDATA.find(item => item.id.toString() === id);
        if (foundArticle) {
          setArticle(foundArticle);
          const related = NEWSDATA
            .filter(item => item.id.toString() !== id)
            .filter(item => item.category === foundArticle.category)
            .slice(0, 2);
          
          if (related.length < 2) {
            const otherArticles = NEWSDATA
              .filter(item => item.id.toString() !== id)
              .filter(item => item.category !== foundArticle.category)
              .slice(0, 2 - related.length);
            
            setRelatedArticles([...related, ...otherArticles]);
          } else {
            setRelatedArticles(related);
          }
        } else {
          navigate("/news/page/1");
        }
        setLoading(false);
      }, 800);
    };

    fetchArticle();
  }, [id, navigate]);

  const handleBackToNewsFeed = () => {
    navigate(`/news/page/${referrerPage}`);
  };

  const handleRelatedArticleClick = (articleId) => {
    navigate(`/news/${articleId}`, { state: { from: referrerPage } });
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

        {/* Article view */}
        {article && !loading && (
          <div className="bg-primary dark:bg-primary-dark shadow-lg w-full">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <button 
                  onClick={handleBackToNewsFeed} 
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  ← Back to News Feed
                </button>
                {/* Share button */}
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Share Article
                </button>
              </div>
              
              {article.imageUrl && (
                <div className="w-full h-64 md:h-96 relative overflow-hidden">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="inline-block bg-blue-600 text-white px-3 py-1 text-xs rounded-full">
                      {article.category}
                    </span>
                    <p className="text-white text-sm mt-2">{new Date(article.date).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              
              <div className="py-6">
                <h1 className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-4">
                  {article.title}
                </h1>
                
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                    <img src={article.authorImage} alt={article.author} className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-3">
                    <p className="text-black dark:text-white font-medium">{article.author}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{article.authorTitle}</p>
                  </div>
                </div>
                
                <div className="prose max-w-none text-gray-800 dark:text-gray-200 leading-relaxed">
                  <p className="mb-8 text-lg">{article.summary}</p>
                  <p className="mb-6">{article.content}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Related Articles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedArticles.map(item => (
                      <div 
                        key={item.id} 
                        className="bg-secondary dark:bg-secondary-dark p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleRelatedArticleClick(item.id)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium text-black dark:text-white">{item.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{new Date(item.date).toLocaleDateString()}</p>
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">Read More →</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <CustomFooter />
    </div>
  );
};

export default ArticlePage;