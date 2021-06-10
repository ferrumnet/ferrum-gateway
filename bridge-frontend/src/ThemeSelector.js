import React, { useState, useEffect } from "react";
import styled from "styled-components";
import _ from "lodash";
import { useTheme } from "./theme/useTheme";
import { getFromLS } from "./storageUtils/storage";
// import { Form } from "react-bootstrap";

const ThemedButton = styled.button`
  border: 0;
  font-size: 14px;
  border-radius: 4px;
  margin-right: 5px;
  cursor: pointer;
`;

// eslint-disable-next-line
export default (props) => {
  const themesFromStore = getFromLS("all-themes");
  const [data, setData] = useState(themesFromStore.data);
  const [themes, setThemes] = useState([]);
  const { setMode } = useTheme();

  const themeSwitcher = (selectedTheme) => {
    setMode(selectedTheme);
    props.setter(selectedTheme);
  };

  useEffect(() => {
    setThemes(_.keys(data));
    //eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    props.newTheme && updateThemeCard(props.newTheme);
    //eslint-disable-next-line
  }, [props.newTheme]);

  const updateThemeCard = (theme) => {
    const key = _.keys(theme)[0];
    const updated = { ...data, [key]: theme[key] };
    setData(updated);
  };

  const ThemeCard = (props) => {
    return (
      <>
        {/* <strong className="text-sec">Select Theme:</strong> */}
        <ThemedButton
          className="btn btn-theme"
          onClick={(theme) => themeSwitcher(props.theme)}
          style={{
            backgroundColor: `${
              data[_.camelCase(props.theme.name)].colors.body
            }`,
            color: `${data[_.camelCase(props.theme.name)].colors.button.text}`,
            fontFamily: `${data[_.camelCase(props.theme.name)].font}`,
          }}
        >
          {/* {props.theme.name} */}
        </ThemedButton>
      </>
    );
  };

  return (
    <div className="d-flex align-items-center">
      {themes.length > 0 &&
        themes.map((theme) => (
          <ThemeCard theme={data[theme]} key={data[theme].id} />
        ))}
    </div>
  );
};
