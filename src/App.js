import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [commented, setCommented] = useState(null);
  const [comments, setComments] = useState([]);
  const [excelBlob, setExcelBlob] = useState(null);

  const handleUpload = async () => {
    if (!commented) return alert("Please upload a commented PDF.");

    const formData = new FormData();
    formData.append("pdf", commented);

    try {
      const res = await axios.post("http://localhost:5000/extract", formData, {
        responseType: "blob",
      });
      setExcelBlob(new Blob([res.data], { type: res.headers['content-type'] }));

      const commentsRes = await axios.post("http://localhost:5000/comments", formData);
      setComments(commentsRes.data.comments || []);
    } catch (err) {
      console.error(err);
      alert("Extraction failed.");
    }
  };

  const styles = {
    container: {
      maxWidth: 800,
      margin: "50px auto",
      padding: 30,
      backgroundColor: "#f2f2f2",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      textAlign: "center",
      marginBottom: 20,
      color: "#333",
    },
    fileInput: {
      display: "block",
      marginBottom: 20,
    },
    button: {
      padding: "12px 24px",
      background: "linear-gradient(145deg, #4a4a4a, #333333)", // Dark gray gradient
      color: "#ffffff",
      border: "solid 5px #333333",
      borderRadius: "8px",
      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(100, 100, 100, 0.2)", // 3D shadow
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s", // Smooth transition
    },
    label: {
      marginTop: 20,
      fontSize: 16,
      color: "#444",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: 20,
    },
    th: {
      backgroundColor: "#ccc",
      padding: 10,
      border: "1px solid #999",
      textAlign: "left",
    },
    td: {
      backgroundColor: "#fff",
      padding: 10,
      border: "1px solid #ddd",
    },
    downloadLink: {
      marginTop: 20,
      display: "inline-block",
      padding: "10px 15px",
      backgroundColor: "#28a745",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}><u>Comment Extractor</u></h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setCommented(e.target.files[0])}
        style={styles.fileInput}
      />
      
      <button className="extract-comment-btn" onClick={handleUpload} style={styles.button}>
        Extract Comments
      </button>

      {comments.length > 0 && (
        <div>
          <h3 style={{ marginTop: 30, color: "#444" }}></h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Page</th>
                <th style={styles.th}>Author</th>
                <th style={styles.th}>Comment</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c, i) => (
                <tr key={i}>
                  <td style={styles.td}>{c.Page}</td>
                  <td style={styles.td}>{c.Author}</td>
                  <td style={styles.td}>{c.Comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {excelBlob && (
        <a
          href={URL.createObjectURL(excelBlob)}
          download="PDF_Comments_Report.xlsx"
          style={styles.downloadLink}
        >
          Download Excel Report
        </a>
      )}
    </div>
  );
}

export default App;