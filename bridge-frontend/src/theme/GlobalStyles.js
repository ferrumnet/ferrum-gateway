import { createGlobalStyle } from "styled-components";
// import "../assets/scss/styles.scss";

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.body};
    color: ${({ theme }) => theme.colors.textPri};
    font-family: ${({ theme }) => theme.font};
    transition: all 0.15s linear;
  }
  .navbar {
    background: ${({ theme }) => theme.colors.headercolor};
  }
  a {
    color: ${({ theme }) => theme.colors.link.textPri};
    cursor: pointer;
  }
  .btn {  
    border-radius:  ${({ theme }) =>
      theme.colors.button.borderRadius} !important;
    &.btn-pri {
      background-color: ${({ theme }) => theme.colors.button.btnPri};
      color: ${({ theme }) => theme.colors.button.textPri};
    }
    &.btn-sec {
      background-color: ${({ theme }) => theme.colors.button.btnSec};
      color: ${({ theme }) => theme.colors.button.textSec};
    }
    &.btn-dull {
      background-color: ${({ theme }) => theme.colors.button.btnDull};
    }
    &.btn-theme {
      background-color: ${({ theme }) => theme.colors.themeColor};
      color: ${({ theme }) => theme.colors.button.textPri};
    }
  }
  label {
    color: ${({ theme }) => theme.colors.input.textSec};
  }
  .input-group {
    label {
      color: ${({ theme }) => theme.colors.input.inputSec};
    }
    input {
      color: ${({ theme }) => theme.colors.input.inputPri};
      &:placeholder {
        color: ${({ theme }) => theme.colors.input.inputPri};
      }
      &:focus {
        color: ${({ theme }) => theme.colors.input.inputPri};
      }
    }
  }
  .card {
    background-color: ${({ theme }) => theme.colors.card.cardPri};
    border-radius:  ${({ theme }) => theme.colors.card.borderRadius} !important;
    p {
      color: ${({ theme }) => theme.colors.card.cardTextPri};
    }
    &.card-sec {
      background-color: ${({ theme }) => theme.colors.card.cardSec};
      p {
        color: ${({ theme }) => theme.colors.card.cardTextPri};
      }
    }
  }
  .text-pri {
    color: ${({ theme }) => theme.colors.textPri};
  }
  .text-sec {
    color: ${({ theme }) => theme.colors.textSec};
  }
  .step-link small{ 
    color: ${({ theme }) => theme.colors.textSec};
  }
  .mini-underline:after {
    background-color: ${({ theme }) => theme.colors.borderColor};
  }
  
  .step-link.is-selected .step-circle {
      background-color: ${({ theme }) => theme.colors.themeColor};
  }
  .dropdown-menu {
    .search-filter {
      input {
        background: none;
      }
    }
    a {
      color: ${({ theme }) => theme.colors.textSec};
      background-color: ${({ theme }) => theme.colors.body};
      &:hover {
        background: rgba(${({ theme }) => theme.colors.textPri}, .25);
      }
    }
  }
  .modal {
    .modal-content {
      background-color: ${({ theme }) => theme.colors.themePrimary};
      .modal-header {
        border: 0;
      }
      .modal-footer {
        border: 0;
      }
    }
  }
`;
