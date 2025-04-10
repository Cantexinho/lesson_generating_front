const NavBarDropdown = ({ subpages }) => {
  const numCols = Object.keys(subpages).length;

  return (
    <ul className="absolute z-0 top-full left-0 border rounded-xl px-4 py-1 mt-3 min-w-max bg-transparent-light dark:bg-transparent-dark border-gray-200 dark:border-gray-600">
      <div className="dropdown-hover-area" />
      <div className={`grid grid-cols-${numCols} gap-2`}>
        {Object.entries(subpages).map(([column, items]) => (
          <div key={column}>
            {items.map((subpage) => (
              <li
                key={subpage}
                className="flex items-center justify-center text-base h-8 rounded-md my-2 px-2 text-black dark:text-white hover:bg-secondary dark:hover:bg-secondary-dark"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <a href={subpage.toLowerCase()}>{subpage}</a>
              </li>
            ))}
          </div>
        ))}
      </div>
    </ul>
  );
};

export default NavBarDropdown;
