
import title from "../../assets/PLLogo.png";

function PageTitle()
{
  return (
    <img 
      src={title}
      alt = "title"
      style={{
        display: "flex",
        position: "absolute",
        width: "65vw",
        height: "auto",
        top: "4vh",
        left: "3vw",
      }}
    />
  );
};

export default PageTitle;