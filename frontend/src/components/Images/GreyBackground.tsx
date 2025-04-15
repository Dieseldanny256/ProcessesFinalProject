import GreyBackgroundImg from '../../assets/dotsFixed.png';

function GreyBackground() {
  return (
    <div
      style={{
        backgroundImage: `url(${GreyBackgroundImg})`,
        backgroundSize: "cover",
        position: "fixed",
        top: 0,
        left: 0,
        height: '100%',
        minHeight: "100%",
        minWidth: "100%",
        zIndex: -1,
      }}
    >
    </div>
  );
}

export default GreyBackground;
