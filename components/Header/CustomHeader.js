import React from "react";
import { ReactTicker } from '@guna81/react-ticker'
const data = [
  "Sen. Feinstein condemns 'continued disinformation and lies' about Paul Pelosi attack."
  ,
  "Teenage crew arrested in connection with San Francisco armed carjackings."
  ,
  "SF Muni bus routes disrupted during Golden Gate Half Marathon."
  ,
  "Old tweets paint Twitter's new owner Elon Musk as erratic, sometimes reckless."
  ,
  "O2 dead in horrendous multi-car crash in Redwood City."
  ,
  "Twitter layoffs part of a larger trend in tech industry."
  ,
  "Juvenile stabbed during large brawl in San Francisco Fillmore District."
  ,
  "Judge in Paul Pelosi attack hearing worked with speaker's daughter."
  ,
  "San Francisco DA announces several charges for man who beat Visitacion Valley senior to death."
];
const renderItem = (item) => {
  return (
    <p
      style={{
        whiteSpace: "nowrap",
        color: "#fff"
      }}
    >
      {item}
    </p>
  );
};

export default function Header(props) {
  return (
    <ReactTicker
      data={data}
      component={renderItem}
      speed={40}
      keyName="_id"
      tickerStyle={{
        position: "fixed",
        top: 0,
        left: "0",
        width: "100%",
        zIndex: 99,
      }}
      tickerClassName="news-ticker"
    />
  );
}