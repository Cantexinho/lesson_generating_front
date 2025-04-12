const NavBarDropdown = ({ subpages, scrolled }) => {
  const numCols = Object.keys(subpages).length;

  return (
    <div 
      className={`absolute z-0 top-full left-0 border rounded-xl px-4 py-2 mt-3 min-w-max border-gray-200 dark:border-gray-600
        ${
          scrolled
            ? "bg-primary dark:bg-primary-dark"
            : "bg-transparent-light dark:bg-transparent-dark"
        }`}
    >
      <div className="dropdown-hover-area" />
      <div className={`grid grid-cols-${numCols} gap-6`}>
        {Object.entries(subpages).map(([category, items]) => (
          <div key={category}>
            <div className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
              {category}
            </div>
            <ul>
              {items.map((item) => (
                <li
                  key={item.label || item}
                  className="flex items-center text-base h-8 rounded-md p-5 text-black dark:text-white hover:bg-secondary dark:hover:bg-secondary-dark"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.onClick) item.onClick();
                  }}
                >
                  <a href={item.url || (typeof item === 'string' ? `/${item.toLowerCase().replace(/\s+/g, '-')}` : '#')}>
                    {item.label || item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavBarDropdown;