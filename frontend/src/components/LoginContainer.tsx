import React, { ReactNode, CSSProperties } from "react";

interface AngledBoxProps {
  children: ReactNode;
}

const LoginContainer: React.FC<AngledBoxProps> = ({ children }) => {
  return (
    <div style={container}>
        {children}
    </div>
  );
};

const container: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
}

export default LoginContainer;