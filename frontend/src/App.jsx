import { useState } from 'react'
import LiveKitModal from './components/LiveKitModal';


function App() {
  const [showSupport, setShowSupport] = useState(false);

  const handleSupportClick = () => {
    setShowSupport(true)
  }

  return (
    <div className="font-sans min-h-screen flex flex-col">
    <header className="fixed flex justify-between items-center pt-4 lg:pt-4 xl:pt-8 pl-4 lg:pl-5 xl:pl-10 bg-[#232323] text-white">
      <div className="text-xl font-bold w-24 lg:w-30 xl:w-34">
        <img src="rise-logo.png" alt="" />
      </div>
    </header>

      <main className="flex flex-1">
        <section className="flex-1 flex flex-col justify-center text-center px-2 bg-[#232323]">
          <h1 className="text-2xl lg:text-3xl xl:text-4xl mb-4 text-white font-bold">Get the Right Parts. Right Now</h1>
          <p className='text-[#615e5e] text-sm lg:text-base xl:text-lg'>Free Next Day Delivery on Eligible Orders</p>
          <div className="w-full flex justify-center gap-2 my-4">
            <input
              type="text"
              placeholder="Enter vehicle or part number"
              className="w-full max-w-[250px] lg:max-w-[450px] xl:max-w-[600px] p-2 lg:p-2 xl:p-3 border-2 rounded-full text-[#615e5e] text-base placeholder:text-[#615e5e] placeholder:text-sm lg:placeholder:text-base xl:placeholder:text-lg"
            />
            <button className="px-2.5 lg:px-5 xl:px-6 py-1 bg-white text-sm text-black rounded-full cursor-pointer">
              Search
            </button>
          </div>

          <button
            className="fixed bottom-8 right-8 py-3 lg:py-3 xl:py-4 px-4 lg:px-5 xl:px-8 bg-[#d52b1e] text-white rounded-full text-sm lg:text-base xl:text-lg  shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-transform hover:scale-105"
            onClick={handleSupportClick}
          >
            Talk to an Agent!
          </button>
        </section>
      </main>

      {showSupport && <LiveKitModal setShowSupport={setShowSupport} />}
    </div>
  )
}

export default App