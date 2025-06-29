import React from 'react'
import TextPressure from '../Ui/TextPressure';
import TiltedCards from '../Ui/TiltedCards';
import MeetDevelopers from '../Ui/MeetDevelopers';

function Home() {
  return (
    <div className=' min-h-[95vh]' style={{backgroundImage: 'url(/image.jpeg)',backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundPosition: 'center',backgroundAttachment: 'fixed',}}>
      
      {/* land Section */}
      <div className="h-auto flex items-center justify-center bg-center bg-cover pt-[7vh] ">
        <TextPressure
          text="Welcome to Avi!"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="#0000000"
          strokeColor="#ff0000"
          minFontSize={12}
        />
      </div>

      {/* Chatbot display section */}
      <div className='flex items-center justify-center pt-12 '>
        <TiltedCards/>
      </div>

{/* features */}
      <div className="flex justify-center items-center w-full">
  <div className="backdrop-blur-md rounded-xl p-4 border shadow-lg mt-10 w-[90vw] max-w-6xl"
    style={{
      backgroundColor: "rgba(255,255,255,0.1)",
      borderColor: "rgba(255,255,255,0.3)"
    }}>

    <h2 className="text-3xl font-bold text-center text-black mb-10">Features</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 text-center">
      <div>
        <div className="text-5xl mb-4">🎙️</div>
        <h3 className="text-xl font-semibold text-black mb-2">Voice to Voice <br></br>(Exclusive)</h3>
        <p className="text-black opacity-80">Converse with Speak Avi culturally in natural speech.</p>
      </div>
      <div>
        <div className="text-5xl mb-4">🗣️</div>
        <h3 className="text-xl font-semibold text-black mb-2">Multilingual</h3>
        <p className="text-black opacity-80">Supports Hindi, Telugu, Kannada, Tamil and more.</p>
      </div>
      <div>
        <div className="text-5xl mb-4">💬</div>
        <h3 className="text-xl font-semibold text-black mb-2">Chat to Chat </h3>
        <p className="text-black opacity-80">Text based interaction with heritage context.</p>
      </div>
      
      <div>
        <div className="text-5xl mb-4">🎧</div>
        <h3 className="text-xl font-semibold text-black mb-2">Background Music</h3>
        <p className="text-black opacity-80">Keeps you calm, focused also entertained</p>
      </div>
    </div>

  </div>
</div>

{/* Meet devs */}
<MeetDevelopers></MeetDevelopers>
    </div>
  )
}

export default Home
