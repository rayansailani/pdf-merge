import { Box, CardContent, Card, Typography } from "@mui/material";
import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileUpload = () => {
  const [fileState, setFileState] = useState();
  const [fileNames, setFileNames] = useState([]);

  const downloadDocument = async () => {
    const pdfBytes = await fileState?.save();
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

    // Generate a URL for the Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank", "download.pdf");
  };

  const clearFiles = () => {
    setFileState();
    setFileNames([]);
  }

  const handleFileUpload = async (event) => {
    let pdfDocument = await PDFDocument.create();
    const selectedFiles = event.target.files;
    const selectedFilesLength = selectedFiles.length;

    for (let i = 0; i < selectedFilesLength; i++) {
      const file = selectedFiles[i];
      const fileName = file.name;
      const fileReader = new FileReader();
      const isPDFfile = file.type === "application/pdf";

      setFileNames((prev) => {
        return [...prev, fileName];
      });

      fileReader.onloadend = async () => {
        try {
            if (isPDFfile) {
                let pdfSnippet = await PDFDocument.load(fileReader.result);
                let pages = await pdfDocument.copyPages(
                  pdfSnippet,
                  pdfSnippet.getPageIndices()
                );
      
                (await pages).forEach((page) => {
                  pdfDocument.addPage(page);
                });
              } else {
                let imageBytes = fileReader.result;
                const fileExtension = file.name.split(".").pop().toLowerCase();
                let image = null;
                if (fileExtension === "png") {
                  image = await pdfDocument.embedPng(imageBytes);
                } else if (fileExtension === "jpeg" || fileExtension === "jpg") {
                  image = await pdfDocument.embedJpg(imageBytes);
                } else if (fileExtension === "gif") {
                  image = await pdfDocument.embedGif(imageBytes);
                } else {
                  window.alert("unsupported image type");
                }
                let newPage = pdfDocument.addPage();
      
                newPage.drawImage(image, {
                  x: newPage.getWidth() / 2 - image.width / 4,
                  y: newPage.getHeight() / 2 - image.height / 4,
                  width: image.width / 2,
                  height: image.height / 2,
                });
              }
              setFileState(pdfDocument);
        } catch (error) {
            console.error(error);
            setFileState();
            setFileNames([]);
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "65vw",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <Button
            component="label"
            variant="contained"
            sx={{ background: "#4f5d75" }}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput multiple type="file" onChange={handleFileUpload} />
          </Button>
          {fileNames.length > 0 &&
            fileNames.map((fileName, index) => {
              return (
                <Card key={index} variant="outlined" sx={{margin: '2rem 0'}}>
                  <CardContent sx={{ padding:'12px !important'}}>
                    <Typography>
                      {fileName}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
        </CardContent>
      </Card>
      {fileNames.length > 0 && <Box sx={{marginTop: '2rem', display: 'flex', width: { sm: '100vw', md: '40vw'}, justifyContent:'space-between'}}>
        <Button variant="contained" onClick={downloadDocument} sx={{background: 'green'}}>Download</Button>
        <Button variant="contained" onClick={clearFiles} sx={{background: 'red'}}>Clear</Button>
      </Box>}
    </Box>
  );
};

export default FileUpload;
