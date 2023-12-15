import React, { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import "./App.css"
import NavBar from "./Components/Navbar";
import DescriptionCard from "./Components/DescriptionCard";
import FileUpload from "./Components/FileUploadAndConvert";

const App = () => {
  const [fileState, setFileState] = useState();
  const [fileNames, setFileNames] = useState([]);


  const downloadDocument = async () => {
    const pdfBytes = await fileState?.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Generate a URL for the Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank", "download.pdf");
  }

  const handleFileUpload = async (event) => {
    let pdfDocument = await PDFDocument.create();
    const selectedFiles = event.target.files;
    const selectedFilesLength = selectedFiles.length;

    for(let i = 0; i<selectedFilesLength; i++) {
      const file = selectedFiles[i];
      const fileName = file.name;
      const fileReader = new FileReader();
      const isPDFfile = file.type === "application/pdf";

      setFileNames((prev) => {
          return [...prev, fileName];        
      })


      fileReader.onloadend = async () => {
        if(isPDFfile) {
          let pdfSnippet = await PDFDocument.load(fileReader.result);
          let pages = await pdfDocument.copyPages(pdfSnippet, pdfSnippet.getPageIndices());

          (await pages).forEach(page => {
            pdfDocument.addPage(page);
          });
        } else { 
          let imageBytes = fileReader.result;
          const fileExtension = file.name.split('.').pop().toLowerCase();
          let image = null;
          if (fileExtension === 'png') {
            image = await pdfDocument.embedPng(imageBytes);
          } else if (fileExtension === 'jpeg' || fileExtension === 'jpg') {
            image = await pdfDocument.embedJpg(imageBytes);
          } else if (fileExtension === 'gif') {
            image = await pdfDocument.embedGif(imageBytes);
          } else {
            window.alert("unsupported image type");
          }
          let newPage =  pdfDocument.addPage();

          newPage.drawImage(image, {
            x: newPage.getWidth() / 2 - image.width / 4,
            y: newPage.getHeight() / 2 - image.height / 4,
            width: image.width/2,
            height: image.height/2,
          });
        }
        setFileState(pdfDocument);
      };
      fileReader.readAsArrayBuffer(file);
    }
  };
  return (
    // <div className="container">
    //   <input type="file" multiple onChange={handleFileUpload} />
      
    //   {fileNames.length > 0 && fileNames.map(name => {
    //     return <p key={name}>{name}</p>
    //   })}
    //   <button onClick={downloadDocument}>Download</button>
    // </div>
    <div>
      <NavBar />
      <DescriptionCard />
      <FileUpload />
    </div>
  );
};

export default App;
