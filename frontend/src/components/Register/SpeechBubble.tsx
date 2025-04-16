import React, { CSSProperties, useEffect, useState } from "react";

interface SpeechBubbleProps {
  password: string
  setDisabled: (disabled : boolean) => void
  error: string
  message: string
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ password, setDisabled, error, message }) => {

  const [hasCapital, setHasCapital] = useState(true);
  const [isLong, setIsLong] = useState(true);
  const [hasDigit, setHasDigit] = useState(true);
  const [hasSymbol, setHasSymbol] = useState(true);

  const checkPassword = () => {
    let lengthRegex = /^(\S){8,}$/; //Contains at least 8 chars
    let numberRegex = /^(.*)([0-9]+)(.*)/; //Contains one or more digit
    let capitalRegex = /^(.*)([A-Z]+)(.*)/; //Contains one or more capital letter
    let symbolRegex = /^(.*)(\W|_+)(.*)/; //Containts one or more special characters

    setIsLong(lengthRegex.test(password));
    setHasDigit(numberRegex.test(password));
    setHasCapital(capitalRegex.test(password));
    setHasSymbol(symbolRegex.test(password));
  }

  useEffect(() => {
    setDisabled(!(hasCapital && isLong && hasDigit && hasSymbol))
  }, [hasCapital, isLong, hasDigit, hasSymbol]);

  useEffect(() => {
    checkPassword();
  }, [password]);

  return (
    !(hasCapital && isLong && hasDigit && hasSymbol) ?
    (<div className="bubble" style = {container}>
        <span>Woah, bro! That password isn't </span><strong style={strong}>strong</strong><span> enough!</span><br/>
        <span>Try adding:</span><br />
        <div style={{display: "block"}}>
        {!isLong && <div style={errorText}>- 8 or more characters!</div>}
        {!hasDigit && <div style={errorText}>- At least one number!</div>}
        {!hasCapital && <div style={errorText}>- At least one capital letter!</div>}
        {!hasSymbol && <div style={errorText}>- At least one special symbol!</div>}
        </div>
    </div>) : 
    error != '' ? <div className="bubble" style = {container}>
        <span>Sorry, bro!</span><br/>
        <div style={errorText}>{error}</div>
    </div> : 
    message != '' ? <div className="bubble" style = {container}>
    <span dangerouslySetInnerHTML={{ __html: message }}></span>
    </div> : <div style = {container}></div>
  );
};

const container: CSSProperties = {
    position: "absolute",
    left: "62vw",
    top: "10vh",
    zIndex: "3",
    width: "25vw"
}

const strong: CSSProperties = {
    fontWeight: "900"
}

const errorText: CSSProperties = {
    color: " #BA0000",
    fontWeight: "800"
}

export default SpeechBubble;
