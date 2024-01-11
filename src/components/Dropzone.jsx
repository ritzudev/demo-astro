import { useCallback, useState, useEffect }from 'react';
import { useDropzone } from 'react-dropzone'
//import { BackgroundRemoval  } from '@imgly/background-removal'

import imglyRemoveBackground from '@imgly/background-removal';
import { ImgComparisonSlider } from '@img-comparison-slider/react';

export const prerender = false

const images = [
  'https://images.unsplash.com/photo-1686002359940-6a51b0d64f68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80',
  'https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9'
];

/* async function load() {
  setIsRunning(true)
  resetTimer()
  setImageUrl(randomImage);

  const imageBlob = await removeBackground(randomImage, {
    publicPath: `${window.location.href}/static/js/`,
    // debug: true,
    progress: (key, current, total) => {
      const [type, subtype] = key.split(':');
      setCaption(
        `${type} ${subtype} ${((current / total) * 100).toFixed(0)}%`
      );
    }
  });

  const url = URL.createObjectURL(imageBlob);

  setImageUrl(url);
  setIsRunning(false);
  stopTimer();
} */

//const [image, setImage] = useState('')

function calculateSecondsBetweenDates(startDate, endDate) {
  const milliseconds = endDate - startDate;
  const seconds = (milliseconds / 1000.0).toFixed(1);
  return seconds;
}

export function DropZoneComponent() {
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('https://www.telegraph.co.uk/content/dam/football/2023/03/16/TELEMMGLPICT000326896477_trans_NvBQzQNjv4BqJcU40rhfB9vms2nALGg7Ip7gf-9Zjfhn0SZ1-MjcVcw.jpeg');
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startDate, setStartDate] = useState(Date.now());
  const [caption, setCaption] = useState('Click me to remove background');

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(calculateSecondsBetweenDates(startDate, Date.now()));
        // console.log(seconds);
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRunning, startDate]);

  const resetTimer = () => {
    setIsRunning(true);
    setStartDate(Date.now());
    setSeconds(0);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const image_src = 'https://www.telegraph.co.uk/content/dam/football/2023/03/16/TELEMMGLPICT000326896477_trans_NvBQzQNjv4BqJcU40rhfB9vms2nALGg7Ip7gf-9Zjfhn0SZ1-MjcVcw.jpeg';

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    try {
      console.log('init');
      setIsRunning(true);
      resetTimer();
      const image_src = 'https://www.telegraph.co.uk/content/dam/football/2023/03/16/TELEMMGLPICT000326896477_trans_NvBQzQNjv4BqJcU40rhfB9vms2nALGg7Ip7gf-9Zjfhn0SZ1-MjcVcw.jpeg';
      const blob = await imglyRemoveBackground(acceptedFiles[0]);
      const url = URL.createObjectURL(blob);
      setIsRunning(false);
      stopTimer();
      setImage(url);
      console.log('end');
    } catch (error) {
      console.error("Error al quitar el fondo:", error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop });

  return (
    <>
      <div className='flex justify-end py-6'>
        <button className='bg-green-400 p-2 rounded-lg text-xl' disabled={isRunning} onClick={() => load()}>
            Click me {seconds}
        </button>
      </div>
      <style>
        {`
          .slider-example-split-line {
            --divider-width: 4px;
            --divider-color: #13151a;
            --default-handle-width: clamp(10px, 20vw, 100px);
          }
        `}
      </style>
      { acceptedFiles[0] ? (
          <div className='p-4 bg-[#27272a] rounded-lg'>
            <ImgComparisonSlider className='slider-example-split-line' hover="hover">
            <img slot="first"  width="100%"  src={URL.createObjectURL(acceptedFiles[0])} />
            <img slot="second" width="100%"  src={image} />
            {/* <img slot="first"  width="100%"  src={image_src} />
            <img slot="second" width="100%"  src={image_src} /> */}
          </ImgComparisonSlider>
          </div>
        ) : (
          <div style={dropzoneStyles} {...getRootProps()}>
        <input disabled {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
      </div>
        )
      }
      
    </>
  );
}

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};


 {/* <img className='px-10' src={URL.createObjectURL(acceptedFiles[0])} alt="" /> */}