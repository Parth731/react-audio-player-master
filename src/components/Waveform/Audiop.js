import React, { forwardRef, useEffect, useRef, useState } from "react";
import ControlPanel from "../controls/ControlPanel";
import Slider from "../slider/Slider";
import "./audioform.css";
const muteIcon = require("./icons/mute.svg");
const pauseIcon = require("./icons/pause.svg");
const playIcon = require("./icons/play.svg");
const volumeIcon = require("./icons/volume.svg");

console.log(volumeIcon);

export const Audiop = forwardRef(({ url, id, waveformCurrent }) => {
  const [percentage, setPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volumeVal, setVolumeVal] = useState(0);
  const audioPlayerRef = useRef();
  const [ismuteIcon, setisMuteIcon] = useState();
  const [isMute, setIsMute] = useState(false);

  useEffect(() => {
    window.console.log(audioPlayerRef.current, waveformCurrent);
    waveformCurrent[id].load(audioPlayerRef.current);
    waveformCurrent[id].on("ready", () => {
      console.log(volumeVal);
      waveformCurrent[id].setVolume(volumeVal / 100);
      audioPlayerRef.current.volume = volumeVal / 100;
      setisMuteIcon(volumeIcon.default);
      console.log(waveformCurrent[id].getVolume());
    });
  }, []);

  const setVolumeFromLocalStorage = () => {
    console.log(volumeVal);
    setVolumeVal(volumeVal * 100 || 50);
  };

  const onChange = (e) => {
    const audio = audioPlayerRef.current;
    // console.log(waveformCurrent[id].getDuration(), audio.duration);
    // audio.currentTime = (audio.duration / 100) * e.target.value;
    audio.currentTime =
      (waveformCurrent[id].getDuration() / 100) * e.target.value;
    // waveformCurrent[id].seekTo(audio.currentTime);
    setPercentage(e.target.value);
  };

  const play = () => {
    console.log(audioPlayerRef.current);
    const audio = audioPlayerRef.current;
    audio.volume = 1;
    // waveformCurrent[id].on("ready", () => {
    //   if (!isPlaying) {
    //     setIsPlaying(true);
    //     //   audio.play();
    //     waveformCurrent[id].play();
    //   }

    //   if (isPlaying) {
    //     setIsPlaying(false);
    //     //   audio.pause();
    //     waveformCurrent[id].pause();
    //   }
    // });
    if (!isPlaying) {
      setIsPlaying(true);
      audio.play();
      waveformCurrent[id].play();
      console.log(
        waveformCurrent[id].getDuration(),
        waveformCurrent[id].getCurrentTime()
      );
    }

    if (isPlaying) {
      setIsPlaying(false);
      audio.pause();
      waveformCurrent[id].pause();
      console.log(
        waveformCurrent[id].getDuration(),
        waveformCurrent[id].getCurrentTime()
      );
    }
  };

  const getCurrDuration = (e) => {
    const percent = (
      (e.currentTarget.currentTime / e.currentTarget.duration) *
      100
    ).toFixed(2);
    const time = e.currentTarget.currentTime;
    // console.log(time);
    waveformCurrent[id].seekTo(
      time.toFixed(2) / waveformCurrent[id].getDuration()
    );
    setPercentage(+percent);
    setCurrentTime(time.toFixed(2));
  };

  const handleVolumeChange = (e) => {
    console.log(e.target.value);
    const volume = e.target.value / 100;
    console.log(volume, e.target.value);
    waveformCurrent[id].setVolume(volume);
    audioPlayerRef.current.volume = volume;
    setVolumeVal(e.target.value);
  };

  const toggleMute = () => {
    // const isMuted = waveformCurrent[id].getMute();
    // console.log(isMuted);
    const h = waveformCurrent[id].toggleMute();
    console.log(h);

    const isMuted = waveformCurrent[id].getMute();
    console.log(isMuted);
    setIsMute(isMuted);
    if (isMuted) {
      //   volumeIcon.src = "assets/icons/mute.svg";
      //   volumeSlider.disabled = true;
      //   waveformCurrent[id].setMute(true);
      audioPlayerRef.current.volume = false;
      setisMuteIcon(muteIcon.default);
    } else {
      //   volumeSlider.disabled = false;
      //   waveformCurrent[id].setMute(false);
      //   volumeIcon.src = "assets/icons/volume.svg";
      audioPlayerRef.current.volume = true;
      setisMuteIcon(volumeIcon.default);
    }
  };

  return (
    <div>
      <button onClick={() => play()}>play/pause</button>
      <div className="app-container">
        <Slider percentage={percentage} onChange={onChange} />
        <audio
          ref={audioPlayerRef}
          onTimeUpdate={getCurrDuration}
          onLoadedData={(e) => {
            console.log(e.currentTarget);
            setDuration(e.currentTarget.duration.toFixed(2));
          }}
          src={url}
        />
        <ControlPanel
          play={play}
          isPlaying={isPlaying}
          duration={duration}
          currentTime={currentTime}
        />
        <div className="controls">
          <div className="volume">
            <img
              id="volumeIcon"
              className="volume-icon"
              src={ismuteIcon}
              alt="Volume"
              onClick={toggleMute}
            />
            <input
              id="volumeSlider"
              className="volume-slider"
              type="range"
              name="volume-slider"
              min="0"
              max="100"
              value={volumeVal || 50}
              onInput={handleVolumeChange}
              disabled={isMute ? true : false}
              //   onLoad={() => setVolumeFromLocalStorage()}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
