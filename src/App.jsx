import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPageProducts, setPerPageProducts] = useState(5);

  const fetchProducts = async () => {
    try {
      const items = await axios.get("https://fakestoreapi.com/products");
      setProducts(items.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const pages = Math.ceil(products.length / 5);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (param) => {
        if (param[0].isIntersecting) {
          observer.unobserve(lastDiv);
          if (currentPage <= pages) {
            setCurrentPage((currentPage) => currentPage + 1);
            setPerPageProducts((perPageProducts) => perPageProducts + 5);
          }
        }
      },
      { threshold: 0.5 }
    );
    const lastDiv = document.querySelector(".last-div");
    if (!lastDiv) return;
    observer.observe(lastDiv);

    return () => {
      if (lastDiv) {
        observer.unobserve(lastDiv);
      }
      observer.disconnect();
    };
  }, [currentPage, pages]);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {products.slice(0, perPageProducts).map((product, index) => (
          <div key={index} className="bg-white p-4 rounded shadow-md">
            <img
              src={product.image}
              alt="image"
              className="w-72 h-72 object-fill"
            />
            <h2 className="text-lg font-bold">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>
      <div className="last-div"></div>
    </>
  );
}

export default App;
