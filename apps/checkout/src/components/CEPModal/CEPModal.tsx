import { useState, useMemo } from 'react';
import { Modal, Input } from '@inspire/core-components';
import { searchCEPs, getUniqueStates, getCitiesByState, type CEPData } from '../../data/mockCEPs';
import './CEPModal.scss';

export interface CEPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCEP: (cep: string) => void;
}

/**
 * CEPModal - Smart Brazilian ZIP code search
 * 
 * Features:
 * - Real-time search (city, state, neighborhood, street)
 * - State and city filters
 * - Text normalization (accent-insensitive)
 * - Responsive and accessible
 */
export const CEPModal = ({ isOpen, onClose, onSelectCEP }: CEPModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // Estados y ciudades disponibles
  const states = useMemo(() => getUniqueStates(), []);
  const cities = useMemo(
    () => (selectedState ? getCitiesByState(selectedState) : []),
    [selectedState]
  );

  // Resultados filtrados
  const filteredCEPs = useMemo(() => {
    let results = searchCEPs(searchQuery);

    if (selectedState) {
      results = results.filter((cep) => cep.state === selectedState);
    }

    if (selectedCity) {
      results = results.filter((cep) => cep.city === selectedCity);
    }

    return results.slice(0, 50);
  }, [searchQuery, selectedState, selectedCity]);

  const handleSelectCEP = (cep: CEPData) => {
    onSelectCEP(cep.cep);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedState('');
    setSelectedCity('');
    onClose();
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Selecione seu CEP" maxWidth="lg">
      <div className="cep-modal">
        {/* Search Bar */}
        <div className="cep-modal__search">
          <div className="cep-modal__search-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <Input
            type="text"
            placeholder="Buscar por cidade, bairro ou rua..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="cep-modal__search-input"
          />
        </div>

        {/* Filters */}
        <div className="cep-modal__filters">
          <div className="cep-modal__filter">
            <label htmlFor="state-filter" className="cep-modal__filter-label">
              Estado
            </label>
            <select
              id="state-filter"
              className="cep-modal__select"
              value={selectedState}
              onChange={handleStateChange}
            >
              <option value="">Todos os estados</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {selectedState && (
            <div className="cep-modal__filter">
              <label htmlFor="city-filter" className="cep-modal__filter-label">
                Cidade
              </label>
              <select
                id="city-filter"
                className="cep-modal__select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Todas as cidades</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="cep-modal__results-info">
          {filteredCEPs.length > 0 ? (
            <p>
              {filteredCEPs.length} {filteredCEPs.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          ) : (
            <p className="cep-modal__no-results">Nenhum CEP encontrado. Tente outra busca.</p>
          )}
        </div>

        {/* Results List */}
        <div className="cep-modal__results">
          {filteredCEPs.map((cep) => (
            <button
              key={cep.cep}
              type="button"
              className="cep-modal__result-item"
              onClick={() => handleSelectCEP(cep)}
            >
              <div className="cep-modal__result-header">
                <span className="cep-modal__result-cep">{cep.cep}</span>
                <span className="cep-modal__result-badge">
                  {cep.city} - {cep.state}
                </span>
              </div>
              <div className="cep-modal__result-details">
                <p className="cep-modal__result-street">{cep.street}</p>
                <p className="cep-modal__result-neighborhood">{cep.neighborhood}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

