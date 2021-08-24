import React, { useState } from "react";
import { VscSymbolColor } from "react-icons/vsc";
import { Modal } from "react-bootstrap";
import "../../assets/scss/_theme-builder.scss";

import { ColorPicker } from "react-color-gradient-picker";
import "react-color-gradient-picker/dist/index.css";

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
      // setGradientAttrs(gradientAttrs);
    });
  };

  const handleThemeConfigChange = (e) => {
    setColorId("");
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
                <label htmlFor="primary">Primary:</label>
                <input
                  type="color"
                  id="primary"
                  name="primary"
                  value={themeConfig.primary}
                  onChange={handleThemeConfigChange}
                  className="form-control"
                />
              </div>
              <div className="input-group">
                <label htmlFor="secondary">Secondary Color:</label>
                <input
                  type="color"
                  id="secondary"
                  name="colorSelect"
                  value={themeConfig.secondary}
                  onChange={handleThemeConfigChange}
                  className="form-control"
                />
              </div>
              <div className="input-group">
                <label htmlFor="backgroud">Backgroud Color:</label>
                <input
                  type="color"
                  id="backgroud"
                  name="backgroud"
                  value={themeConfig.backgroud}
                  onChange={handleThemeConfigChange}
                  className="form-control"
                />
              </div>
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
                  id="backgroundImage"
                  name="backgroundImage"
                  value={themeConfig.backgroundImage}
                  onChange={handleThemeConfigChange}
                  className="form-control"
                />
              </div>
              <div className="input-group">
                <label htmlFor="btn_bg_color">Logo :</label>
                <input
                  type="text"
                  id="logo"
                  name="logo"
                  value={themeConfig.logo}
                  onChange={handleThemeConfigChange}
                  className="form-control"
                />
              </div>
            </section>

            <section className="theme-bulider-component">
              <h5 className="mb-0">
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="headingColor"
                    name="customRadioInline"
                    class="custom-control-input"
                    checked={fieldName === "headingColor" ? true : false}
                    onChange={() => {
                      setFieldName("headingColor");
                      setIsGradient(false);
                    }}
                  />
                  <label class="custom-control-label" for="headingColor">
                    Heading Color
                  </label>
                </div>
                Heading Preview
              </h5>
            </section>

            <section className="theme-bulider-component">
              <h5>
                Button Design:
                <button className="btn btn-pri float-right">
                  Button Design
                </button>
              </h5>
              <div className="radio-group">
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="btnBgColor"
                    name="customRadioInline"
                    class="custom-control-input"
                    checked={fieldName === "btnBgColor" ? true : false}
                    onChange={() => {
                      setFieldName("btnBgColor");
                      setIsGradient(true);
                    }}
                  />
                  <label class="custom-control-label" for="btnBgColor">
                    btnBgColor
                  </label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="btnTextColor"
                    name="customRadioInline"
                    class="custom-control-input"
                    checked={fieldName === "btnTextColor" ? true : false}
                    onChange={() => {
                      setFieldName("btnTextColor");
                      setIsGradient(false);
                    }}
                  />
                  <label class="custom-control-label" for="btnTextColor">
                    btnTextColor
                  </label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="btnTextPriColor"
                    name="customRadioInline"
                    class="custom-control-input"
                    checked={fieldName === "btnTextPriColor" ? true : false}
                    onChange={() => {
                      setFieldName("btnTextPriColor");
                      setIsGradient(false);
                    }}
                  />
                  <label class="custom-control-label" for="btnTextPriColor">
                    btnTextPriColor
                  </label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="btnTextSecColor"
                    name="customRadioInline"
                    class="custom-control-input"
                    checked={fieldName === "btnTextSecColor" ? true : false}
                    onChange={() => {
                      setFieldName("btnTextSecColor");
                      setIsGradient(false);
                    }}
                  />
                  <label class="custom-control-label" for="btnTextSecColor">
                    btnTextSecColor
                  </label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="btnActiveColor"
                    name="customRadioInline"
                    class="custom-control-input"
                    checked={fieldName === "btnActiveColor" ? true : false}
                    onChange={() => {
                      setFieldName("btnActiveColor");
                      setIsGradient(true);
                    }}
                  />
                  <label class="custom-control-label" for="btnActiveColor">
                    btnActiveColor
                  </label>
                </div>
              </div>
            </section>

            <section className="theme-bulider-component">
              <h5>
                Steps Design:
                <div class="ant-steps-item-icon">
                  <span class="ant-steps-icon">1</span>
                </div>
              </h5>
              <div className="radio-group">
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="stepsBgColor"
                    name="customRadioInline"
                    class="custom-control-input"
                    checked={fieldName === "stepsBgColor" ? true : false}
                    onChange={() => {
                      setFieldName("stepsBgColor");
                      setIsGradient(true);
                    }}
                  />
                  <label class="custom-control-label" for="stepsBgColor">
                    stepsBgColor
                  </label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="stepsBorderColor"
                    name="customRadioInline"
                    class="custom-control-input"
                    checked={fieldName === "stepsBorderColor" ? true : false}
                    onChange={() => {
                      setFieldName("stepsBorderColor");
                      setIsGradient(false);
                    }}
                  />
                  <label class="custom-control-label" for="stepsBorderColor">
                    stepsBorderColor
                  </label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="stepsWaitBgColor"
                    name="customRadioInline"
                    class="custom-control-input"
                    checked={fieldName === "stepsWaitBgColor" ? true : false}
                    onChange={() => {
                      setFieldName("stepsWaitBgColor");
                      setIsGradient(true);
                    }}
                  />
                  <label class="custom-control-label" for="stepsWaitBgColor">
                    stepsWaitBgColor
                  </label>
                </div>
              </div>
            </section>

            <section className="theme-bulider-component">
              <h5>
                <span>Card Design:</span>

                <div class="card w-50">
                  <span class="card-text">Card Text Color</span>
                </div>
              </h5>
              <div className="radio-group">
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="cardBgColor"
                    name="customRadioInline"
                    class="custom-control-input"
                    checked={fieldName === "cardBgColor" ? true : false}
                    onChange={() => {
                      setFieldName("cardBgColor");
                      setIsGradient(true);
                    }}
                  />
                  <label class="custom-control-label" for="cardBgColor">
                    cardBgColor
                  </label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="cardSec"
                    name="customRadioInline"
                    class="custom-control-input"
                    checked={fieldName === "cardSec" ? true : false}
                    onChange={() => {
                      setFieldName("cardSec");
                      setIsGradient(true);
                    }}
                  />
                  <label class="custom-control-label" for="cardSec">
                    cardSec
                  </label>
                </div>
              </div>
            </section>
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
