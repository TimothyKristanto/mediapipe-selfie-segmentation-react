import './App.css'
import { useRef, useEffect } from 'react'
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation'
import { Camera } from '@mediapipe/camera_utils'
import Webcam from 'react-webcam'

const App = () => {
  const videoElement = useRef()
  const canvasElement = useRef()

  function onResults(results) {
    const canvasCtx = canvasElement.current.getContext('2d')

    canvasCtx.save()
    canvasCtx.clearRect(
      0,
      0,
      canvasElement.current.width,
      canvasElement.current.height
    )
    canvasCtx.drawImage(
      results.segmentationMask,
      0,
      0,
      canvasElement.current.width,
      canvasElement.current.height
    )

    canvasCtx.globalCompositeOperation = 'source-in'
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.current.width,
      canvasElement.current.height
    )

    // Only overwrite existing pixels.
    canvasCtx.globalCompositeOperation = 'destination-atop'
    canvasCtx.fillStyle = '#00FF00'
    canvasCtx.fillRect(
      0,
      0,
      canvasElement.current.width,
      canvasElement.current.height
    )

    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = 'destination-atop'
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.current.width,
      canvasElement.current.height
    )

    canvasCtx.restore()
  }

  useEffect(() => {
    console.log('test')

    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
      },
    })
    selfieSegmentation.setOptions({
      modelSelection: 1,
    })

    console.log(selfieSegmentation)

    selfieSegmentation.onResults(onResults)

    if (
      typeof videoElement.current !== 'undefined' &&
      videoElement.current !== null
    ) {
      const camera = new Camera(videoElement.current.video, {
        onFrame: async () => {
          await selfieSegmentation.send({ image: videoElement.current.video })
        },
        width: 1280,
        height: 720,
      })
      camera.start()
    }
  }, [])

  return (
    <div>
      <div className="container">
        <Webcam
          audio={false}
          // mirrored={true}
          // height={720}
          ref={videoElement}
          // screenshotFormat="image/jpeg"
          // width={1280}
          // videoConstraints={videoConstraints}
          // onUserMedia={() => {
          //   console.log('webcamRef.current', webcamRef.current);
          //   // navigator.mediaDevices
          //   //   .getUserMedia({ video: true })
          //   //   .then(stream => webcamRef.current.srcObject = stream)
          //   //   .catch(console.log);

          //   setCameraReady(true)
          // }}
        />
        <canvas ref={canvasElement}></canvas>
      </div>
    </div>
  )
}

export default App
