import React from 'react';
import styled from 'styled-components';

type FancyButtonProps = {
    buttonText: string;
};

const FancyButton = ({ buttonText }: FancyButtonProps) => {
    return (
        <StyledWrapper>
            <button className="button">
                <div className="dots_border" />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="sparkle"
                >
                    <path
                        className="path"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        stroke="black"
                        fill="black"
                        d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
                    />
                </svg>
                <span className="text_button">{buttonText}</span>
            </button>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .button {
    --border_radius: 9999px;
    --transition: 0.3s ease-in-out;
    --offset: 2px;
    --orange-500: #fe6334;
    --orange-600: #e95625;
    --magenta-900: #690b3d;

    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: transparent;
    border: none;
    border-radius: var(--border_radius);
    transform: scale(calc(1 + (var(--active, 0) * 0.08)));
    transition: transform var(--transition);
  }

  .button::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--magenta-900);
    border-radius: var(--border_radius);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4),
      0 0 0 calc(var(--active, 0) * 0.375rem) var(--orange-500);
    transition: all var(--transition);
    z-index: 0;
  }

  .button::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--orange-500), var(--orange-600));
    opacity: var(--active, 0);
    border-radius: var(--border_radius);
    transition: opacity var(--transition);
    z-index: 2;
  }

  .button:is(:hover, :focus-visible) {
    --active: 1;
  }

  .button:active {
    transform: scale(1);
  }

  .dots_border {
  position: absolute;
  inset: 0;
  border-radius: var(--border_radius);
  overflow: hidden;
  box-shadow: 0 0 12px 3px rgba(254, 99, 52, 0.6), 0 0 25px 6px rgba(254, 99, 52, 0.3);
  }

  @keyframes rotate {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  .sparkle {
    width: 1.75rem;
    color: var(--orange-500);
    z-index: 10;
  }

  .path {
    fill: currentColor;
    stroke: currentColor;
    transform-origin: center;
  }

  .button:is(:hover, :focus) .path {
    animation: sparklePulse 1.5s ease-in-out infinite;
  }

  @keyframes sparklePulse {
    0%, 100% {
      transform: scale(1);
      color: var(--orange-500);
    }
    50% {
      transform: scale(1.3);
      color: #ffffff;
    }
  }

  .text_button {
    position: relative;
    z-index: 10;
    background-image: linear-gradient(90deg, white, #fee832);
    background-clip: text;
    font-size: 1.25rem;
    font-weight: 800;
    color: transparent;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
`;

export default FancyButton;
