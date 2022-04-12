import "../AdditionalFiles/App.css";
import React, { useEffect, useState } from "react";

//This is the API url to fetch from
const API_URL = "https://matchesfashion.com/api/products?page=";
const TAX_RATE = 0.08;

//Function to fetch the data from the API
const fetchData = async (page) => {
  const response = await fetch(API_URL + `${page}`);
  return await response.json();
};

//Function that counts the profit after tax for each product
export const profitAfterTax = (product) => {
  let profit = 0;
  const margin = product.soldPrice - product.costToBusiness;
  if (product.quantitySold <= 10) {
    profit += margin * product.quantitySold;
  } else {
    profit +=
      (product.quantitySold - 10) * margin -
      (product.quantitySold - 10) * margin * TAX_RATE +
      10 * margin;
  }
  return profit;
};

const MySolution = () => {
  const [data, setData] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //This function gets the products data
  //It runs every time the page is changed
  useEffect(() => {
    const getProducts = () => {
      return fetchData(page)
        .then((result) => {
          setData(result.products);
          setProductCount(result.count);
          setIsLoading(false);
          setError(null);
        })
        .catch((err) => {
          setIsLoading(false);
          setError("Something went wrong, try again");
        });
    };
    getProducts();
  }, [page]);

  //These functions handle changing the page
  const handleSetNextPage = () => {
    setPage((currentPage) => currentPage + 1);
  };
  const handleSetPrevPage = () => {
    setPage((currentPage) => currentPage - 1);
  };
  const handleSetFirstPage = () => {
    setPage(0);
  };
  const handleSetLastPage = () => {
    setPage(productCount / 10);
  };
  const disabledPrevPage = page === 0;
  const disabledNextPage = page === productCount / 10;

  const content = isLoading ? (
    <h3>Loading...</h3>
  ) : error ? (
    <h3>{error}</h3>
  ) : (
    <table id="products">
      <thead>
        <tr>
          <th>Id</th>
          <th>Brand</th>
          <th>Name</th>
          <th>Quantity Sold</th>
          <th>Sold Price</th>
          <th>Cost To Business</th>
          <th>Profit After Tax</th>
        </tr>
      </thead>
      <tbody>
        {data.map((product) => {
          const profit = profitAfterTax(product).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          return (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.brand}</td>
              <td>{product.name}</td>
              <td>{product.quantitySold}</td>
              <td>£{product.soldPrice}</td>
              <td>£{product.costToBusiness}</td>
              <td>£{profit}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="App">
      {content}
      <button onClick={handleSetFirstPage} disabled={disabledPrevPage}>
        First Page
      </button>
      <button onClick={handleSetPrevPage} disabled={disabledPrevPage}>
        Previous Page
      </button>
      <button onClick={handleSetNextPage} disabled={disabledNextPage}>
        Next Page
      </button>
      <button onClick={handleSetLastPage} disabled={disabledNextPage}>
        Last Page
      </button>
    </div>
  );
};

export default MySolution;
