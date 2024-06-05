import React, { useEffect, useState } from "react";
import startIcon from "../assets/startIcon.png";
import locationIcon from "../assets/location2.jpg";
import replacementIcon from "../assets/replacementIcon.webp";
import warrantyIcon from "../assets/warranty2.png";
import gstIcon from "../assets/gstInvoice.jpg";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Product = () => {
  const [product, setProduct] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [error, setError] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const data = location.state;


  const fetchVariantData = async (colorId, ramId, storageId) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const params = {
        product_id: `${data.id}`,
        variant_id: `${data.variant_id}`,
        search: "other",
      };

      if (colorId) params.color_variant_id = colorId;
      if (ramId) params.other_variant_id = ramId;
      if (storageId) params.storage_variant_id = storageId;

      const response = await axios.get(
        "https://app1.crazzyhub.com/api/product-variant-filter-api",
        {
          params,
          headers: {
            Authorization: "7c2b8693d001c79d4b5ed6ebc387ad6b862989dfjhjjhj",
          },
        }
      );
      setProduct(response.data);
      setIsLoading(false);
      setIsError(false);
      setSelectedImage(response.data.data.variant_images[0]);
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      setError("Error while fetching the Data Please try again!", err);
    }
  };

  const handleColorSelect = (index) => {
    const colorId = product.data.variant_color_values[index].id;
    setSelectedColor(colorId);
    fetchVariantData(colorId, selectedRam, selectedStorage);
  };

  const handleRamSelect = (index) => {
    const ramId = product.data.other_variant_values[index].id;
    setSelectedRam(ramId);
    fetchVariantData(selectedColor, ramId, selectedStorage);
  };

  const handleStorageSelect = (index) => {
    const storageId = product.data.variant_storage_values[index].id;
    setSelectedStorage(storageId);
    fetchVariantData(selectedColor, selectedRam, storageId);
  };

  const handleSelectImage = (index) => {
    setSelectedImage(product.data.variant_images[index]);
  };

  const colorVariants =
    Object.keys(product).length > 0
      ? product.data.variant_color_values.map((item, index) => {
          return (
            <div
              className={`w-auto h-auto rounded-md border-2 text-center cursor-pointer ${
                item.id === selectedColor
                  ? "border-orange-500"
                  : "border-gray-300"
              }`}
              key={index}
              onClick={() => handleColorSelect(index)}
            >
              {isLoading && !isError && (
                <div className="text-sm w-auto h-[45px] bg-cyan-600 text-white px-5 py-2 rounded-md m-auto">
                  Loading...
                </div>
              )}
              {!isLoading && !isError && (
                <>
                  <div className="flex justify-center">
                    <img
                      src={item.variant_image}
                      alt="PhoneImage"
                      width="40px"
                      height="30px"
                    />
                  </div>
                  <div className="px-1 text-xs font-semibold">{item.value}</div>
                </>
              )}
              {!isLoading && isError && (
                <div className="mt-10 text-red-600 text-bold text-sm">
                  Error
                </div>
              )}
            </div>
          );
        })
      : "";

  const imageVariants =
    Object.keys(product).length > 0
      ? product.data.variant_images.map((item, index) => {
          return (
            <div
              className={`w-[80px] h-[80px] border-2 rounded-md cursor-pointer ${
                item === selectedImage ? "border-orange-500" : "border-gray-300"
              }`}
              key={index}
              onClick={() => handleSelectImage(index)}
            >
              <img src={item} alt="phoneImage" width="100%" height="100%" />
            </div>
          );
        })
      : "";

  const otherVariantsRam =
    Object.keys(product).length > 0
      ? product.data.other_variant_values.map((item, index) => {
          return (
            <div
              className={`w-auto h-[40px] rounded-md border-2 flex justify-center items-center cursor-pointer ${
                item.id === selectedRam
                  ? "border-orange-500"
                  : "border-gray-300"
              }`}
              key={index}
              onClick={() => handleRamSelect(index)}
            >
              {isLoading && !isError && (
                <div className="text-xs w-auto h-[30px] bg-cyan-600 text-white rounded-md m-auto flex items-center">
                  Loading...
                </div>
              )}
              {!isLoading && !isError && (
                <h1 className="font-semibold text-lg px-2">{item.value}</h1>
              )}
              {!isLoading && isError && (
                <div className="mt-10 text-red-600 text-bold text-sm">
                  Error
                </div>
              )}
            </div>
          );
        })
      : "";

  const otherVariantsStorage =
    Object.keys(product).length > 0
      ? product.data.variant_storage_values.map((item, index) => {
          return (
            <div
              key={index}
              className={`w-[80px] h-[50px] rounded-md border-2 flex justify-center items-center cursor-pointer ${
                item.id === selectedStorage
                  ? "border-orange-500"
                  : "border-gray-300"
              }`}
              onClick={() => handleStorageSelect(index)}
            >
              {isLoading && !isError && (
                <div className="text-xs w-auto h-[30px] bg-cyan-600 text-white rounded-md m-auto flex items-center">
                  Loading...
                </div>
              )}
              {!isLoading && !isError && (
                <h1 className="font-semibold text-lg">{item.value}</h1>
              )}
              {!isLoading && isError && (
                <div className="mt-10 text-red-600 text-bold text-sm">
                  Error
                </div>
              )}
            </div>
          );
        })
      : "";

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        setIsError(false);
        const response = await axios.get(
          `https://app1.crazzyhub.com/api/product-details-api/?product_id=${data.id}&variant_id=${data.variant_id}`,
          {
            headers: {
              Authorization: "7c2b8693d001c79d4b5ed6ebc387ad6b862989dfjhjjhj",
            },
          }
        );
        setProduct(response.data);
        setIsLoading(false);
        setIsError(false);
        setSelectedImage(response.data.data.variant_images[0]);
      } catch (err) {
        setIsLoading(false);
        setIsError(true);
        setError("Error while fetching the Data Please try again!", err);
      }
    };

    fetchProduct();
  }, [data.id, data.variant_id]);

  return (
    <>
      <div className="w-[80%] h-auto m-auto mt-5 gap-10 flex-wrap justify-center lg:flex">
        <div className="lg:w-[30%] md:w-[50%] w-[80%] h-[450px] border-2 border-gray-300 rounded-lg m-auto">
          <img
            src={selectedImage || data.image}
            width="100%"
            height="100%"
            alt="PhoneImage"
          />
        </div>

        <div className="lg:w-[60%] w-[100%] lg:h-[450px] h-[650px] m-auto mt-3 lg:mt-0 mb-3 lg:mb-0">
          <h1 className="font-bold text-xl px-3">
            {Object.keys(product).length > 0
              ? product.data.product_variant_name
              : data.variant_name}
          </h1>
          <div className="flex items-center mt-3 gap-1 px-3">
            <img src={startIcon} alt="starIcon" width="20px" height="20px" />
            <img src={startIcon} alt="starIcon" width="20px" height="20px" />
            <img src={startIcon} alt="starIcon" width="20px" height="20px" />
            <img src={startIcon} alt="starIcon" width="20px" height="20px" />
            <img src={startIcon} alt="starIcon" width="20px" height="20px" />
          </div>
          <div className="text-lg text-green-500 px-3 font-semibold">
            {Object.keys(product).length > 0
              ? product.data.stock_sataus
              : data.stock_sataus}
          </div>
          <div className="flex items-center gap-1 px-3">
            <div className="text-lg text-orange-600 font-bold">
              ₹
              {Object.keys(product).length > 0
                ? product.data.price
                : data.actual_price}
            </div>
            <div className="text-lg font-bold line-through">
              M.R.P:
              {Object.keys(product).length > 0 ? product.data.mrp : data.price}
            </div>
            <div className="bg-green-500 flex items-center rounded-md">
              <span className="text-white px-1">
                {Object.keys(product).length > 0
                  ? product.data.discount_percent
                  : data.discount_percent}
                %
              </span>
            </div>
          </div>
          <h2 className="px-3 font-bold text-lg">Color</h2>
          <div className="px-3 flex gap-1">{colorVariants}</div>
          <h2 className="px-3 font-bold text-lg">RAM</h2>
          <div className="px-3 flex gap-2">{otherVariantsRam}</div>

          <h2 className="px-3 font-bold text-lg">Storage</h2>
          <div className="px-3 flex gap-2">{otherVariantsStorage}</div>

          <div className="mt-2 border-2 border-gray-300 w-[97%] md:h-[35px] h-[70px] m-auto bg-gray-100 p-3 flex md:flex-row flex-col justify-between items-center">
            <div className="font-semibold text-lg">Delivery Options:</div>
            <div className="flex justify-end gap-2">
              <img
                src={locationIcon}
                alt="LocationIcon"
                width="25px"
                height="20px"
              />
              <input
                type="text"
                placeholder="Enter Pincode"
                className="border-b-2 border-gray-400 bg-gray-100 outline-none shadow-sm shadow-gray-400 pl-2"
              />
            </div>
          </div>

          <div className="mt-2 border-2 border-gray-300 w-[97%] md:h-[50px] h-[150px] m-auto bg-red-200 p-3 flex md:flex-row flex-col justify-csnter items-center">
            <div className="md:w-[33%] w-[90%] h-[40px] border-r-4 border-gray-200 flex justify-center items-center gap-1">
              <div>
                <img
                  src={replacementIcon}
                  width="30px"
                  height="30px"
                  alt="ReplaceImage"
                />
              </div>
              <div className="flex flex-col justify-center items-start">
                <p className="font-bold">Replacement</p>
                <p>in 7 days</p>
              </div>
            </div>

            <div className="md:w-[34%] w-[90%] h-[40px] border-r-4 border-gray-200 flex justify-center items-center gap-2 md:mt-0 mt-1">
              <div>
                <img
                  src={warrantyIcon}
                  width="30px"
                  height="30px"
                  alt="warrantyIcon"
                />
              </div>
              <div className="flex flex-col justify-center items-start">
                <p className="font-bold">Warranty</p>
                <p>in 1 Year</p>
              </div>
            </div>

            <div className="md:w-[33%] w-[90%] h-[40px] flex justify-center items-center gap-2 md:mt-0 mt-1">
              <div>
                <img
                  src={gstIcon}
                  width="30px"
                  height="30px"
                  alt="warrantyIcon"
                />
              </div>
              <div className="flex flex-col justify-center items-start">
                <p className="font-bold">GST Invoice</p>
                <p>Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 w-[77%] h-auto flex flex-wrap gap-2 m-auto">
        {imageVariants}
      </div>
    </>
  );
};

export default Product;
