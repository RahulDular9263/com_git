import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState([]);
  const [excelBlob, setExcelBlob] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setComments([]);
    setExcelBlob(null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file.");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      // Get Excel file (Blob) with embedded comments
      const res = await axios.post("http://localhost:5000/extract", formData, {
        responseType: "blob",
      });
      setExcelBlob(new Blob([res.data], { type: res.headers['content-type'] }));

      // Get JSON data of comments
      const commentsRes = await axios.post("http://localhost:5000/comments", formData);
      setComments(commentsRes.data.comments || []);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Check console for details.");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>PDF Comment Extractor</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginTop: 10 }}>Extract Comments</button>

      {comments.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Extracted Comments</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr><th>Page</th><th>Author</th><th>Comment</th></tr>
            </thead>
            <tbody>
              {comments.map((c, i) => (
                <tr key={i}>
                  <td>{c.Page}</td>
                  <td>{c.Author}</td>
                  <td>{c.Comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {excelBlob && (
        <div style={{ marginTop: 20 }}>
          <a
            href={URL.createObjectURL(excelBlob)}
            download="PDF_Comments_Report.xlsx"
          >
            Download Excel Report
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
