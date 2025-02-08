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
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className="position-relative" style={{ height: "600px" }}>
        <img src="/images/university.jpg" alt="University" className="w-100 h-100 object-fit-cover" />
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          {/* <h1 className="text-white display-4 fw-bold">Welcome to Hall Management System</h1> */}
        </div>
      </div>

      {/* Animated Hall Photos Section */}
      <div className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Our Halls</h2>
          <div className="position-relative" style={{ height: "400px" }}>
            {hallPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo || "/placeholder.svg"}
                alt={`Hall ${index + 1}`}
                className={`position-absolute top-0 start-0 w-100 h-100 object-fit-cover ${
                  index === currentHallIndex ? "opacity-100" : "opacity-0"
                }`}
                style={{ transition: "opacity 1s" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Frequently Asked Questions</h2>
          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div className="accordion-item" key={faq._id}>
                <h3 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse${index}`}
                  >
                    {faq.question}
                  </button>
                </h3>
                <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

