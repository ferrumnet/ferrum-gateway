import React, { useState } from "react";
import { VscSymbolColor } from "react-icons/vsc";
import { Modal } from "react-bootstrap";
import "../../assets/scss/_theme-builder.scss";

import { ColorPicker } from "react-color-gradient-picker";
import "react-color-gradient-picker/dist/index.css";
import { Steps } from "antd";

export const ThemeBuilder = ({ config, onChange }) => {
  const [openThemeBuilder, setOpenThemeBuilder] = useState(false);
  const [themeConfig, setThemeConfig] = useState({ ...config });
  const [fieldName, setFieldName] = useState("headingColor");
  const [isGradient, setIsGradient] = useState(false);
  const [gradientAttrs, setGradientAttrs] = useState();
  const [colorId, setColorId] = useState("");

  const onColorChange = (targetName, gradientAttrs) => {
    setThemeConfig({
      ...themeConfig,
      [fieldName]: gradientAttrs,
    });
  };

  const handleThemeConfigChange = (e) => {
    setColorId("");
    // setGradientAttrs(gradientAttrs);
    console.log(e.target.id);
    const value = e.target.value;
    setThemeConfig({
      ...themeConfig,
      [e.target.name]: e.target.name === "radius" ? +value : value,
    });
    onChange({
      ...themeConfig,
      [e.target.name]: e.target.name === "radius" ? +value : value,
    });
  };
  console.log(themeConfig);
  const savehandler = () => {
    let theme = {
      BgImage: themeConfig.bgImg,
      mainLogo: themeConfig.mainLogo,
      colors: {
        mainHeaderColor: themeConfig?.headingColor?.style,
        stepsFinishBackgroundColor: themeConfig?.stepsBgColor?.style,
        stepsWaitBackgroundColor: themeConfig?.stepsWaitBgColor?.style,
        stepsProgressBackgroundColor: themeConfig?.stepsProgressBgColor?.style,
      },
      button: {
        btnPri: themeConfig?.btnBgColor?.style,
        btnTextPriColor: themeConfig?.btnTextPriColor?.style,
        btnTextSecColor: themeConfig?.btnTextSecColor?.style,
        btnActiveColor: themeConfig?.btnActiveColor?.style,
      },
      card: {
        cardBgColor: themeConfig?.cardBgColor?.style,
        cardSec: themeConfig?.cardSec?.style,
      },
    };
    onChange({ ...theme });
  };

  return (
    <>
      <Modal
        className="theme-builder-dlg"
        contentClassName="card p-0"
        show={openThemeBuilder}
        onHide={() => {
          setOpenThemeBuilder(false);
        }}
      >
        <Modal.Header closeButton className="pt-2 pb-0">
          <h4 className="m-0">Theme Builder</h4>
        </Modal.Header>
        <Modal.Body>
          <ColorPicker
            onStartChange={(e) => {
              onColorChange(colorId, e);
            }}
            onEndChange={(e) => {
              onColorChange(colorId, e);
            }}
            // value={themeConfig.primary}
            onChange={(e) => {
              onColorChange(colorId, e);
            }}
            isGradient={isGradient}
          />
          <div className="theme-builder-form">
            <section className="theme-bulider-component global">
              <div className="input-group">
                <label htmlFor="btn_bg_color">Radius :</label>
                <input
                  type="number"
                  min="0"
                  id="radius"
                  name="radius"
                  value={themeConfig.radius}
                  onChange={handleThemeConfigChange}
                  className="form-control"
                />
              </div>
              <div className="input-group">
                <label htmlFor="btn_bg_color">Background Image :</label>
                <input
                  type="text"
                  id="bgImg"
                  name="bgImg"
                  value={themeConfig.bgImg}
                  onChange={handleThemeConfigChange}
                  className="form-control"
                />
              </div>
              <div className="input-group">
                <label htmlFor="btn_bg_color">Logo :</label>
                <input
                  type="text"
                  id="mainLogo"
                  name="mainLogo"
                  value={themeConfig.mainLogo}
                  onChange={handleThemeConfigChange}
                  className="form-control"
                />
              </div>
            </section>

            <section className="theme-bulider-component">
              <h5
                className="mb-0 display-12 font-weight-bold"
                style={
                  themeConfig.headingColor
                    ? { color: `${themeConfig.headingColor.style} ` }
                    : {}
                }
              >
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="headingColor"
                    name="customRadioInline"
                    className="custom-control-input"
                    checked={fieldName === "headingColor" ? true : false}
                    onChange={() => {
                      setFieldName("headingColor");
                      setIsGradient(false);
                    }}
                  />
                  <label className="custom-control-label" for="headingColor">
                    Heading Color
                  </label>
                </div>
                Heading Preview
              </h5>
            </section>

            <section className="theme-bulider-component">
              <h5 style={{ color: "white" }}>Button Design:</h5>
              <div className="row">
                <div className="col-6">
                  <button
                    className="btn btn-pri mb-3"
                    style={
                      themeConfig.btnBgColor || themeConfig.btnTextPriColor
                        ? {
                            background: themeConfig.btnBgColor
                              ? `${themeConfig.btnBgColor.style}`
                              : undefined,
                            color: themeConfig.btnTextPriColor
                              ? themeConfig.btnTextPriColor.style
                              : undefined,
                          }
                        : {}
                    }
                  >
                    Button Default
                  </button>
                  <div className="radio-group">
                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="btnBgColor"
                        name="customRadioInline"
                        className="custom-control-input"
                        checked={fieldName === "btnBgColor" ? true : false}
                        onChange={() => {
                          setFieldName("btnBgColor");
                          setIsGradient(true);
                        }}
                      />
                      <label className="custom-control-label" for="btnBgColor">
                        btnBgColor
                      </label>
                    </div>
                    {/* <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="btnTextColor"
                    name="customRadioInline"
                    className="custom-control-input"
                    checked={fieldName === "btnTextColor" ? true : false}
                    onChange={() => {
                      setFieldName("btnTextColor");
                      setIsGradient(false);
                    }}
                  />
                  <label className="custom-control-label" for="btnTextColor">
                    btnTextColor
                  </label>
                </div> */}
                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="btnTextPriColor"
                        name="customRadioInline"
                        className="custom-control-input"
                        checked={fieldName === "btnTextPriColor" ? true : false}
                        onChange={() => {
                          setFieldName("btnTextPriColor");
                          setIsGradient(false);
                        }}
                      />
                      <label
                        className="custom-control-label"
                        for="btnTextPriColor"
                      >
                        btnTextPriColor
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <button
                    className="btn btn-pri mb-3"
                    style={
                      themeConfig.btnTextSecColor || themeConfig.btnActiveColor
                        ? {
                            background: themeConfig.btnActiveColor
                              ? `${themeConfig.btnActiveColor.style}`
                              : undefined,
                            color: themeConfig.btnTextSecColor
                              ? themeConfig.btnTextSecColor.style
                              : undefined,
                          }
                        : {}
                    }
                  >
                    Button Active
                  </button>
                  <div className="radio-group">
                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="btnActiveColor"
                        name="customRadioInline"
                        className="custom-control-input"
                        checked={fieldName === "btnActiveColor" ? true : false}
                        onChange={() => {
                          setFieldName("btnActiveColor");
                          setIsGradient(true);
                        }}
                      />
                      <label
                        className="custom-control-label"
                        for="btnActiveColor"
                      >
                        btnBgActiveColor
                      </label>
                    </div>
                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="btnTextSecColor"
                        name="customRadioInline"
                        className="custom-control-input"
                        checked={fieldName === "btnTextSecColor" ? true : false}
                        onChange={() => {
                          setFieldName("btnTextSecColor");
                          setIsGradient(false);
                        }}
                      />
                      <label
                        className="custom-control-label"
                        for="btnTextSecColor"
                      >
                        btnTextActive
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="theme-bulider-component">
              <h5>Steps Design:</h5>
              <div className="row">
                <div className="col-6">
                  <div className="ant-steps ant-steps-vertical">
                    <div className="ant-steps-item ant-steps-item-wait ant-steps-item-active">
                      <div className="ant-steps-item-container">
                        <div className="ant-steps-item-tail"></div>
                        <div
                          className="ant-steps-item-icon"
                          style={
                            themeConfig.stepsBgColor
                              ? {
                                  background: themeConfig.stepsBgColor
                                    ? `${themeConfig.stepsBgColor.style}`
                                    : undefined,
                                  borderColor: themeConfig.stepsBorderColor
                                    ? `${themeConfig.stepsBorderColor.style}`
                                    : undefined,
                                }
                              : {}
                          }
                        >
                          <span className="ant-steps-icon">
                            <span
                              role="img"
                              aria-label="check"
                              className="anticon anticon-check ant-steps-finish-icon"
                            >
                              <svg
                                viewBox="64 64 896 896"
                                focusable="false"
                                data-icon="check"
                                width="1em"
                                height="1em"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                              </svg>
                            </span>
                          </span>
                        </div>
                        <div className="ant-steps-item-content">
                          <div className="ant-steps-item-title">
                            <div className="text-vary-color">Step Finish</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="radio-group"
                    style={
                      themeConfig.stepsBgColor || themeConfig.stepsBorderColor
                        ? {}
                        : {}
                    }
                  >
                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="stepsBgColor"
                        name="customRadioInline"
                        className="custom-control-input"
                        checked={fieldName === "stepsBgColor" ? true : false}
                        onChange={() => {
                          setFieldName("stepsBgColor");
                          setIsGradient(true);
                        }}
                      />
                      <label
                        className="custom-control-label"
                        for="stepsBgColor"
                      >
                        stepsBgColor
                      </label>
                    </div>
                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="stepsBorderColor"
                        name="customRadioInline"
                        className="custom-control-input"
                        checked={
                          fieldName === "stepsBorderColor" ? true : false
                        }
                        onChange={() => {
                          setFieldName("stepsBorderColor");
                          setIsGradient(false);
                        }}
                      />
                      <label
                        className="custom-control-label"
                        for="stepsBorderColor"
                      >
                        stepsBorderColor
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="ant-steps ant-steps-vertical">
                    <div className="ant-steps-item ant-steps-item-wait">
                      <div className="ant-steps-item-container">
                        <div className="ant-steps-item-tail"></div>
                        <div
                          className="ant-steps-item-icon"
                          style={
                            themeConfig.stepsWaitBgColor
                              ? {
                                  background: themeConfig.stepsWaitBgColor
                                    ? `${themeConfig.stepsWaitBgColor.style}`
                                    : undefined,
                                  borderColor: themeConfig.stepsWaitBgColor
                                    ? `${themeConfig.stepsWaitBgColor.style}`
                                    : undefined,
                                }
                              : {}
                          }
                        >
                          <span className="ant-steps-icon">1</span>
                        </div>
                        <div className="ant-steps-item-content">
                          <div className="ant-steps-item-title">
                            <div className="text-vary-color">Step Waiting</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="radio-group">
                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="stepsWaitBgColor"
                        name="customRadioInline"
                        className="custom-control-input"
                        checked={
                          fieldName === "stepsWaitBgColor" ? true : false
                        }
                        onChange={() => {
                          setFieldName("stepsWaitBgColor");
                          setIsGradient(true);
                        }}
                      />
                      <label
                        className="custom-control-label"
                        for="stepsWaitBgColor"
                      >
                        stepsWaitBgColor
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <hr />
                  <div className="ant-steps ant-steps-vertical">
                    <div className="ant-steps-item ant-steps-item-wait">
                      <div className="ant-steps-item-container">
                        <div className="ant-steps-item-tail"></div>
                        <div
                          className="ant-steps-item-icon"
                          style={
                            themeConfig.stepsProgressBgColor
                              ? {
                                  background: themeConfig.stepsProgressBgColor
                                    ? `${themeConfig.stepsProgressBgColor.style}`
                                    : undefined,
                                  borderColor: themeConfig.stepsProgressBgColor
                                    ? `${themeConfig.stepsProgressBgColor.style}`
                                    : undefined,
                                }
                              : {}
                          }
                        >
                          <span className="ant-steps-icon">
                            <span
                              role="img"
                              aria-label="loading"
                              className="anticon anticon-loading anticon-spin"
                            >
                              <svg
                                viewBox="0 0 1024 1024"
                                focusable="false"
                                data-icon="loading"
                                width="1em"
                                height="1em"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
                              </svg>
                            </span>
                          </span>
                        </div>
                        <div className="ant-steps-item-content">
                          <div className="ant-steps-item-title">
                            <div className="text-vary-color">Step Progress</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="radio-group">
                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="stepsProgressBgColor"
                        name="customRadioInline"
                        className="custom-control-input"
                        checked={
                          fieldName === "stepsProgressBgColor" ? true : false
                        }
                        onChange={() => {
                          setFieldName("stepsProgressBgColor");
                          setIsGradient(true);
                        }}
                      />
                      <label
                        className="custom-control-label"
                        for="stepsProgressBgColor"
                      >
                        stepsProgressBgColor
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="theme-bulider-component">
              <h5>
                <span>Card Design:</span>

                <div
                  className="card w-50 p-2"
                  style={
                    themeConfig.cardBgColor
                      ? {
                          background: themeConfig.cardBgColor
                            ? `${themeConfig.cardBgColor.style}`
                            : undefined,
                          color: themeConfig.cardSec
                            ? `${themeConfig.cardSec.style}`
                            : undefined,
                        }
                      : {}
                  }
                >
                  <span>Card Text Color</span>
                </div>
              </h5>
              <div className="radio-group">
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="cardBgColor"
                    name="customRadioInline"
                    className="custom-control-input"
                    checked={fieldName === "cardBgColor" ? true : false}
                    onChange={() => {
                      setFieldName("cardBgColor");
                      setIsGradient(true);
                    }}
                  />
                  <label className="custom-control-label" for="cardBgColor">
                    cardBgColor
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="cardSec"
                    name="customRadioInline"
                    className="custom-control-input"
                    checked={fieldName === "cardSec" ? true : false}
                    onChange={() => {
                      setFieldName("cardSec");
                      setIsGradient(false);
                    }}
                  />
                  <label className="custom-control-label" for="cardSec">
                    cardSec
                  </label>
                </div>
              </div>
            </section>
            <div className="btn-bar text-center p-3">
              <button className="btn btn-danger mr-2 ">Set Default</button>
              <button className="btn btn-success" onClick={savehandler}>
                Save
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div
        className="btn btn-pri theme-builder-btn"
        onClick={(e) => {
          e.preventDefault();
          setOpenThemeBuilder(true);
        }}
      >
        <VscSymbolColor size="25" />
      </div>
    </>
  );
};
