import React, { useState } from "react"
import { VscSymbolColor } from "react-icons/vsc";
import { Modal } from "react-bootstrap";
import "../../assets/scss/_theme-builder.scss"
export const ThemeBuilder = ({ config, onChange }) => {

  const [openThemeBuilder, setOpenThemeBuilder] = useState(false);
  const [themeConfig, setThemeConfig] = useState({ ...config });

  const handleThemeConfigChange = (e) => {
    const value = e.target.value;
    console.log(value)
    setThemeConfig({
      ...themeConfig,
      [e.target.name]: e.target.name === "radius" ? +value : value
    });
    onChange({
      ...themeConfig,
      [e.target.name]: e.target.name === "radius" ? +value : value
    });
  }
  console.log(themeConfig)

  return <>
    <Modal show={openThemeBuilder} onHide={() => {
      setOpenThemeBuilder(false)
    }} dialogClassName={"theme-builder-dlg"}>
      <Modal.Header closeButton>
        <Modal.Title>Theme Builder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>

          <div>
            <label htmlFor="primary">Primary Color:</label> {' '}
            <input type="color" id="primary" name="primary" value={themeConfig.primary} onChange={handleThemeConfigChange} />
          </div>
          <div>
            <label htmlFor="secondary">Secondary Color:</label> {' '}
            <input type="color" id="secondary" name="secondary" value={themeConfig.secondary} onChange={handleThemeConfigChange} />
          </div>
          <div>
            <label htmlFor="backgroud">Backgroud Color:</label> {' '}
            <input type="color" id="backgroud" name="backgroud" value={themeConfig.backgroud} onChange={handleThemeConfigChange} />
          </div>

          <div>
            <label htmlFor="btn_bg_color">Radius :</label> {' '}
            <input type="number" min="0" id="radius" name="radius" value={themeConfig.radius} onChange={handleThemeConfigChange} style={{ color: "black", marginBottom: "10px" }} />
          </div>

          <div>
            <label htmlFor="btn_bg_color">Background Image :</label> {' '}
            <input type="text" id="backgroundImage" name="backgroundImage" value={themeConfig.backgroundImage} onChange={handleThemeConfigChange} style={{ color: "black", marginBottom: "10px" }} />
          </div>

          <div>
            <label htmlFor="btn_bg_color">Logo :</label> {' '}
            <input type="text" id="logo" name="logo" value={themeConfig.logo} onChange={handleThemeConfigChange} style={{ color: "black", marginBottom: "10px" }} />
          </div>
        </div>
      </Modal.Body>

    </Modal>
    <div className="theme-builder-btn" onClick={(e) => {
      e.preventDefault();
      setOpenThemeBuilder(true);
    }}>
      <VscSymbolColor size="25" />
    </div>
  </>

}