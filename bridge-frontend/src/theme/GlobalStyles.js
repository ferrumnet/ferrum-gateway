import { createGlobalStyle} from "styled-components";
// import "../assets/scss/styles.scss";

export const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.body};
    font-family: ${({ theme }) => theme.font};
    color: ${({ theme }) => theme.colors.textSec};
    transition: all 0.15s linear;
    box-shadow:  ${({ theme }) => theme.useBgImage ? 'inset 0 0 0 2000px rgba(0,0,0,0.4)' : ''};
    font-size: 1em;
    background: ${({ theme }) => theme.useBgImage ? `url(${theme.BgImage})` : ''};
    background-image: ${({ theme }) => theme.useBgImage ? `url(${theme.BgImage})` : ''};
    height: 100%;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
  }
  .head{
    font-size: 13px
  }
  h2,h3,h4,h5 {
    color: ${({ theme }) => theme.colors.text};
  }
  .navbar {
    background: ${({ theme }) => theme.colors.headercolor};
  }
  .ant-alert-description: {
    font-size: 11px
  }
  .site-badge-count-109 {
    .ant-badge-count{
      background-color:  ${({ theme }) => theme.colors.card.cardPri} !important;
      color: ${({ theme }) => theme.colors.inverse} !important;
    }
  }
  .transparent {
    background-color: transparent !important;
   
  }
  .disabled{
    font-size: 15px; !important;
    opacity: 0.5
  }
  a {
    color: ${({ theme }) => theme.colors.link.textPri};
    cursor: pointer;
  }
  .btn {  
    border-radius:  ${({ theme }) =>
      theme.colors.button.borderRadius} !important;
    &.action {
      padding: 12px 35px;
      margin-top: 0px;
      margin-bottom: 10px;
    }
    &.liqaction {
      padding: 20px 35px;
      margin-top: 0px;
      margin-bottom: 25px;

      &.btn-connect {
        max-width: 100%
      }
    }
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
      border-color: #00000029 !important;
      border-style: solid !important;
      border-width: thin !important;
    }
    &.btn-theme {
      background-color: ${({ theme }) => theme.colors.themeColor};
      color: ${({ theme }) => theme.colors.button.textPri};
    }
  }
  h2, h3, h4, h5 {
    color: ${({ theme }) => theme.colors.mainHeaderColor};
  }
  .liquidity-dropdown{
    button {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #ced4da12 !important;
      border-radius: 1px;
      padding: 10px;
      height: 45px;
      color: white;
      font-weight: 200;
      font-weight: bold;
      border: 1px solid #ced4da !important;

      &:focus{
        background-color: transparent!important;
      }

      span{
        font-weight: 400;
        font-size: 14px;  
        color: ${({ theme }) => theme.colors.textSec};  
      }

    }
    .dropdown-menu{
      a{
        padding: 1rem 1rem;
      }
    }
  }
  label {
    color: ${({ theme }) => theme.colors.input.textSec};
  }
  .input-group {
    label {
      color: ${({ theme }) => theme.colors.inverse};
    }
    input {
      color: ${({ theme }) => theme.colors.inverse} !important;
      &:placeholder {
        color: ${({ theme }) => theme.colors.input.inputPri};
      }
      &:focus {
        color: ${({ theme }) => theme.colors.input.inputPri};
      }
    }
  }
  .card {
    border-radius: 0px!important;
    background-color: ${({ theme }) => theme.colors.card.cardPri};
    border-radius:  ${({ theme }) => theme.colors.card.borderRadius + 2} !important;
    border-color: ${({ theme }) => theme.colors.inverse};
    box-shadow: ${({ theme }) => `-2px -1px 5px 2px ${theme.colors.inverse}25` };
    p {
      color: ${({ theme }) => theme.colors.card.text};
    }
    &.card-sec {
      background-color: ${({ theme }) => theme.colors.card.cardSec};
      p {
        color: ${({ theme }) => theme.colors.card.cardTextPri};
      }
    }
  }
  .text-vary-color: {
    color: ${({ theme }) => theme.colors.button.text};
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
  .ant-steps-item-title{
    color: ${({ theme }) => theme.colors.inverse} !important;
  }
  .ant-steps-icon{
    color: ${({ theme }) => theme.colors.inverse} !important;
    span{
      color: ${({ theme }) => theme.colors.inverse} !important;
    }
  }
  .ant-steps-item-wait {
    .ant-steps-item-icon {
     background-color:  ${({ theme }) => theme.colors.button.btnPri};
    }
  }
  .anticon{
    .ant-steps-finish-icon{
      color: ${({ theme }) => theme.colors.card.cardPri} !important;
      span{
        color: ${({ theme }) => theme.colors.card.cardPri} !important;
      }
    }
  }
  .ant-steps-item-description{
    color: ${({ theme }) => theme.colors.inverse} !important;
    >*{
      color: ${({ theme }) => theme.colors.textSec} !important;

      span{
        color: ${({ theme }) => theme.colors.textSec} !important;
      }
    }
  }
  .ant-steps-item-finish {
    .ant-steps-item-icon{
      background-color: #168416;
      border-color: #168416;
    }
  }
  .ant-steps-item-finish > {
    .ant-steps-item-icon{
      background-color: #168416;
      border-color: #168416;
    }
    .ant-steps-item-container > {
      .ant-steps-item-tail::after {
        background-color: #168416
      }
    } 
  }
  .text-vary-color{
    color: ${({ theme }) => theme.colors.inverse} !important;
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
