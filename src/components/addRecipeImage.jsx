import React, { useState } from "react";
import axios from "axios";
import styles from "./addRecipeImage.module.css";
import localStore from '../utilities/localStorage';
import { useNavigate } from 'react-router-dom';
const baseUrl = import.meta.env.VITE_BASE_URL;

const AddRecipeImage = ({handleSubmitForm}) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle file upload
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError("");
    setResult(null);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please upload an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    const token = localStore.getJwt();
    if (token){
        try {
        const response = await axios.post(`${baseUrl}/api/recipes/upload`, formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });
        handleSubmitForm(response.data);
        // setResult(response.data);
        setError("");
        navigate('/my-recipes')

        } catch (err) {
        setError("Failed to process the image. Please try again.");
        console.error(err);
        }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Upload Recipe Image</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fileInputContainer}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitButton}>
          Upload
        </button>
      </form>

      {/* {result && (
        <div className={styles.resultContainer}>
          <h2 className={styles.resultTitle}>Parsed Recipe</h2>
          <pre className={styles.resultText}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )} */}
    </div>
  );
};

export default AddRecipeImage;
