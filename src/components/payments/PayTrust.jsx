//src/components/payments/PayTrust.jsx


import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ethers } from 'ethers';

import NavBar from '/src/components/blocks/NavBar.jsx'



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

const PayTrust = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener los datos pasados desde DetalleProd
  const { walletAddress, price } = location.state || {};
  // se asigna price a amount para no alterar el codigo original de momento
  //const amount = price; //PRECIO
  //const walletAddress = '0xd638971892E4b530f1A0Ad73D977ea443DFA4883';//DIRECCION DE BILLETERA

  //PRIMERO SE DECLARA TODOS LOS ESTADOS
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  //DESPUES LAS FUNCIONES AUXILIARES
  // Formatear dirección de billetera
  const formatoWalletAddress = (address) => {
    if (!address) return 'Sin dirección de billetera';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  //VARIABLES DERIVADAS
  // Deshabilitar botón si no hay dirección
  const isDisabled = !walletAddress || isLoading;

  const detectTrustWallet = () => {
    return new Promise((resolve, reject) => {
      
      setTimeout(() => {
        
        if (window.ethereum?.isTrust) {
          resolve(window.ethereum);
        } 
        
        else if (window.trustwallet) {
          resolve(window.trustwallet);
        }
        
        else if (window.web3?.currentProvider?.isTrust) {
          resolve(window.web3.currentProvider);
        } else {
          reject(new Error('Trust Wallet no detectado. Por favor instala la extensión o ábrela primero.'));
        }
      }, 300);
    });
  };

  const switchToBSCNetwork = async (provider) => {
    try {
      const currentChainId = await provider.request({ method: 'eth_chainId' });
      
      if (currentChainId !== '0x38') { 
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }],
          });
        } catch (switchError) {
          
          if (switchError.code === 4902) {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x38',
                chainName: 'Binance Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/']
              }]
            });
          } else {
            throw switchError;
          }
        }
      }
    } catch (err) {
      console.error('Error al cambiar de red:', err);
      throw new Error('No se pudo cambiar a Binance Smart Chain. Por favor hazlo manualmente en tu Trust Wallet.');
    }
  };

  const handlePayment = async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    setError(null);

    try {
      
      const trustProvider = await detectTrustWallet();
      await trustProvider.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(trustProvider);
      const signer = provider.getSigner();
      await switchToBSCNetwork(trustProvider);
      const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, signer);
      const amountInWei = ethers.utils.parseUnits(price.toString(), 18);
      const tx = await usdtContract.transfer(walletAddress, amountInWei);
      await tx.wait();
      alert(`Pago realizado con éxito! TX Hash: ${tx.hash}`);
    } catch (err) {
      console.error('Error completo:', err);
      let userMessage = err.message;
      if (err.code === 4001) userMessage = 'Cancelaste la operación';
      if (err.code === -32002) userMessage = 'Ya hay una solicitud pendiente. Revisa tu Trust Wallet.';
      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <NavBar/>
    <div className="py-3"></div>
      <div className="d-flex flex-column align-items-center p-4 border border-3 border-success rounded-4" 
          style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#fff8f0' }}>

        {/* Mostrar información del pago */}
        <div className="w-100 mb-4 p-3 rounded-3" style={{ backgroundColor: '#f5f5f5' }}>
          <p className="mb-2 fs-5" style={{ color: '#0d9e5f'}}>
            <strong style={{ color: '#000000'}}>Monto:</strong> {price || '0'} USDC
          </p>
          <p className="mb-0 fs-5">
            <strong>Destino:</strong> {formatoWalletAddress(walletAddress)}
          </p>
        </div>
        
        <button 
          onClick={handlePayment}
          disabled={isDisabled}
          className="btn btn-lg shadow-sm mb-4"
          style={{ 
            minWidth: '220px',
            backgroundColor: isDisabled ? '#cccccc' : '#14612E',
            color: 'white',
            border: 'none',
            transition: 'all 0.3s'
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Procesando...
            </>
          ) : (
            <>
              <i className="bi bi-wallet2 me-2"></i> 
              {walletAddress ? 'Pagar con Trust Wallet' : 'Dirección no disponible'}
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
                className="btn btn-sm btn-outline-success mt-2"
                style={{ borderWidth: '2px' }}
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        )}
        
        {/* Requisitos */}
        <div className="mt-3 p-3 border border-1 border-success rounded-3" 
            style={{ backgroundColor: '#e6f0e6' }}>
          <h5 className="text-center mb-3" style={{ color: '#14612E' }}>
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            Requisitos
          </h5>
          <ul className="list-unstyled">
            <li className="mb-2">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              Extensión/móvil Trust Wallet instalado
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
            borderColor: '#14612E',
            color: '#14612E',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#14612E';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#14612E';
          }}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Regresar
        </button>

      </div>
    
    </>
    
  );
};

export default PayTrust;














