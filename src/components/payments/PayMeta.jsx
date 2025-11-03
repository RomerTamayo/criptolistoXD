import { useState } from 'react';
import { ethers } from 'ethers';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '/src/components/blocks/NavBar.jsx';

const USDT_CONTRACT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
const USDT_ABI = [
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  }
];

const PayMeta = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener los datos pasados desde DetalleProd
  const { walletAddress, price } = location.state || {};
  console.log(walletAddress)
  // Formatear dirección de billetera
  const formatoWalletAddress = (address) => {
    if (!address) return 'Sin dirección de billetera';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Deshabilitar botón si no hay dirección
  const isDisabled = !walletAddress || isLoading;

  const handlePayment = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask no está instalado');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const network = await provider.getNetwork();
      if (network.chainId !== 56) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }], 
        });
      }

      const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, signer);
      
      // Usar el price recibido en lugar del valor hardcodeado
      const amountInWei = ethers.utils.parseUnits(price.toString(), 18);
      
      // Usar el walletAddress recibido en lugar del valor hardcodeado
      const tx = await usdtContract.transfer(walletAddress, amountInWei);
      
      await tx.wait();
      alert(`Pago realizado con éxito! TX Hash: ${tx.hash}`);
    } catch (err) {
      console.error('Error en la transacción:', err);
      
      let userMessage = err.message;
      if (err.code === 4001) userMessage = 'Cancelaste la operación';
      if (err.code === -32002) userMessage = 'Ya hay una solicitud pendiente. Revisa tu MetaMask.';
      
      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar/>
      <div className="py-3"></div>
      <div className="d-flex flex-column align-items-center p-4 border border-3 border-primary rounded-4" 
          style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#f0f8ff' }}>
        
        {/* Mostrar información del pago */}
        <div className="w-100 mb-4 p-3 rounded-3" style={{ backgroundColor: '#f5f5f5' }}>
          <p className="mb-2 fs-5" style={{ color: '#0d9e5f'}}>
            <strong style={{ color: '#000000'}}>Monto:</strong> {price || '0'} USDC
          </p>
          <p className="mb-0 fs-5">
            <strong>Destino:</strong> {formatoWalletAddress(walletAddress)}
          </p>
        </div>

        {/* Botón principal */}
        <button 
          onClick={handlePayment}
          disabled={isDisabled}
          className="btn btn-lg shadow-sm mb-4"
          style={{ 
            minWidth: '220px',
            backgroundColor: isDisabled ? '#cccccc' : '#2e1461',
            color: 'white',
            border: 'none',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => !isDisabled && (e.target.style.opacity = '0.8')}
          onMouseOut={(e) => !isDisabled && (e.target.style.opacity = '1')}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Procesando...
            </>
          ) : (
            <>
              <i className="bi bi-wallet2 me-2"></i> 
              {walletAddress ? 'Pagar con MetaMask' : 'Dirección no disponible'}
            </>
          )}
        </button>
        
        {/* Mensaje de error */}
        {error && (
          <div className="text-center mb-3">
            <div className="alert alert-danger d-inline-block">
              {error}
            </div>
            <div>
              <button 
                onClick={handlePayment}
                className="btn btn-sm btn-outline-primary mt-2"
                style={{ borderWidth: '2px' }}
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        )}
        
        {/* Requisitos */}
        <div className="mt-3 p-3 border border-1 border-primary rounded-3" 
            style={{ backgroundColor: '#f5f9ff' }}>
          <h5 className="text-center mb-3" style={{ color: '#2e1461' }}>
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            Requisitos
          </h5>
          <ul className="list-unstyled">
            <li className="mb-2">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              MetaMask instalado y configurado
            </li>
            <li className="mb-2">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              Configurado en Binance Smart Chain (BSC)
            </li>
            <li>
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              Saldo suficiente de USDC y BNB (para gas fees)
            </li>
          </ul>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary mt-4"
          style={{
            minWidth: '180px',
            borderColor: '#2e1461',
            color: '#2e1461',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#2e1461';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#2e1461';
          }}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Regresar
        </button>
      </div>
    </>
  );
};

export default PayMeta;