import React, { useState } from "react";

const WhatsAppButton = ({
  phoneNumber = "923",
  message = "Hello! I'm interested in your suits 👗",
}) => {
  const [hovered, setHovered] = useState(false);

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <>
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="whatsapp-button"
      >
        {/* Tooltip */}
        <div
          className={`whatsapp-tooltip ${
            hovered ? "whatsapp-tooltip-show" : ""
          }`}
        >
          Order on WhatsApp 🛍️
        </div>

        {/* Button */}
        <div
          className={`whatsapp-icon-wrapper ${
            hovered ? "whatsapp-icon-hover" : ""
          }`}
        >
          {/* WhatsApp SVG Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="30"
            height="30"
            fill="white"
          >
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.675 4.8 1.85 6.793L2 30l7.42-1.82A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.832-1.594l-.418-.248-4.33 1.063 1.094-4.215-.272-.434A11.467 11.467 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.61c-.345-.172-2.04-1.006-2.356-1.12-.316-.115-.547-.172-.777.172-.23.345-.892 1.12-1.093 1.35-.2.23-.402.258-.747.086-.345-.172-1.455-.537-2.77-1.709-1.024-.913-1.715-2.04-1.916-2.385-.2-.345-.021-.531.15-.703.155-.155.345-.402.518-.603.172-.2.23-.345.345-.575.115-.23.058-.432-.029-.603-.086-.172-.777-1.873-1.065-2.564-.28-.674-.564-.583-.777-.593l-.662-.011c-.23 0-.603.086-.919.432s-1.207 1.178-1.207 2.873 1.236 3.332 1.408 3.562c.172.23 2.433 3.714 5.896 5.208.824.356 1.467.569 1.968.728.827.263 1.58.226 2.175.137.663-.1 2.04-.834 2.327-1.638.287-.804.287-1.493.2-1.638-.086-.143-.316-.23-.66-.402z" />
          </svg>
        </div>

        {/* Pulse Ring */}
        <span className="whatsapp-pulse"></span>
      </a>

      <style>{`
        .whatsapp-button {
          position: fixed;
          bottom: 28px;
          right: 24px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .whatsapp-tooltip {
          background: #ffffff;
          color: #128c7e;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
          white-space: nowrap;
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .whatsapp-tooltip-show {
          opacity: 1;
          transform: translateX(0);
        }

        .whatsapp-icon-wrapper {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #25d366;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);
          transform: scale(1);
          transition: all 0.3s ease;
          z-index: 2;
        }

        .whatsapp-icon-hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
        }

        .whatsapp-pulse {
          position: absolute;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #25d366;
          animation: pulse-ring 1.8s ease-out infinite;
          z-index: 1;
          pointer-events: none;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }

          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @media (max-width: 600px) {
          .whatsapp-button {
            bottom: 20px;
            right: 18px;
          }

          .whatsapp-tooltip {
            display: none;
          }

          .whatsapp-icon-wrapper {
            width: 54px;
            height: 54px;
          }

          .whatsapp-pulse {
            width: 54px;
            height: 54px;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsAppButton;