import React, { useState, useEffect } from "react";
import { VscSymbolColor } from "react-icons/vsc";
import { Modal } from "react-bootstrap";
import "../../assets/scss/_theme-builder.scss";
import { ColorPicker } from "react-color-gradient-picker";
import "react-color-gradient-picker/dist/index.css";
import { Steps } from "antd";




const color = {
  red: 255,
  green: 0,
  blue: 0,
  alpha: 1,
};

export const ThemeBuilder = ({ config, onChange }) => {
  const [gradient, setGradient] = useState({
    points: [
      {
        left: 0,
        red: 255,
        green: 0,
        blue: 0,
        alpha: 1,
      },
      {
        left: 100,
        red: 255,
        green: 0,
        blue: 0,
        alpha: 1,
      },
    ],
    degree: 0,
    type: 'linear',
  })
  const [openThemeBuilder, setOpenThemeBuilder] = useState(false);
  const [themeConfig, setThemeConfig] = useState({ ...config });
  const [fieldName, setFieldName] = useState("headingColor");
  const [isGradient, setIsGradient] = useState(false);
  const [colorId, setColorId] = useState("");
  const [selectedHeading, setSelectedHeading] = useState("Heading Color");
  const [loading, setLoading] = useState(false);


  const onColorChange = (targetName, gradientAttrs) => {
    setThemeConfig({
      ...themeConfig,
      [fieldName]: gradientAttrs,

    });
  };


  useEffect(() => {
    if (fieldName) {
      setLoading(true);
    }
  }, [fieldName])

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [loading])


  const handleThemeConfigChange = (e) => {

    const value = e.target.value;
    setThemeConfig({
      ...themeConfig,
      [e.target.name]: e.target.name === "btnBorderRadius" || "cardBorderRadius" ? +value : value,
    });
    onChange({
      ...themeConfig,
      [e.target.name]: e.target.name === "btnBorderRadius" || "cardBorderRadius" ? +value : value,
    });

  };

  const buttonBgColorHandler = () => {
    setThemeConfig({ ...themeConfig, btnActiveColor: themeConfig.btnBgColor, btnTextSecColor: themeConfig.btnTextPriColor })

  }

  const savehandler = () => {
    let theme = {
      BgImage: themeConfig.bgImg,
      mainLogo: themeConfig.mainLogo,
      colors: {
        mainHeaderColor: themeConfig?.headingColor?.style,
        // stepsBackgroundColor: themeConfig?.stepsBgColor?.style,
        stepsFinishBackgroundColor: themeConfig?.stepsFinishBgColor?.style,
        stepsFinishBorderColor: themeConfig?.stepsFinishBorderColor?.style,
        stepsWaitBackgroundColor: themeConfig?.stepsWaitBgColor?.style,
        stepsWaitBorderColor: themeConfig?.stepsWaitBorderColor?.style,
        stepsProcessBackgroundColor: themeConfig?.stepsProcessBgColor?.style,
        stepsProcessBorderColor: themeConfig?.stepsProcessBorderColor?.style,
      },
      button: {
        btnPri: themeConfig?.btnBgColor?.style,
        btnTextPriColor: themeConfig?.btnTextPriColor?.style,
        btnTextSecColor: themeConfig?.btnTextSecColor?.style,
        btnActiveColor: themeConfig?.btnActiveColor?.style,
        btnBorderRadius: themeConfig?.btnBorderRadius,
      },
      card: {
        cardPri: themeConfig?.cardPri?.style,
        cardTextPri: themeConfig?.cardTextPri?.style,
        cardSec: themeConfig?.cardSec?.style,
        cardTextSec: themeConfig?.cardTextSec?.style,
        cardBorderRadius: themeConfig?.cardBorderRadius,
      },
      bannerMainMessage: themeConfig.bannerMainMessage,
      bannerSubMessage: themeConfig.bannerSubMessage
    };
    onChange({ ...theme });
  };



  const exportHandler = () => {
    const exportJson = {
      bgImg: themeConfig.bgImg,
      mainLogo: themeConfig.mainLogo,
      headingColor: themeConfig?.headingColor?.style,
      // stepsBackgroundColor: themeConfig?.stepsBgColor?.style,
      stepsFinishBackgroundColor: themeConfig?.stepsFinishBgColor?.style,
      stepsFinishBorderColor: themeConfig?.stepsFinishBorderColor?.style,
      stepsWaitBackgroundColor: themeConfig?.stepsWaitBgColor?.style,
      stepsWaitBorderColor: themeConfig?.stepsWaitBorderColor?.style,
      stepsProcessBackgroundColor: themeConfig?.stepsProcessBgColor?.style,
      stepsProcessBorderColor: themeConfig?.stepsProcessBorderColor?.style,
      cardPri: themeConfig?.cardPri?.style,
      cardTextPri: themeConfig?.cardTextPri?.style,
      cardSec: themeConfig?.cardSec?.style,
      cardTextSec: themeConfig?.cardTextSec?.style,
      cardBorderRadius: themeConfig?.cardBorderRadius,
      btnBgColor: themeConfig?.btnBgColor?.style,
      btnTextPriColor: themeConfig?.btnTextPriColor?.style,
      btnTextSecColor: themeConfig?.btnTextSecColor?.style,
      btnActiveColor: themeConfig?.btnActiveColor?.style,
      btnBorderRadius: themeConfig?.btnBorderRadius,
      bannerMainMessage: themeConfig?.bannerMainMessage,
      bannerSubMessage: themeConfig?.bannerSubMessage,
    };

    alert(JSON.stringify(exportJson));
  };

  console.log(themeConfig)
  return (
    <>
      <Modal
        className="theme-builder-dlg"
        contentClassName="p-0"
        show={openThemeBuilder}
        onHide={() => {
          setOpenThemeBuilder(false);
        }}
      >
        <Modal.Header closeButton className="pt-2 pb-0">
          <h4 className="m-0 text-white">Theme Builder</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="position-sticky top-0">
            <h4
              className="mb-0 text-center pt-3 text-dark"
            >{selectedHeading}</h4>
            {!loading ? <ColorPicker
              onStartChange={(e) => {
                onColorChange(colorId, e);
              }}
              onEndChange={(e) => {
                onColorChange(colorId, e);
              }}
              onChange={(e) => {
                onColorChange(colorId, e);
              }}
              {...isGradient ? { isGradient: true, gradient: themeConfig[fieldName] ? themeConfig[fieldName] : gradient } : { color: themeConfig[fieldName] ? themeConfig[fieldName] : color }}
            /> : null}

          </div>
          <div className="theme-builder-form">
            <section className="theme-bulider-component global">

              <div className="input-group">
                <label htmlFor="btn_bg_color">Background Image</label>
                <input
                  type="text"
                  id="bgImg"
                  name="bgImg"
                  placeholder="Enter image path here ..."
                  value={themeConfig.bgImg}
                  onChange={handleThemeConfigChange}
                  className="form-control"
                />
              </div>
              <div className="input-group">
                <label htmlFor="btn_bg_color">Logo</label>
                <input
                  type="text"
                  id="mainLogo"
                  name="mainLogo"
                  placeholder="Enter logo path here ..."
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
                    placeholder="Enter radius amount ..."
                    checked={fieldName === "headingColor" ? true : false}
                    onChange={() => {
                      setFieldName("headingColor");
                      setIsGradient(false);
                      setSelectedHeading("Heading Color")
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
              <h5 style={{ color: "white" }}>Button Design</h5>
              <div className="input-group">
                <label htmlFor="btnBorderRadius">Border Radius</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  id="btnBorderRadius"
                  name="btnBorderRadius"
                  placeholder="Enter radius amount ..."
                  value={themeConfig.btnBorderRadius}
                  onChange={handleThemeConfigChange}
                  className="form-control"
                />
                <small className="ml-3">Max length 100</small>
              </div>
              <div className="row">
                <div className="col-5">
                  <div
                    className="card p-2 mb-3"
                    style={
                      themeConfig.cardPri
                        ? {
                          background: themeConfig.cardPri
                            ? `${themeConfig.cardPri.style}`
                            : undefined,
                          color: themeConfig.cardTextPri
                            ? `${themeConfig.cardTextPri.style}`
                            : undefined,

                        }
                        : {}
                    }
                  >
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
                            borderRadius: themeConfig.btnBorderRadius
                              ? `${themeConfig.btnBorderRadius.style}`
                              : undefined,
                          }
                          : {}
                      }
                    >
                      Default Button
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
                            setSelectedHeading("Default Button Background Color")
                          }}
                        />
                        <label className="custom-control-label" for="btnBgColor">
                          Background Color
                        </label>
                      </div>

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
                            setSelectedHeading("Default Button Text Color")

                          }}
                        />
                        <label
                          className="custom-control-label"
                          for="btnTextPriColor"
                        >
                          Text Color
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <button type="button" class="btn btn-pri btn-icon btn-swap my-2" onClick={() => {
                    buttonBgColorHandler();
                  }}>
                    <i class="mdi mdi-arrow-right mr-0"></i>
                  </button>
                </div>
                <div className="col-5">
                  <div
                    className="card p-2 mb-3"
                    style={
                      themeConfig.cardPri
                        ? {
                          background: themeConfig.cardPri
                            ? `${themeConfig.cardPri.style}`
                            : undefined,
                          color: themeConfig.cardTextPri
                            ? `${themeConfig.cardTextPri.style}`
                            : undefined,
                        }
                        : {}
                    }
                  >
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
                            setSelectedHeading("Active Button Background Color")
                          }}
                        />
                        <label
                          className="custom-control-label"
                          for="btnActiveColor"
                        >
                          Background Color
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
                            setSelectedHeading("Active Button Text Color")

                          }}
                        />
                        <label
                          className="custom-control-label"
                          for="btnTextSecColor"
                        >
                          Text Color
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="theme-bulider-component">
              <h5 style={{ color: "white" }}>Steps Design:</h5>
              <div className="row">
                <div className="col-6">
                  <div
                    className="card p-2 mb-3"
                    style={
                      themeConfig.cardPri
                        ? {
                          background: themeConfig.cardPri
                            ? `${themeConfig.cardPri.style}`
                            : undefined,
                          color: themeConfig.cardTextPri
                            ? `${themeConfig.cardTextPri.style}`
                            : undefined,
                        }
                        : {}
                    }
                  >
                    <div className="ant-steps ant-steps-vertical">
                      <div className="ant-steps-item ant-steps-item-finish">
                        <div className="ant-steps-item-container">
                          <div className="ant-steps-item-tail"></div>
                          <div
                            className="ant-steps-item-icon"
                            style={
                              themeConfig.stepsFinishBgColor
                                ? {
                                  background: themeConfig.stepsFinishBgColor
                                    ? `${themeConfig.stepsFinishBgColor.style}`
                                    : undefined,
                                  borderColor: themeConfig.stepsFinishBorderColor
                                    ? `${themeConfig.stepsFinishBorderColor.style}`
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
                    <div className="radio-group">
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="stepsFinishBgColor"
                          name="customRadioInline"
                          className="custom-control-input"
                          checked={fieldName === "stepsFinishBgColor" ? true : false}
                          onChange={() => {
                            setFieldName("stepsFinishBgColor");
                            setIsGradient(true);
                            setSelectedHeading("Step Finish Background Color")
                          }}
                        />
                        <label
                          className="custom-control-label"
                          for="stepsFinishBgColor"
                        >
                          Background Color
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="stepsFinishBorderColor"
                          name="customRadioInline"
                          className="custom-control-input"
                          checked={
                            fieldName === "stepsFinishBorderColor" ? true : false
                          }
                          onChange={() => {
                            setFieldName("stepsFinishBorderColor");
                            setIsGradient(false);
                            setSelectedHeading("Step Finish Border Color")
                          }}
                        />
                        <label
                          className="custom-control-label"
                          for="stepsFinishBorderColor"
                        >
                          Border Color
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="card p-2 mb-3"
                    style={
                      themeConfig.cardPri
                        ? {
                          background: themeConfig.cardPri
                            ? `${themeConfig.cardPri.style}`
                            : undefined,
                          color: themeConfig.cardTextPri
                            ? `${themeConfig.cardTextPri.style}`
                            : undefined,
                        }
                        : {}
                    }
                  >
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
                            setSelectedHeading("Step Wait Background Color")
                          }}
                        />
                        <label
                          className="custom-control-label"
                          for="stepsWaitBgColor"
                        >
                          Background Color
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="stepsWaitBorderColor"
                          name="customRadioInline"
                          className="custom-control-input"
                          checked={
                            fieldName === "stepsWaitBorderColor" ? true : false
                          }
                          onChange={() => {
                            setFieldName("stepsWaitBorderColor");
                            setIsGradient(false);
                            setSelectedHeading("Step Finish Border Color")
                          }}
                        />
                        <label
                          className="custom-control-label"
                          for="stepsWaitBorderColor"
                        >
                          Border Color
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="card p-2 mb-3"
                    style={
                      themeConfig.cardPri
                        ? {
                          background: themeConfig.cardPri
                            ? `${themeConfig.cardPri.style}`
                            : undefined,
                          color: themeConfig.cardTextPri
                            ? `${themeConfig.cardTextPri.style}`
                            : undefined,
                        }
                        : {}
                    }
                  >
                    <div className="ant-steps ant-steps-vertical">
                      <div className="ant-steps-item ant-steps-item-process">
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
                            setSelectedHeading("Step Progress Background Color")
                          }}
                        />
                        <label
                          className="custom-control-label"
                          for="stepsProgressBgColor"
                        >
                          Background Color
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="stepsProcessBorderColor"
                          name="customRadioInline"
                          className="custom-control-input"
                          checked={
                            fieldName === "stepsProcessBorderColor" ? true : false
                          }
                          onChange={() => {
                            setFieldName("stepsProcessBorderColor");
                            setIsGradient(false);
                            setSelectedHeading("Step Progress Border Color")
                          }}
                        />
                        <label
                          className="custom-control-label"
                          for="stepsProcessBorderColor"
                        >
                          Border Color
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="theme-bulider-component">
              <h5 style={{ color: "white" }}>
                <span>Card Design:</span>
              </h5>
              {/* <div className="input-group">
                <label htmlFor="btn_bg_color">cardBoxShadow</label>
                <input
                type="number"
                min="0"
                  id="cardBoxShadow"
                  name="cardBoxShadow"
                  value={themeConfig.cardBoxShadow}
                  onChange={handleThemeConfigChange}
                  className="form-control"
                />
              </div>*/}
              <div className="input-group">
                <label htmlFor="cardBorderRadius">Border Radius</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  id="cardBorderRadius"
                  name="cardBorderRadius"
                  value={themeConfig.cardBorderRadius}
                  onChange={handleThemeConfigChange}
                  className="form-control"
                />
                <small className="ml-3">Max length 20</small>
              </div>
              <div className="row">
                <div className="col-6">
                  <div
                    className="card p-2 mb-3"
                    style={
                      themeConfig.cardPri
                        ? {
                          background: themeConfig.cardPri
                            ? `${themeConfig.cardPri.style}`
                            : undefined,

                        }
                        : {}
                    }
                  >
                    <span style={{
                      fontSize: "1.25rem", marginBottom: "1rem", color: themeConfig.cardTextPri
                        ? `${themeConfig.cardTextPri.style}`
                        : undefined,
                    }}>Card Primary</span>
                    <div className="radio-group">
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="cardPri"
                          name="customRadioInline"
                          className="custom-control-input"
                          checked={fieldName === "cardPri" ? true : false}
                          onChange={() => {
                            setFieldName("cardPri");
                            setIsGradient(true);
                            setSelectedHeading("Card Primary Background Color")
                          }}
                        />
                        <label className="custom-control-label" for="cardPri">
                          Background Color
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="cardTextPri"
                          name="customRadioInline"
                          className="custom-control-input"
                          checked={fieldName === "cardTextPri" ? true : false}
                          onChange={() => {
                            setFieldName("cardTextPri");
                            setIsGradient(false);
                            setSelectedHeading("Card Primary Text Color")
                          }}
                        />
                        <label className="custom-control-label" for="cardTextPri">
                          Text Color
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="card card-sec p-2 mb-3"
                    style={
                      themeConfig.cardSec
                        ? {
                          background: themeConfig.cardSec
                            ? `${themeConfig.cardSec.style}`
                            : undefined,

                        }
                        : {}
                    }
                  >
                    <span style={{
                      fontSize: "1.25rem", marginBottom: "1rem", color: themeConfig.cardTextSec
                        ? `${themeConfig.cardTextSec.style}`
                        : undefined,
                    }}>Card Secondary</span>
                    <div className="radio-group">
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="cardSec"
                          name="cardSec"
                          className="custom-control-input"
                          checked={fieldName === "cardSec" ? true : false}
                          onChange={() => {
                            setFieldName("cardSec");
                            setIsGradient(true);
                            setSelectedHeading("Card Secondary Background Color")
                          }}
                        />
                        <label className="custom-control-label" for="cardSec">
                          Background Color
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="cardTextSec"
                          name="customRadioInline"
                          className="custom-control-input"
                          checked={fieldName === "cardTextSec" ? true : false}
                          onChange={() => {
                            setFieldName("cardTextSec");
                            setIsGradient(false);
                            setSelectedHeading("Card Secondary Text Color")
                          }}
                        />
                        <label className="custom-control-label" for="cardTextSec">
                          Text Color
                        </label>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            <section className="theme-bulider-component">
              <h5 style={{ color: "white" }}>
                <span>Banner: </span>
              </h5>
              <div className="form-group">
                <label htmlFor="alertMessage">Message</label>
                <textarea
                  placeholder="Enter message here..."
                  min="0"
                  rows="5"
                  id="bannerMainMessage"
                  name="bannerMainMessage"
                  value={themeConfig?.bannerMainMessage}
                  onChange={(e) => setThemeConfig({ ...themeConfig, bannerMainMessage: e.target.value })}
                  className="form-control"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="alertDesc">Description</label>
                <textarea
                  placeholder="Enter description here..."
                  min="0"
                  rows="5"
                  id="bannerSubMessage"
                  name="bannerSubMessage"
                  value={themeConfig?.bannerSubMessage}
                  onChange={(e) => setThemeConfig({ ...themeConfig, bannerSubMessage: e.target.value })}
                  className="form-control"
                ></textarea>
              </div>
            </section>

            <div className="btn-bar text-center p-3">
              <button className="btn btn-danger mr-2 ">Set Default</button>
              <button className="btn btn-success mr-2" onClick={savehandler}>
                Apply
              </button>
              <button className="btn btn-success" onClick={exportHandler}>
                Export
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
