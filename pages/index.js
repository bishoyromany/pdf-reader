import Head from 'next/head'
import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';

export default function Home() {
  const [PDFURL, setPDFURL] = useState();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const init = async () => {
    const url = window.location.search.replace('?url=', '').length > 10 ? window.location.origin + '/api/pdf/' + window.location.search : null;
    setPDFURL(url);
    if (!url) {
      alert("PDF Not Found");
      return;
    }
  }

  useEffect(() => {
    if (window) {
      init();
    }

  }, []);

  return (
    <>
      <Head>
        <meta charset="utf-8" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /> */}
        <title>PDF.js viewer</title>
        <script async src="./"></script>
      </Head>

      <span>{PDFURL}</span>

      {PDFURL && (<>
        <Document file={PDFURL} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </>)}
    </>
  )
}