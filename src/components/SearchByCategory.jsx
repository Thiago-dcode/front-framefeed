import React, { useEffect, useState } from "react";
import Api from "../api/Api";
import LoadMore from "./LoadMore";
export default function SearchByCategory({
  title,
  categoriesSelected,
  handleQuery,

  max,
  className,
}) {
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getCategories = async (url = "/categories") => {
    try {
      setIsLoading(true);
      const response = await Api.get(url);

      setCategories([...categories, ...response.data.data]);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const moreCategories = () => {
    if (currentPage === lastPage) {
      return;
    }
    const page = currentPage + 1;
    getCategories("/categories?page=" + page);
  };

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <div className={`search-categories ${className}`}>
      {categoriesSelected.length === 0 && <h3>{title}</h3>}
      {categoriesSelected !== 0 && (
        <div className="categories-selected">
          {categoriesSelected.map((category, i) => {
            return (
              <button
                type="button"
                onClick={() => {
                  handleQuery(category);
                }}
                key={i}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}
      <div className="categories">
        {categories &&
          !error &&
          categories.map((category, i) => {
            if (!categoriesSelected.includes(category.name)) {
              return (
                <button
                  type="button"
                  onClick={() => {
                    handleQuery(category.name, category.id);
                  }}
                  key={i}
                >
                  {category.name}
                </button>
              );
            }
          })}
      </div>
      <LoadMore
        handleMore={moreCategories}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
