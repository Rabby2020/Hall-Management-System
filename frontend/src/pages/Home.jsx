"use client"

import { useState, useEffect } from "react"
import axios from "axios"

function Home() {
  const [currentHallIndex, setCurrentHallIndex] = useState(0)
  const [faqs, setFaqs] = useState([])
  const hallPhotos = ["/images/hall1.jpg", "/images/hall2.jpg", "/images/hall3.jpg", "/images/hall4.jpg", "/images/hall5.jpg", "/images/hall6.jpg"]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHallIndex((prevIndex) => (prevIndex + 1) % hallPhotos.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get("/api/faqs")
        setFaqs(response.data)
      } catch (error) {
        console.error("Error fetching FAQs:", error)
      }
    }

    fetchFaqs()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-96">
        <img src="/images/university.jpg" alt="University" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">Welcome to Hall Management System</h1>
        </div>
      </div>

      {/* Animated Hall Photos Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Our Halls</h2>
          <div className="relative h-96">
            {hallPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo || "/placeholder.svg"}
                alt={`Hall ${index + 1}`}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentHallIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq._id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

