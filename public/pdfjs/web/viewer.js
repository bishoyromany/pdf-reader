(function () {
  const url = window.location.search.replace('?url=', '').length > 10 ? window.location.origin + '/api/pdf/' + window.location.search : null;

  if (!url) {
    alert("Please provide PDF URL");
    return;
  }

  // The workerSrc property shall be specified.
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/build/pdf.worker.js';

  let currPage = 1; //Pages are 1-based not 0-based
  let numPages = 0;
  let thePDF = null;

  //This is where you start
  pdfjsLib.getDocument(url).promise.then(async function (pdf) {

    //Set PDFJS global object (so we can easily access in our page functions
    thePDF = pdf;

    //How many pages it has
    numPages = pdf.numPages;

    //Start with first page
    await pdf.getPage(1).then(handlePages);
  }).catch(e => {
    console.log(e);
    alert("Something went wrong while loading your PDF.");
  }).then(_ => {
    document.getElementById("loadingContainer").remove();
  });

  function handlePages(page) {
    //This gives us the page's dimensions at full scale
    var viewport = page.getViewport({ scale: 1 });

    //We'll create a canvas for each page to draw it on
    var canvas = document.createElement("canvas");
    canvas.style.display = "block";
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    //Draw it on the canvas
    page.render({ canvasContext: context, viewport: viewport });

    //Add it to the web page
    document.body.appendChild(canvas);

    //Move to next page
    currPage++;
    if (thePDF !== null && currPage <= numPages) {
      thePDF.getPage(currPage).then(handlePages);
    }
  }
})();