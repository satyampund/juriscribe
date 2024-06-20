import "./PoweredBy.css"
import CadreLogo from "./cadre_logo.png"

function PoweredBy() {
  return (
    <div className='powered-by-container'>
      <h2 className='app-name'>Juriscribe</h2>
      <p className='powered-by'>Powered by</p>
      <img className='cadre-logo' src={CadreLogo} alt="Cadre Logo" />
    </div>
  )
}

export default PoweredBy
