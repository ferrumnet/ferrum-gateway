import { createGlobalStyle } from "styled-components";
// import "../assets/scss/styles.scss";

export const GlobalStyles = createGlobalStyle`
  body{
    color: ${({ theme }) => theme.colors.inverse} !important;
  }
  
  .bodyText {
    color: ${({ theme }) => theme.colors.inverse} !important;
  }
  #root {
    background-color: ${({ theme }) => theme.colors.body};
    font-family: ${({ theme }) => theme.font};
    color: ${({ theme }) => theme.colors.textSec};
    transition: all 0.15s linear;
    box-shadow:  ${({ theme }) =>
      theme.useBgImage ? "inset 0 0 0 2000px rgba(0,0,0,0.4)" : ""};
    font-size: 1em;
    background: ${({ theme }) =>
      theme.backgroundImage
        ? `url(${theme.backgroundImage})`
        : theme.useBgImage
        ? `url(${theme.BgImage})`
        : ""};
    background-image: ${({ theme }) =>
      theme.backgroundImage
        ? `url(${theme.backgroundImage})`
        : theme.useBgImage
        ? `url(${theme.BgImage})`
        : ""};
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    min-height: 100vh;
  }
  .head{
    font-size: 13px;
  }
  h2,h3,h4,h5 {
    color: ${({ theme }) => theme.colors.text};
  }
  .navbar {
    background-color: ${({ theme }) => theme.colors.navbar};
  }
  .ant-alert-description: {
    font-size: 11px
  }
  .site-badge-count-109 {
    .ant-badge-count{
      background:  ${({ theme }) => theme.colors.card.cardPri} !important;
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
  .btnTheme {
    background: ${({ theme }) => theme.colors.button.btnPri} !important;
    border-radius:  ${({ theme }) =>
      theme.colors.button.borderRadius} !important;
    border-width: 0;
    &:focus,
    &:active,
    &:hover
    {
      background: ${({ theme }) =>
        theme.colors.button.btnActiveColor ||
        theme.colors.button.themePrimary} !important;
    }
  }
  button {
    .ant-btn {
      .btnTheme {
        .btn-pri {
          back
          color: ${({ theme }) =>
            theme.colors.button.btnTextPriColor} !important;
          &:hover {
            color: ${({ theme }) =>
              theme.colors.button.btnTextPriColor} !important;
              background: ${({ theme }) =>
                theme.colors.button.btnActiveColor ||
                theme.colors.button.themePrimary} !important;
          }
        }
      }
    }
  }
  .clsBtn{
    width: 200px !important;
    height: 50px !important;
  }
  .listTheme{
    border-bottom: 0.5px solid  ${({ theme }) => theme.colors.card.cardSec};
  }
  .btn {  
    border-radius:  ${({ theme }) =>
      theme.radius
        ? theme.radius
        : theme.colors.button.borderRadius} !important;
    padding: ${({ theme }) =>
      theme.colors.button.btnPadding || "auto"} !important;
    color: ${({ theme }) => theme.colors.button.btnTextPriColor} !important;
    &:focus,
    &:active,
    &:hover
    {
      background: ${({ theme }) =>
        theme.colors.button.btnActiveColor ||
        theme.colors.button.themePrimary} !important;
      color: ${({ theme }) => theme.colors.button.btnTextSecColor} !important;

    }
    &.action {
      margin-top: 0px;
      margin-bottom: 10px;
      padding: 0.8rem;
    }
    &.liqaction {
      padding: 17px 18px !important;
      margin-top: 0px;
      margin-bottom: 25px;

      &.btn-connect {
        max-width: 100%
      }
    }
    &.btn-pri {
      background-color: ${({ theme }) => theme.colors.button.btnPri};
      background: ${({ theme }) => theme.colors.button.btnPri || "auto"};
      color: ${({ theme }) => theme.colors.button.btnTextPriColor} !important;
      background-size: ${({ theme }) =>
        theme.colors.button.backgroundSize || "auto"}
      border-radius:  ${({ theme }) =>
        theme.radius
          ? theme.radius
          : theme.colors.button.borderRadius} !important;
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
  .opaque{
    opacity: 0;
  }
  .dropdown {
    .dropdown-menu{
      a.active:after{
        color: ${({ theme }) =>
          theme.colors.stepsFinishBackgroundColor || "#168416"};
      }
    }
  }
  .cardTheme {
    background: ${({ theme }) => theme.colors.card.cardPri} !important;
    border-radius:  ${({ theme }) =>
      theme.colors.card.borderRadius || "0" + 2} !important;
    border-color: ${({ theme }) => theme.colors.inverse};
    box-shadow: ${({ theme }) => `${theme.colors.card.boxShadow}`};
    background: ${({ theme }) => theme.colors.card.cardPri} !important;
  }
  .cardSecTheme{
    background-color: ${({ theme }) => theme.colors.card.cardSec};
  }
  .ant-modal-content{
    background: ${({ theme }) => theme.colors.card.cardPri} !important;
  }
  .ant-modal-header{
    border-bottom: 0 !important;
    border-radius:  ${({ theme }) =>
      theme.colors.card.borderRadius || "0" + 2} !important;
    padding-top: 40px;
    background: ${({ theme }) => theme.colors.card.cardPri};
  }
  .ant-drawer-header{
    background: ${({ theme }) => theme.colors.card.cardPri} !important;
    border-bottom: 0 !important;
  }
  .ant-drawer-content{
    background: ${({ theme }) => theme.colors.card.cardPri} !important;
    background: ${({ theme }) => theme.colors.card.cardPri} !important;
  }
  p{
    color: ${({ theme }) => theme.colors.inverse} !important;
  }
  .web3modal-provider-container{
    background-color: ${({ theme }) => theme.colors.card.cardSec} !important;
    border-radius:  ${({ theme }) =>
      theme.colors.card.borderRadius || "0" + 2} !important;
    border-color: ${({ theme }) => theme.colors.inverse};
  }
  .web3modal-provider-wrapper{
    border: none !important 
  }
  .web3modal-modal-card{
    padding: 20px !important;
    background: ${({ theme }) => theme.colors.card.cardPri} !important;
    border-radius:  ${({ theme }) =>
      theme.colors.card.borderRadius || "0" + 2} !important;
    border-color: ${({ theme }) => theme.colors.inverse};
    box-shadow: ${({ theme }) => `${theme.colors.card.boxShadow}`};
    background: ${({ theme }) => theme.colors.card.cardPri} !important;
  }
  .card {
    background: ${({ theme }) => theme.colors.card.cardPri};
    border-radius:  ${({ theme }) =>
      theme.radius
        ? theme.radius
        : theme.colors.card.borderRadius || "0" + 2} !important;
    border-color: ${({ theme }) => theme.colors.inverse};
    box-shadow: ${({ theme }) => `${theme.colors.card.boxShadow}`};
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
  .alertFailColor {
    background-color: rgb(165 0 15) !Important;
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
  .ant-alert-title {
    color: ${({ theme }) => theme.colors.card.cardPri} !important;
    border: none;
  }
  .react-toast-notifications__container{
    .css-19n335a-ToastContainer {
      background-color: ${({ theme }) =>
        theme.colors.stepsFinishBackgroundColor || "#168416"}; 
      color: ${({ theme }) => theme.colors.inverse} !important;
    }
  }
  color: ${({ theme }) => theme.colors.inverse} !important;
  .react-toast-notifications__toast__content.{
    css-18gu508-Content{
      background-color: rgb(165 0 15) !Important;
    }
  }
  .ant-alert-warning{
    color: ${({ theme }) => theme.colors.stepsWaitBackgroundColor} !important;
    border: none;
    background-color:  ${({ theme }) =>
      theme.colors.stepsWaitBackgroundColor} !important;
  }
  .ant-steps-icon{
    color: ${({ theme }) => theme.colors.inverse} !important;
    span{
      color: ${({ theme }) => theme.colors.inverse} !important;
    }
  }
  .ant-steps-item-process {
    .ant-steps-item-icon {
      background:  ${({ theme }) =>
        theme.colors.stepsWaitBackgroundColor};
    }
  }
  .ant-message-notice-content{
    background: ${({ theme }) => theme.colors.card.cardPri};
    border-radius:  ${({ theme }) =>
      theme.colors.card.borderRadius || "0" + 2} !important;
    border-color: ${({ theme }) => theme.colors.inverse};
  }
  .ant-steps-item-wait {
    .ant-steps-item-icon {
     background:  ${({ theme }) =>
       theme.colors.stepsWaitBackgroundColor};
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
  .ant-alert-error{
    background-color: ${({ theme }) =>
      theme.colors.stepsFinishBackgroundColor || "#168416"}; 
    border: none;
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
  .react-toast-notifications__toast--error{
    .react-toast-notifications__toast__content{
      background-color: rgb(165 0 15) !Important;
    }

    .react-toast-notifications__toast__dismiss-button {
      background-color: rgb(165 0 15) !Important;
      opacity: 1
    }
  }
  // todo: clean up selectors
  .react-toast-notifications__toast--success{
    .react-toast-notifications__toast__content{
      background-color: ${({ theme }) =>
        theme.colors.stepsFinishBackgroundColor || "#168416"}; 
    }

    .react-toast-notifications__toast__dismiss-button {
      background-color: ${({ theme }) =>
        theme.colors.stepsFinishBackgroundColor || "#168416"}; 
      opacity: 1
    }
  }
  .ant-steps-item-description >* span {
    color: ${({ theme }) => theme.colors.inverse} !important;
  }
  .finishThemed{
    // background-color: ${({ theme }) =>
      theme.colors.stepsFinishBackgroundColor || "#168416"}; 
    color: ${({ theme }) => theme.colors.inverse} !important;
  }
  .waitThemed{
    border-radius: 50px;
    background-color: ${({ theme }) =>
      theme.colors.stepsWaitBackgroundColor || "#168416"};
    color: ${({ theme }) => theme.colors.inverse} !important;
  }
  .ant-steps-item-finish {
    .ant-steps-item-icon{
      background: ${({ theme }) =>
        theme.colors.stepsFinishBackgroundColor || "#168416"};
      border-color: ${({ theme }) =>
        theme.colors.stepsFinishBorderColor || "#168416"};
    }
  }

  .text-vary-color{
    color: ${({ theme }) => theme.colors.inverse} !important;
  }
  .top-banner{
    .ant-alert-icon {
      color: ${({ theme }) =>
        theme.colors.topBannerIconColor || "black"} !important;
      margin: 3px;
      margin-right: 10px;
    }

    &.ant-alert-warning {
      background-color: ${({ theme }) =>
        theme.colors.topBannerBgColor} !important;
      padding: 10px 15px 15px 24px !important;
      
    }
    .ant-alert-description{
      line-height: 1 !important;
      color: ${({ theme }) => theme.colors.topBannerTextColor} !important;
    }

    .anticon-close{
      color: ${({ theme }) => theme.colors.topBannerTextColor} !important;
    }

    .ant-alert-message {
      color: ${({ theme }) => theme.colors.topBannerTextColor} !important;
      line-height: 1;
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
  

  .web3modal-provider-container{
    border-radius:  ${({ theme }) =>
      theme.radius ? theme.radius : ""}px !important;
  }

  .web3modal-modal-card{
    border-radius:  ${({ theme }) =>
      theme.radius ? theme.radius : 0}px !important;
  }

  .theme-builder-dlg{
    .modal-content{
      background-color: ${({ theme }) => theme.colors.body};
      label {
        color: ${({ theme }) => theme.colors.inverse} !important;
      }
      .form-control {
        color: ${({ theme }) => theme.colors.textSec} !important;
      }
      .modal-header{
        .h4{
          color:black !important;
        }
      }
      .btn-group {
        .btn {
          border-radius: ${({ theme }) =>
            theme.radius ? theme.radius : 0}px !important;
        }
      }
      .ui-color-picker {
        .input-field {
          input {
            border-radius: ${({ theme }) =>
              theme.radius ? theme.radius : 0}px !important;
          }
        }
      }
    }
    
  }
`;
