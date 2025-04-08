
import title from "../../assets/PLLogo.png";

function PageTitle()
{
  return (
    <img 
      src={title}
      alt = "title"
      style={{
        display: "flex",
        width: "45vw",
        padding: "10px",
        height: "auto"
      }}
    />
  );
};

export default PageTitle;