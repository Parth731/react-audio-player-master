import React, { useRef, useState, useCallback } from "react";
import { WaveForm, WaveSurfer } from "wavesurfer-react";
import AudioPlayers from "./components/Main/AudioPlayers";
import { Audiop } from "./components/Waveform/Audiop";
const music1 = require("./img/music1.mp3");
const music2 = require("./img/music2.mp3");
const music3 = require("./img/music3.mp3");

export const App = () => {
  const urls = [music1, music2, music3];
  const wavesurferRef = useRef([]);
  const audioFileref = useRef();
  const audioPlayerRef = useRef();

  const play = useCallback((index) => {
    if (!wavesurferRef.current[index].isPlaying()) {
      //   wavesurferRef.current[index].playPause();
      wavesurferRef.current[index].play();
    } else {
      wavesurferRef.current[index].pause();
    }
  }, []);

  const handleWSMount = useCallback((waveSurfer, index, url) => {
    //   if (waveSurfer.markers) {
    //     waveSurfer.clearMarkers();
    //   }
    const track = document.querySelector(`#track${index}`);
    // console.log(waveSurfer, index);
    // console.log(track);
    wavesurferRef.current[index] = waveSurfer;
    // console.log(waveSurfer.current);
    if (wavesurferRef.current) {
      wavesurferRef.current[index].load(url);

      // wavesurferRef.current.on('region-created', regionCreatedHandler);
      console.log(wavesurferRef.current);

      wavesurferRef.current[index].on("ready", () => {
        console.log("WaveSurfer is ready");
      });

      // wavesurferRef.current.on('region-removed', (region) => {
      //   console.log('region-removed --> ', region);
      // });

      wavesurferRef.current[index].on("loading", (data) => {
        // console.log("loading --> ", data);
      });

      if (window) {
        // window.surferidze = wavesurferRef.current;
      }
    }
  }, []);

  return (
    <div>
      <AudioPlayers />
      {[1, 2, 3].map((item, index) => {
        console.log(urls[index].default);
        return (
          <>
            <WaveSurfer
              onMount={(e) => handleWSMount(e, index, urls[index].default)}
            >
              <WaveForm
                id={`waveform${index}`}
                cursorColor="transparent"
                barWidth={7}
              />
            </WaveSurfer>
            <Audiop
              url={urls[index].default}
              audioPlayerRef={audioPlayerRef}
              waveformCurrent={wavesurferRef.current}
              id={index}
            />
            {/* <AudioPlayers /> */}
          </>
        );
      })}
    </div>
  );
};
