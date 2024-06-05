import React, { useEffect, useState } from "react";
import heartIcon from "../assets/free-heart.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleNavigateToProduct = (item) => {
    navigate("/product", { state: item });
  };

  const productList = products.map((item, index) => {
    return (
      <div
        className="w-[300px] h-[400px] border-2 border-gray-300 rounded-lg shadow-lg shadow-gray-300 hover:scale-x-105 hover:scale-y-105 transition-all cursor-pointer"
        key={index}
        onClick={() => handleNavigateToProduct(item, index)}
      >
        <div className="w-[80%] h-[220px] m-auto flex">
          <img src={item?.image} width="90%" height="100%" alt="productImage" />
        </div>
        <img
          src={heartIcon}
          width="25px"
          height="25px"
          alt="HeartIcon"
          className="float-right relative -top-52 -left-5 cursor-pointer"
        />
        <h1 className="px-3 font-bold text-xl">{item?.variant_name}</h1>
        <div className="text-lg text-green-500 px-3 font-semibold">
          {item?.stock_sataus}
        </div>
        <div className="text-lg px-3 font-bold">₹{item?.actual_price}</div>
        <div className="px-3 flex gap-1">
          <div className="text-lg text-gray-400 font-bold line-through">
            {item?.price}
          </div>
          <div className="bg-green-500 flex items-center rounded-sm">
            <span className="text-white px-1">
              {item.discount_percent} %off
            </span>
          </div>
        </div>
      </div>
    );
  });

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          "https://app1.crazzyhub.com/api/all-filter-product-list",
          new URLSearchParams({
            category_id: "28",
            brand_id: "226",
            color_id: "",
          }),
          {
            headers: {
              Authorization: "7c2b8693d001c79d4b5ed6ebc387ad6b862989dfjhjjhj",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        setProducts(response.data.data.product_list);
        setIsLoading(false);
        setIsError(false);
      } catch (err) {
        setIsLoading(false);
        setIsError(true);
        setError("Error while fetching the Data Please try again!", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-[90%] h-auto flex justify-center items-center flex-wrap m-auto mt-5 gap-5 mb-3">
      {!isLoading && !isError && productList}
      {!isLoading && isError && (
        <div className="mt-10 text-red-600 text-bold text-3xl">{error}</div>
      )}
      {isLoading && !isError && (
        <div className="mt-10 text-3xl w-auto h-[55px] bg-cyan-600 text-white px-5 py-2 rounded-md">
          Loading...
        </div>
      )}
    </div>
  );
};

export default Products;
