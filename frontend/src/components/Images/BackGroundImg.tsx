
import backGround from "../../assets/BackGround.png";

function BackGround()
{
  return (
    <div
      style={{
        backgroundImage: `url(${backGround})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "fixed",
        top: 0,
        left: 0,
        minHeight: "100%",
        minWidth: "100%",
        zIndex: -1,
      }}>
    </div>
  );
};

export default BackGround;
