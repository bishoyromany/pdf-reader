import Head from 'next/head'
import Page from "./../component/page";
import { useEffect } from 'react';

export default function Home() {
  const resizer = () => {
    var dist1 = 0;
    function start(ev) {
      if (ev.targetTouches.length == 2) {//check if two fingers touched screen
        dist1 = Math.hypot( //get rough estimate of distance between two fingers
          ev.touches[0].pageX - ev.touches[1].pageX,
          ev.touches[0].pageY - ev.touches[1].pageY);
      }

    }
    function move(ev) {
      if (ev.targetTouches.length == 2 && ev.changedTouches.length == 2) {
        // Check if the two target touches are the same ones that started
        var dist2 = Math.hypot(//get rough estimate of new distance between fingers
          ev.touches[0].pageX - ev.touches[1].pageX,
          ev.touches[0].pageY - ev.touches[1].pageY);
        //alert(dist);
        if (dist1 > dist2) {//if fingers are closer now than when they first touched screen, they are pinching
          document.getElementById('zoomOut').click();
          updateSizes();
        }
        if (dist1 < dist2) {//if fingers are further apart than when they first touched the screen, they are making the zoomin gesture
          document.getElementById('zoomIn').click();
          updateSizes();
        }
      }
    }


    const updateSizes = () => {
      if (!document.querySelector('.page')) {
        return false;
      }
      const width = document.querySelector('.page').scrollWidth > window.innerWidth ? document.querySelector('.page').scrollWidth + "px" : "100vw";
      document.getElementById('zoom').style.height = document.getElementById('viewer').scrollHeight + "px"
      document.getElementById('zoom').style.width = width
      document.getElementById('viewerContainer').style.height = document.getElementById('viewer').scrollHeight + "px"
      document.getElementById('viewerContainer').style.width = width
    }

    setInterval(updateSizes, 100)

    document.getElementById('zoom').addEventListener('touchstart', start, false);
    document.getElementById('zoom').addEventListener('touchmove', move, false);
  }

  const init = async () => {
    const PDFURL = window.location.search.replace('?url=', '').length > 10 ? '/api/pdf/' + window.location.search : null;
    if (!PDFURL) {
      alert("PDF Not Found");
      return;
    }
  }

  useEffect(() => {
    if (window) {
      init();
      resizer();
    }

  }, []);

  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="google" content="notranslate" />
        <title>PDF.js viewer</title>

        <link rel="stylesheet" href="./pdfjs/web/viewer.css" />

        <link rel="resource" type="application/l10n" href="./pdfjs/web/locale/locale.properties" />
        <script src="./pdfjs/build/pdf.js" async ></script>

        <script src="./pdfjs/web/viewer.js" async ></script>
        <html dir="ltr" mozdisallowselectionprint />

      </Head>

      <Page />
    </>
  )
}