
import buffman from "../../assets/BuffMan.png"

function BuffMan()
{
  return (
    <img 
      src={buffman}
      alt = "BuffMan"
      style={{
        display: "flex",
        position: "absolute",
        width: "40vw",
        height: "auto",
        bottom: "0vh",
        right: "3vw"
      }}
    />
  );
};

export default BuffMan;