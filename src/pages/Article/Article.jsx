import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ShareMenu from "features/news/components/articleShareMenu";
import { NEWSDATA } from "features/news/constants/newsData";
import { Helmet } from 'react-helmet-async';

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const referrerPage = location.state?.from || 1;
   
  useEffect(() => {
    const fetchArticle = () => {
      const foundArticle = NEWSDATA.find(item => item.slug === slug);
      if (foundArticle) {
        setArticle(foundArticle);
        const related = NEWSDATA
          .filter(item => item.slug.toString() !== slug)
          .filter(item => item.category === foundArticle.category)
          .slice(0, 2);

        if (related.length < 2) {
          const otherArticles = NEWSDATA
            .filter(item => item.slug.toString() !== slug)
            .filter(item => item.category !== foundArticle.category)
            .slice(0, 2 - related.length);

          setRelatedArticles([...related, ...otherArticles]);
        } else {
          setRelatedArticles(related);
        }
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/news/page/1");
      }
    };

    fetchArticle();
  }, [slug, navigate]);

  const handleBackToNewsFeed = () => {
    navigate(`/news/page/${referrerPage}`);
  };

  const handleRelatedArticleClick = (relatedArticle) => {
    if (relatedArticle?.slug) {
      navigate(`/news/${relatedArticle.slug}`, { state: { from: referrerPage } });
    } else {
      console.warn("Related article has no slug, navigating by ID:", relatedArticle.id);
      navigate(`/news/${relatedArticle.id}`, { state: { from: referrerPage } });
    }
  };

  const handleShareClick = () => {
    setShowShareMenu(true);
  };

  // Show content immediately with background - no white flash
  if (loading || !article) {
    return (
      <main className="flex-grow w-full pt-16 pb-12 bg-secondary dark:bg-secondary-dark">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 dark:text-gray-400">
            Article not found.
            <button onClick={handleBackToNewsFeed} className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              ← Back to News Feed
            </button>
          </div>
        )}
      </main>
    );
  }


  const metaDescription = article.summary || `Read more about "${article.title}" on our news website.`;
  const metaKeywords = article.keywords ? article.keywords.join(', ') : article.category;
  const articleUrl = `https://legatus.com/news/${article.slug}`;
  const imageUrl = article.imageUrl || 'https://legatus.com/default-news-image.jpg';

  const publisher = {
    "@type": "Organization",
    "name": "Legatus",
    "logo": {
      "@type": "ImageObject",
      "url": "URL to website logo"
    }
  };

  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article?.title,
    "description": metaDescription,
    "image": {
      "@type": "ImageObject",
      "url": imageUrl,
      "width": 1200, // placeholder values, adjust as needed
      "height": 675 // placeholder values, adjust as needed
    },
    "datePublished": article?.date,
    "dateModified": article?.lastModified,
    "author": {
      "@type": "Person",
      "name": article?.author
    },
    "publisher": publisher,
    "mainEntityOfPage": articleUrl,
    "isAccessibleForFree": article?.isAccessibleForFree || true,
    "wordCount": article?.wordCount
  };
  
  const paragraphs = article.content.split('\n\n');

  return (
    <>
      <Helmet>
        <title>{`${article.title} - Your News Website`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta name="author" content={article.author} />
        <link rel="canonical" href={articleUrl} />
        {article && (
          <script type="application/ld+json">
            {JSON.stringify(schemaOrgJSONLD)}
          </script>
        )}
      </Helmet>

      <main className="flex-grow w-full pt-16 pb-12">
        <div className="bg-transparent-light dark:bg-transparent-dark shadow-lg w-full">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-primary dark:bg-primary-dark">
            <div className="flex justify-between items-center py-4">
              <button
                onClick={handleBackToNewsFeed}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                ← Back to News Feed
              </button>
              {/* Share button */}
              <button 
                onClick={handleShareClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
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
                {paragraphs.map((text, i) => (
                  <p className="mb-6" key={i}>{text}</p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Related Articles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedArticles.map(item => (
                    <div
                      key={item.id}
                      className="bg-secondary dark:bg-secondary-dark p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleRelatedArticleClick(item)}
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
      </main>
      {showShareMenu && (
        <ShareMenu 
          article={article} 
          onClose={() => setShowShareMenu(false)} 
        />
      )}
    </>
  );
};

export default ArticlePage;